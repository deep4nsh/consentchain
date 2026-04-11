import algosdk from 'algosdk';
import { compressPayload, generateConsentHash } from './utils';

export interface BoxReference {
  appIndex: number;
  name: Uint8Array;
}

export interface VerifyConsentResult {
  exists: boolean;
  isExpired: boolean;
  isActive: boolean;
  payload?: {
    data_scope: string;
    purpose: string;
    expiry_date: string;
    consent_timestamp?: string;
  };
}

export class ConsentChainSDK {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private appId: number;

  constructor(algodClient: algosdk.Algodv2, indexerClient: algosdk.Indexer, appId: number) {
    this.algodClient = algodClient;
    this.indexerClient = indexerClient;
    this.appId = appId;
  }

  /**
   * Prepares the transaction group required to grant consent.
   * This includes an MBR payment and the application NoOp call.
   */
  async prepareGrant(userAddress: string, orgId: string, payload: any) {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    const appAddr = algosdk.getApplicationAddress(this.appId);

    // 1. Prepare Payload & Key
    const valueStr = compressPayload(payload);
    const valueBytes = new Uint8Array(Buffer.from(valueStr));
    const orgIdBytes = new Uint8Array(Buffer.from(orgId));

    if (valueBytes.length > 128) {
      throw new Error(`Payload too large (${valueBytes.length} bytes). Max 128 bytes allowed.`);
    }

    // 2. Box Name: Sender (32 bytes) + OrgID
    const userPubKey = algosdk.decodeAddress(userAddress).publicKey;
    const boxName = new Uint8Array([...userPubKey, ...orgIdBytes]);

    // 3. MBR Calculation (Algorand Storage Cost)
    const mbrMicroAlgos = 2500 + 400 * (boxName.length + valueBytes.length);

    // 4. APP BALANCE CHECK (Optional but recommended)
    let totalPaymentAmount = BigInt(mbrMicroAlgos);
    try {
      const appAccountInfo = await this.algodClient.accountInformation(appAddr).do();
      const minBalance = BigInt(appAccountInfo.minBalance || 100000);
      const currentBalance = BigInt(appAccountInfo.amount || 0);
      
      if (currentBalance < minBalance + BigInt(mbrMicroAlgos)) {
        // Add a small buffer (0.1 ALGO) to ensure the app stays funded for others
        const buffer = BigInt(100000); 
        const deficit = (minBalance + BigInt(mbrMicroAlgos) + buffer) - currentBalance;
        totalPaymentAmount += deficit;
      }
    } catch (err) {
      console.warn("Could not check app balance during preparation:", err);
    }

    const txns = [];

    // Payment for Box MBR
    const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: userAddress,
      receiver: appAddr.toString(),
      amount: totalPaymentAmount,
      suggestedParams,
    });
    txns.push(payTxn);

    // Application NoOp Call
    const noOpTxn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: userAddress,
      appIndex: this.appId,
      appArgs: [
        new Uint8Array(Buffer.from("Grant")),
        orgIdBytes,
        valueBytes
      ],
      suggestedParams,
      boxes: [
        { appIndex: this.appId, name: boxName }
      ]
    });
    txns.push(noOpTxn);

    algosdk.assignGroupID(txns);

    return {
      txns,
      consentHash: await generateConsentHash(payload),
      mbr_microalgos: mbrMicroAlgos
    };
  }

  /**
   * Prepares the transaction required to revoke consent.
   */
  async prepareRevoke(userAddress: string, orgId: string) {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    const orgIdBytes = new Uint8Array(Buffer.from(orgId));
    const userPubKey = algosdk.decodeAddress(userAddress).publicKey;
    const boxName = new Uint8Array([...userPubKey, ...orgIdBytes]);

    const revokeTxn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: userAddress,
      appIndex: this.appId,
      appArgs: [
        new Uint8Array(Buffer.from("Revoke")),
        orgIdBytes
      ],
      suggestedParams,
      boxes: [
        { appIndex: this.appId, name: boxName }
      ]
    });

    return [revokeTxn];
  }

  /**
   * Verifies consent for a user-org pair by querying the blockchain directly.
   * Returns a structured result with explicit boolean fields.
   */
  async verifyConsent(userAddress: string, orgId: string): Promise<VerifyConsentResult> {
    const orgIdBytes = new Uint8Array(Buffer.from(orgId));
    const userPubKey = algosdk.decodeAddress(userAddress).publicKey;
    const boxName = new Uint8Array([...userPubKey, ...orgIdBytes]);

    try {
      const boxResponse = await this.algodClient.getApplicationBoxByName(this.appId, boxName).do();
      const decodedValue = Buffer.from(boxResponse.value).toString();
      const data = JSON.parse(decodedValue);
      
      const isExpired = Date.now() > data.e;
      
      return {
        exists: true,
        isExpired,
        isActive: !isExpired,
        payload: {
          data_scope: data.s,
          purpose: data.p,
          expiry_date: new Date(data.e).toISOString(),
          consent_timestamp: data.t ? new Date(data.t).toISOString() : undefined
        }
      };
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
        return { exists: false, isExpired: true, isActive: false };
      }
      throw err;
    }
  }

  /**
   * Lists all consent records for a user across all organizations.
   * This handles both Box Storage (modern) and Application Local State (legacy).
   */
  async listUserConsents(userAddress: string) {
    const consents: any[] = [];
    const userPubKey = algosdk.decodeAddress(userAddress).publicKey;

    // 1. Fetch Boxes from Algod
    try {
      const boxesResponse = await this.algodClient.getApplicationBoxes(this.appId).do();
      const allBoxes = boxesResponse.boxes || [];

      // Filter boxes belonging to this user (prefix matches userPubKey)
      const userBoxes = allBoxes.filter((box: any) => {
        const name = box.name;
        if (name.length < 32) return false;
        for (let i = 0; i < 32; i++) {
          if (name[i] !== userPubKey[i]) return false;
        }
        return true;
      });

      for (const box of userBoxes) {
        try {
          const boxNameObj = box.name;
          const orgId = Buffer.from(boxNameObj.slice(32)).toString('utf8');
          const boxContentRes = await this.algodClient.getApplicationBoxByName(this.appId, boxNameObj).do();
          const data = JSON.parse(Buffer.from(boxContentRes.value).toString('utf8'));
          
          const expiry = data.e ? new Date(data.e) : new Date(data.exp);
          const isExpired = expiry < new Date();

          // Use stored grant timestamp, falling back to undefined (not fake "now")
          const grantTimestamp = data.t
            ? new Date(data.t).toISOString()
            : (data.timestamp || undefined);

          consents.push({
            transactionId: 'BoxVerified',
            organization_id: orgId,
            data_scope: data.s || data.scopes || '',
            purpose: data.p || data.purpose || '',
            consent_timestamp: grantTimestamp || 'Unknown',
            expiry_date: expiry.toISOString(),
            status: isExpired ? 'expired' : 'active'
          });
        } catch (e) {
          console.error("SDK: Error parsing box", e);
        }
      }
    } catch (err) {
      console.warn("SDK: Error fetching boxes", err);
    }

    // 2. Fetch Legacy Local State
    try {
      const accountInfo = await this.algodClient.accountApplicationInformation(userAddress, this.appId).do();
      const localState = accountInfo.appLocalState?.keyValue || [];
      
      for (const kv of localState) {
        const orgId = Buffer.from(kv.key as Uint8Array).toString('utf8');
        // Check if we already have this org from a box (boxes take priority)
        if (consents.some(c => c.organization_id === orgId)) continue;

        try {
          const data = JSON.parse(Buffer.from(kv.value.bytes as Uint8Array).toString('utf8'));
          const expiry = data.e ? new Date(data.e) : new Date(data.exp);
          const isExpired = expiry < new Date();

          const grantTimestamp = data.t
            ? new Date(data.t).toISOString()
            : (data.timestamp || 'Unknown');

          consents.push({
            transactionId: 'LegacyLocalState',
            organization_id: orgId,
            data_scope: data.s || data.scopes || '',
            purpose: data.p || data.purpose || '',
            consent_timestamp: grantTimestamp,
            expiry_date: expiry.toISOString(),
            status: isExpired ? 'expired' : 'active'
          });
        } catch (e) {
          console.warn(`SDK: Skipping invalid local state record for ${orgId}`);
        }
      }
    } catch (err) {
      // Common if user has never opted in manually
    }

    return consents;
  }
}

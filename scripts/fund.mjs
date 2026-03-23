import algosdk from 'algosdk';

const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const mnemonic = "egg assault old matrix prize liar knee charge net erase wheat flash match mesh spy awake pair monster person scan depth velvet thrive able public";
const sponsorAccount = algosdk.mnemonicToSecretKey(mnemonic);
const receiverAddr = "25WKYVE3NVDH3X3FX4ETRO25SLG6R2CZO3KTXPGQRT7X52CXRWWX5H5KAA";

async function fund() {
  try {
    const sponsorInfo = await algodClient.accountInformation(sponsorAccount.addr).do();
    console.log(`Sponsor Balance: ${Number(sponsorInfo.amount) / 1e6} ALGO`);

    if (sponsorInfo.amount < BigInt(1 * 1e6)) {
      console.log("Sponsor does not have enough ALGO to fund.");
      return;
    }

    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      sponsorAccount.addr,
      receiverAddr,
      5 * 1e6, // 5 ALGO
      undefined,
      undefined,
      params
    );

    const signedTxn = txn.signTxn(sponsorAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`Sent 5 ALGO. TxID: ${txId}`);
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    console.log("Confirmed!");
  } catch(e) {
    console.error(e);
  }
}

fund();

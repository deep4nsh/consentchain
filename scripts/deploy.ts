import algosdk, { Algodv2, mnemonicToSecretKey, makeApplicationCreateTxnFromObject, OnApplicationComplete } from 'algosdk';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ALGOD_SERVER = process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const ALGOD_TOKEN = process.env.ALGOD_TOKEN || '';
const ALGOD_PORT = process.env.ALGOD_PORT || 443;
const SPONSOR_MNEMONIC = process.env.SPONSOR_MNEMONIC;

if (!SPONSOR_MNEMONIC) {
    console.error("Error: SPONSOR_MNEMONIC is not set in .env.local");
    process.exit(1);
}

const algodClient = new Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
const sponsorAccount = mnemonicToSecretKey(SPONSOR_MNEMONIC);

async function compileProgram(client: Algodv2, programSource: string): Promise<Uint8Array> {
    const compileResponse = await client.compile(Buffer.from(programSource)).do();
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

async function deploy() {
    try {
        console.log("Compiling Smart Contract...");

        const approvalSource = fs.readFileSync(path.join(process.cwd(), 'contracts', 'consent_approval.teal'), 'utf8');
        const clearSource = fs.readFileSync(path.join(process.cwd(), 'contracts', 'consent_clear.teal'), 'utf8');

        const approvalProgram = await compileProgram(algodClient, approvalSource);
        const clearProgram = await compileProgram(algodClient, clearSource);

        console.log("Compilation Successful.");

        const suggestedParams = await algodClient.getTransactionParams().do();

        // Local State: 0 UInts, 16 ByteSlices (we will store JSON string payloads per Org ID, so string to string mappings)
        // Note: Max 16 key-value pairs in local state per user per app.
        const numLocalInts = 0;
        const numLocalByteSlices = 16;

        // Global State (not used in this simple contract)
        const numGlobalInts = 0;
        const numGlobalByteSlices = 0;

        console.log("Deploying Contract from account:", sponsorAccount.addr);

        const txn = makeApplicationCreateTxnFromObject({
            sender: sponsorAccount.addr,
            suggestedParams,
            onComplete: OnApplicationComplete.NoOpOC,
            approvalProgram,
            clearProgram,
            numLocalInts,
            numLocalByteSlices,
            numGlobalInts,
            numGlobalByteSlices,
        });

        const signedTxn = txn.signTxn(sponsorAccount.sk);
        console.log("Sending Transaction...");
        const txResponse = await algodClient.sendRawTransaction(signedTxn).do();

        console.log("Waiting for confirmation...");
        const txResult = await algosdk.waitForConfirmation(algodClient, txResponse.txid, 4);

        const appId = txResult.applicationIndex;
        console.log(`\n================================`);
        console.log(`✅ Smart Contract Deployed Successfully!`);
        console.log(`App ID: ${appId}`);
        console.log(`Transaction ID: ${txResponse.txid}`);
        console.log(`================================\n`);

        console.log(`Please add the following to your .env.local:`);
        console.log(`NEXT_PUBLIC_APP_ID=${appId}`);

    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

deploy();

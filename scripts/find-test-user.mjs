import algosdk from 'algosdk';
import dotenv from 'dotenv';
dotenv.config();

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || "757317680");
const INDEXER_SERVER = "https://testnet-idx.algonode.cloud";
const INDEXER_PORT = 443;
const INDEXER_TOKEN = "";

const indexer = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_SERVER, INDEXER_PORT);

async function findTestUser() {
    console.log(`Searching for users with local state in App ID: ${APP_ID}...`);
    try {
        const response = await indexer.searchAccounts().applicationID(APP_ID).do();
        const accounts = response.accounts || [];
        
        if (accounts.length === 0) {
            console.log("No accounts found with local state for this app.");
            return;
        }

        console.log(`Found ${accounts.length} accounts.`);
        for (const account of accounts) {
            console.log(`- ${account.address}`);
            // Let's just pick the first one
            break;
        }
        
        const testAddress = accounts[0].address;
        console.log(`\nUsing Test Address: ${testAddress}`);
        
    } catch (error) {
        console.error("Error finding test user:", error);
    }
}

findTestUser();

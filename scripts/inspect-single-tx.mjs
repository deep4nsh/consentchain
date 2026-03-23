import algosdk from 'algosdk';
import dotenv from 'dotenv';
dotenv.config();

const INDEXER_SERVER = "https://testnet-idx.algonode.cloud";
const INDEXER_PORT = 443;
const INDEXER_TOKEN = "";
const TX_ID = "NMZN6DF5Y6MBI4GDVQ6INSMM7TGU53QQTIXLWJTWNWC5KNKD56ZQ";

const indexer = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_SERVER, INDEXER_PORT);

async function inspectTransaction() {
    console.log(`Inspecting transaction ${TX_ID}...`);
    try {
        const response = await indexer.lookupTransactionByID(TX_ID).do();
        const t = response.transaction;
        console.log(JSON.stringify(t, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value, 2));
    } catch (error) {
        console.error("Error inspecting transaction:", error);
    }
}

inspectTransaction();

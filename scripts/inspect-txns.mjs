import algosdk from 'algosdk';
import dotenv from 'dotenv';
dotenv.config();

const APP_ID = parseInt(process.env.NEXT_PUBLIC_APP_ID || "757317680");
const INDEXER_SERVER = "https://testnet-idx.algonode.cloud";
const INDEXER_PORT = 443;
const INDEXER_TOKEN = "";
const ADDRESS = "25WKYVE3NVDH3X3FX4ETRO25SLG6R2CZO3KTXPGQRT7X52CXRWWX5H5KAA";

const indexer = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_SERVER, INDEXER_PORT);

async function inspectTransactions() {
    console.log(`Inspecting transactions for ${ADDRESS} in App ${APP_ID}...`);
    try {
        const response = await indexer.searchForTransactions()
            .address(ADDRESS)
            .applicationID(APP_ID)
            .txType('appl')
            .do();
        
        const txns = response.transactions || [];
        console.log(`Found ${txns.length} transactions.`);

        txns.forEach(t => {
            const appArgs = t['application-transaction']?.['application-args'] || [];
            console.log(`\nTxn ID: ${t.id}`);
            console.log(`Round: ${t['confirmed-round']}`);
            appArgs.forEach((arg, i) => {
                const val = Buffer.from(arg, 'base64').toString();
                console.log(`  Arg[${i}] (hex): ${Buffer.from(arg, 'base64').toString('hex')}`);
                console.log(`  Arg[${i}] (utf8): ${val}`);
            });
        });
        
    } catch (error) {
        console.error("Error inspecting transactions:", error);
    }
}

inspectTransactions();

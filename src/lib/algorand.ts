import algosdk from 'algosdk';

const algodToken = process.env.ALGOD_TOKEN || '';
const algodServer = process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const algodPort = process.env.ALGOD_PORT || 443;

// Initialize the Algorand client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Helper function to get the sponsor account
export const getSponsorAccount = (): algosdk.Account => {
  const mnemonic = process.env.SPONSOR_MNEMONIC;
  if (!mnemonic) {
    throw new Error('SPONSOR_MNEMONIC is not defined in environment variables');
  }
  return algosdk.mnemonicToSecretKey(mnemonic);
};

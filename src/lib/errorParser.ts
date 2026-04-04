export function parseAlgorandError(error: any, defaultMessage: string = "An unexpected error occurred."): string {
    const errorMsg = typeof error === 'string' ? error : (error?.message || String(error));
    const lowerError = errorMsg.toLowerCase();

    if (lowerError.includes('overspend') || lowerError.includes('tried to spend')) {
        return "Insufficient ALGO to pay the transaction fees. Please fund your wallet using the Testnet Faucet.";
    }
    if (lowerError.includes('below min')) {
         return "Your wallet balance would drop below the minimum required balance. Please add more Testnet ALGO from the faucet: https://bank.testnet.algorand.network/";
    }
    if (lowerError.includes('invalid mainnet genesis')) {
        return "Your wallet is connected to Mainnet but the app is on Testnet. Please switch your wallet network to Testnet.";
    }
    if (lowerError.includes('transaction signing failed') || lowerError.includes('user rejected')) {
        return "Transaction signing was cancelled or rejected by the user.";
    }
    if (lowerError.includes('opt in') || lowerError.includes('has not opted in')) {
        return "You need to opt-in to the smart contract before performing this action.";
    }
    if (lowerError.includes('logic eval error')) {
        if (lowerError.includes('assert failed')) {
            return "Smart contract assertion failed. This might be due to an invalid organization ID or an expired consent attempt.";
        }
        return "The smart contract rejected the transaction due to a logic error.";
    }
    if (lowerError.includes('network request error')) {
        return "Network request failed. Please check your internet connection or the Algorand node status.";
    }

    // Default fallback (we return the raw message only if it's not a huge technical dump, but to be safe, we use the defaultMessage)
    // Actually, maybe returning the original error if it's short, else default
    if (errorMsg.length < 100 && !errorMsg.includes('TransactionPool')) {
        return errorMsg; 
    }

    return defaultMessage;
}

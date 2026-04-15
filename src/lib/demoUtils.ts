/**
 * Utility to generate consistent mock identity data from a wallet address.
 * Useful for demo portals where we want the UI to feel personalized 
 * to whoever connects their wallet.
 */

const PATIENT_NAMES = [
  "Alexander Vance", "Beatrix Thorne", "Caleb Sterling", "Dorian Gray", 
  "Elias Vance", "Fiona Glenanne", "Gideon Graves", "Helena Troy",
  "Isabella Vane", "Julian Black", "Kaelen Voss", "Lyra Belacqua"
];

const BANKER_NAMES = [
  "Baron Rothschild", "Sterling Archer", "Vivienne Westwood", "Maximilian Power",
  "Octavia Spencer", "Quentin Tarantino", "Reginald Jeeves", "Sloane Peterson"
];

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getPatientIdentity(address: string) {
  if (!address) return { name: "Guest", id: "#00000" };
  const hash = stringToHash(address);
  const name = PATIENT_NAMES[hash % PATIENT_NAMES.length];
  const idNum = (hash % 90000) + 10000;
  return {
    name,
    id: `#${idNum}`,
    dob: `${1970 + (hash % 30)}-${(hash % 12) + 1}-${(hash % 28) + 1}`,
    bloodType: ["A+", "B+", "AB+", "O-", "O+"][hash % 5]
  };
}

export function getBankIdentity(address: string) {
  if (!address) return { name: "Prospect", id: "PENDING" };
  const hash = stringToHash(address);
  const name = BANKER_NAMES[hash % BANKER_NAMES.length];
  const tier = ["DIAMOND", "PLATINUM", "GOLD", "ELITE"][hash % 4];
  const balance = ((hash % 1000) * 123.45 + 5000).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  return {
    name,
    tier,
    balance,
    accountNo: `****${(hash % 9000) + 1000}`
  };
}

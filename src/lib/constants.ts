export interface Organization { id: string; name: string }
export interface DataScope { id: string; label: string }
export interface Purpose { id: string; label: string }
export interface Duration { value: number; label: string }

export const ORGANIZATIONS: Organization[] = [
    { id: 'health-vault-demo', name: "St. Mary's HealthVault" },
    { id: 'finsentinel-demo', name: 'FinSentinel Wealth' },
    { id: 'ultracover-demo', name: 'UltraCover Insurance' },
    { id: 'indiamart', name: 'IndiaMART B2B Net' },
];

// Maps old/legacy org IDs to their canonical ORGANIZATIONS name.
// This ensures on-chain data written with older IDs still displays correctly.
export const LEGACY_ORG_NAMES: Record<string, string> = {
    // Old demo page IDs
    'apollo_hospitals': "St. Mary's HealthVault",
    'icici_bank': 'FinSentinel Wealth',
    'hdfc_bank': 'FinSentinel Wealth',
    'zomato_health': 'UltraCover Insurance',
    // Old portal-specific IDs (pre-standardization)
    'apollo-health-demo': "St. Mary's HealthVault",
    'meta-finance-demo': 'FinSentinel Wealth',
};

export const resolveOrganizationName = (id: string): string => {
    const org = ORGANIZATIONS.find(o => o.id === id);
    if (org) return org.name;
    return LEGACY_ORG_NAMES[id] || id;
};

export const DATA_SCOPES: DataScope[] = [
    { id: 'medical_history', label: 'Clinical Medical History' },
    { id: 'vitals', label: 'Real-time Biometric Vitals' },
    { id: 'financial_records', label: 'Institutional Financial Records' },
    { id: 'claims_history', label: 'Liability Claims & Evidence' },
];

export const PURPOSES: Purpose[] = [
    { id: 'research', label: 'Academic & Medical Research' },
    { id: 'service_provision', label: 'Service Provision & Optimization' },
    { id: 'marketing', label: 'Targeted Marketing' },
];

export const DURATIONS: Duration[] = [
    { value: 1, label: '1 Month' },
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '1 Year' },
];

export interface Organization { id: string; name: string }
export interface DataScope { id: string; label: string }
export interface Purpose { id: string; label: string }
export interface Duration { value: number; label: string }

export const ORGANIZATIONS: Organization[] = [
    { id: 'ORG001', name: 'HealthPlus Research' },
    { id: 'ORG002', name: 'Global Finance Corp' },
    { id: 'ORG003', name: 'City Transport Authority' },
];

export const DATA_SCOPES: DataScope[] = [
    { id: 'medical_history', label: 'Medical History' },
    { id: 'vitals', label: 'Vitals & Activity Log' },
    { id: 'financial_records', label: 'Financial Records' },
    { id: 'location_data', label: 'Real-time Location Data' },
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

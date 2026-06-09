export type PaymentPreferencesTab =
  | 'payment-methods'
  | 'global-preferences'
  | 'advanced-settings';

export const paymentPreferencesTabs: Array<{
  id: PaymentPreferencesTab;
  label: string;
}> = [
  { id: 'payment-methods', label: 'Payment Methods' },
  { id: 'global-preferences', label: 'Global Preferences' },
  { id: 'advanced-settings', label: 'Advanced Settings' },
];

export interface PayerCard {
  id: string;
  customerName: string;
  last4: string;
  expiry: string;
  active: boolean;
}

export const payerCards: PayerCard[] = [
  {
    id: '1',
    customerName: 'Sneaker Lab',
    last4: '4532',
    expiry: '12/2028',
    active: true,
  },
  {
    id: '2',
    customerName: "He's Organic Foods",
    last4: '3423',
    expiry: '12/2028',
    active: true,
  },
  {
    id: '3',
    customerName: "Lily's Flower Shop",
    last4: '4044',
    expiry: '12/2028',
    active: true,
  },
  {
    id: '4',
    customerName: 'Rad Roofing',
    last4: '4310',
    expiry: '12/2028',
    active: true,
  },
  {
    id: '5',
    customerName: "Likang's Bakery",
    last4: '4022',
    expiry: '12/2028',
    active: true,
  },
  {
    id: '6',
    customerName: 'Kunzify',
    last4: '0022',
    expiry: '12/2028',
    active: true,
  },
];

export const TOTAL_PAYER_CARDS = 15;

export const AUTOMATIC_CARD_PROCESSING_DATE_INITIATED = 'June 10, 2024';

export type GlobalPaymentMethodValue =
  | 'quick-pay'
  | 'citibank'
  | 'wells-fargo'
  | 'check-billing-address'
  | 'check-business-address';

export interface GlobalPaymentPreferences {
  primary: GlobalPaymentMethodValue | '';
  secondary: GlobalPaymentMethodValue | '';
  third: GlobalPaymentMethodValue | '';
}

export type PayerPaymentMethodValue =
  | 'quick-pay'
  | 'chase-bank'
  | 'check-billing-address'
  | 'check-business-address';

export interface PayerSpecificPreferenceRow {
  id: string;
  payerId: string;
  entityId: string;
  primary: PayerPaymentMethodValue | '';
  secondary: PayerPaymentMethodValue | '';
  third: PayerPaymentMethodValue | '';
}

export const ENTITY_ON_FILE_TOOLTIP =
  'Payers may maintain multiple records for a business, such as distinct lines of business or unintentional duplicate records. Use this field to specify payment preferences for each entity as needed.';

export const payerOptions = [
  {
    label: 'Luminous Technologies',
    value: 'luminous-technologies',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
  {
    label: 'Brave Enterprises',
    value: 'brave-enterprises',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
  {
    label: 'Fashionista House',
    value: 'fashionista-house-1',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
  {
    label: 'Fashionista House',
    value: 'fashionista-house-2',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
  {
    label: 'Luxe Moda',
    value: 'luxe-moda',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
  {
    label: 'Alphaco',
    value: 'alphaco',
    icon: 'user',
    iconVariant: 'solid' as const,
  },
];

export const entityOptions = [
  {
    label: 'All entities',
    value: 'all',
    description: '',
    descriptionPosition: 'inline' as const,
    triggerDescription: '',
  },
  {
    label: 'Big Kahuna',
    value: '97174',
    description: 'ID: 97174',
    descriptionPosition: 'inline' as const,
    triggerDescription: '- ID: 97174',
  },
  {
    label: 'Big Kahuna Burger',
    value: '43756',
    description: 'ID: 43756',
    descriptionPosition: 'inline' as const,
    triggerDescription: '- ID: 43756',
  },
  {
    label: 'Big Kahuna 2',
    value: '43178',
    description: 'ID: 43178',
    descriptionPosition: 'inline' as const,
    triggerDescription: '- ID: 43178',
  },
  {
    label: 'Big Kahuna 3',
    value: '22739',
    description: 'ID: 22739',
    descriptionPosition: 'inline' as const,
    triggerDescription: '- ID: 22739',
  },
];

export const payerPaymentMethodOptions: Array<{
  label: string;
  value: PayerPaymentMethodValue;
  icon: string;
  iconVariant: 'custom' | 'solid' | 'outline';
  description: string;
  descriptionPosition: 'below';
  triggerDescription?: string;
}> = [
  {
    label: "Accept Payer's Card",
    value: 'quick-pay',
    icon: 'credit-card-sparkle',
    iconVariant: 'custom' as const,
    description: 'Immediate payment',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
  {
    label: 'Chase Bank Account',
    value: 'chase-bank',
    icon: 'library',
    iconVariant: 'solid' as const,
    description: '••••2956',
    descriptionPosition: 'below' as const,
    triggerDescription: '••••2956',
  },
  {
    label: 'Check • Billing Address',
    value: 'check-billing-address',
    icon: 'building-office',
    iconVariant: 'solid' as const,
    description: '1 Chapel Hill Rd, Short Hills, NJ 07078, US',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
  {
    label: 'Check • Business Address',
    value: 'check-business-address',
    icon: 'building-office',
    iconVariant: 'solid' as const,
    description: '3476 Orphan Road, Hayward, WI 54843, US',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
];

export const createEmptyPayerPreferenceRow =
  (): PayerSpecificPreferenceRow => ({
    id: `payer-pref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    payerId: '',
    entityId: 'all',
    primary: '',
    secondary: '',
    third: '',
  });

export const getPayerLabel = (payerId: string) =>
  payerOptions.find((option) => option.value === payerId)?.label ?? '';

export const defaultGlobalPaymentPreferences: GlobalPaymentPreferences = {
  primary: 'quick-pay',
  secondary: '',
  third: '',
};

export const globalPaymentMethodOptions: Array<{
  label: string;
  value: GlobalPaymentMethodValue;
  icon: string;
  iconVariant: 'custom' | 'solid' | 'outline';
  description: string;
  descriptionPosition: 'below';
  triggerDescription?: string;
}> = [
  {
    label: "Accept Payer's Card",
    value: 'quick-pay',
    icon: 'credit-card-sparkle',
    iconVariant: 'custom' as const,
    description: 'Immediate payment',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
  {
    label: 'Citibank Account',
    value: 'citibank',
    icon: 'library',
    iconVariant: 'solid' as const,
    description: '••••3674',
    descriptionPosition: 'below' as const,
    triggerDescription: '••••3674',
  },
  {
    label: 'Wells Fargo Account',
    value: 'wells-fargo',
    icon: 'library',
    iconVariant: 'solid' as const,
    description: '••••8419',
    descriptionPosition: 'below' as const,
    triggerDescription: '••••8419',
  },
  {
    label: 'Check • Billing Address',
    value: 'check-billing-address',
    icon: 'building-office',
    iconVariant: 'solid' as const,
    description: '1 Chapel Hill Rd, Short Hills, NJ 07078, United States',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
  {
    label: 'Check • Business Address',
    value: 'check-business-address',
    icon: 'building-office',
    iconVariant: 'solid' as const,
    description: '1 Chapel Hill Rd, Short Hills, NJ 07078, United States',
    descriptionPosition: 'below' as const,
    triggerDescription: '',
  },
];

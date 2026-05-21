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

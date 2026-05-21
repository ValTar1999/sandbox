export type SmartExchangeTab = 'pending' | 'paid' | 'exceptions';

export interface SmartExchangeCardDetails {
  cardNumber: string;
  expiry: string;
  expiryDisplay: string;
  cvc2: string;
  cardholderName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type SmartExchangePaymentMethod =
  | { kind: 'smart_exchange' }
  | {
      kind: 'card';
      last4: string;
      brand: 'visa';
      details: SmartExchangeCardDetails;
    };

export type SmartExchangeRowStatus =
  | 'pending_your_action'
  | 'paid'
  | 'exception';

export interface SmartExchangePayment {
  id: string;
  tab: SmartExchangeTab;
  amountCents: number;
  vendorEntry: string;
  invoiceNumber: string;
  customer: string;
  dateInitiated: string;
  paymentMethod: SmartExchangePaymentMethod;
  status: SmartExchangeRowStatus;
  /** Pending tab: whether user should see primary CTA */
  showGetPaid: boolean;
  /** Shown in expanded panel (Receivables-style) */
  notes?: string;
}

export const smartExchangePayments: SmartExchangePayment[] = [
  {
    id: '1',
    tab: 'pending',
    amountCents: 189_200,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-B',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-28',
    paymentMethod: { kind: 'smart_exchange' },
    status: 'pending_your_action',
    showGetPaid: true,
    notes: 'Payment awaiting acceptance in SMART Exchange.',
  },
  {
    id: '2',
    tab: 'pending',
    amountCents: 245_000,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-C',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-27',
    paymentMethod: {
      kind: 'card',
      last4: '5612',
      brand: 'visa',
      details: {
        cardNumber: '5444 1234 0000 5612',
        expiry: '12/2026',
        expiryDisplay: '12/26',
        cvc2: '999',
        cardholderName: 'Horizon Inc',
        addressLine1: '3476 Commerce Ave.',
        addressLine2: 'Suite 1010',
        city: 'Hayward',
        state: 'Wisconsin',
        zip: '54843',
        country: 'United States',
      },
    },
    status: 'pending_your_action',
    showGetPaid: false,
    notes: 'Card on file — review before release.',
  },
  {
    id: '3',
    tab: 'pending',
    amountCents: 1200_00,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-D',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-26',
    paymentMethod: { kind: 'smart_exchange' },
    status: 'pending_your_action',
    showGetPaid: true,
  },
  {
    id: '4',
    tab: 'pending',
    amountCents: 89_990,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-E',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-25',
    paymentMethod: {
      kind: 'card',
      last4: '5612',
      brand: 'visa',
      details: {
        cardNumber: '5444 1234 0000 5612',
        expiry: '12/2026',
        expiryDisplay: '12/26',
        cvc2: '999',
        cardholderName: 'Horizon Inc',
        addressLine1: '3476 Commerce Ave.',
        addressLine2: 'Suite 1010',
        city: 'Hayward',
        state: 'Wisconsin',
        zip: '54843',
        country: 'United States',
      },
    },
    status: 'pending_your_action',
    showGetPaid: false,
  },
  {
    id: '5',
    tab: 'pending',
    amountCents: 432_500,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-F',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-24',
    paymentMethod: { kind: 'smart_exchange' },
    status: 'pending_your_action',
    showGetPaid: true,
  },
  {
    id: '6',
    tab: 'pending',
    amountCents: 15_750,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: 'KQ5-G',
    customer: 'Horizon Inc',
    dateInitiated: '2024-06-23',
    paymentMethod: { kind: 'smart_exchange' },
    status: 'pending_your_action',
    showGetPaid: true,
  },
  ...Array.from({ length: 156 }, (_, i) => ({
    id: `paid-${i}`,
    tab: 'paid' as const,
    amountCents: 100_00 + i * 100,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: `PD-${i}`,
    customer: 'Horizon Inc',
    dateInitiated: '2024-05-15',
    paymentMethod: { kind: 'smart_exchange' as const },
    status: 'paid' as const,
    showGetPaid: false,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `exc-${i}`,
    tab: 'exceptions' as const,
    amountCents: 50_00 + i * 50,
    vendorEntry: 'Pinnacle Group',
    invoiceNumber: `EX-${i}`,
    customer: 'Horizon Inc',
    dateInitiated: '2024-04-01',
    paymentMethod: {
      kind: 'card' as const,
      last4: '4242',
      brand: 'visa' as const,
      details: {
        cardNumber: '4111 1111 1111 4242',
        expiry: '08/2027',
        expiryDisplay: '08/27',
        cvc2: '123',
        cardholderName: 'Horizon Inc',
        addressLine1: '3476 Commerce Ave.',
        addressLine2: 'Suite 1010',
        city: 'Hayward',
        state: 'Wisconsin',
        zip: '54843',
        country: 'United States',
      },
    },
    status: 'exception' as const,
    showGetPaid: false,
  })),
];

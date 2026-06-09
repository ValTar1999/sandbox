export const INITIAL_DISPUTE_FORM = {
  firstName: 'Johnny',
  lastName: 'Anderson',
  company: 'Big Kahuna Burger Ltd',
  email: '',
  phone: '',
  message: '',
};

export type DisputeFormState = typeof INITIAL_DISPUTE_FORM;
export type DisputeFormField = keyof DisputeFormState;
export type DisputeFormErrors = Partial<Record<DisputeFormField, string>>;

export const paymentMethodOptions = [
  {
    label: "Accept Payer's Card",
    value: 'quick-pay',
    icon: 'credit-card-sparkle',
    iconVariant: 'custom' as const,
    description: 'No bank account details required, immediate',
    descriptionPosition: 'below' as const,
  },
  {
    label: 'Send to Bank Account',
    value: 'bank-account',
    icon: 'building-library',
    iconVariant: 'solid' as const,
    description: 'Typically processed in 1-3 business days',
    descriptionPosition: 'below' as const,
  },
  {
    label: 'Request a Paper Check',
    value: 'paper-check',
    icon: 'document-text',
    iconVariant: 'outline' as const,
    description: 'Slowest form of payment (approximately 7-10 days)',
    descriptionPosition: 'below' as const,
  },
];

export const bankAccountOptions = [
  {
    label: 'Wells Fargo Account',
    value: 'wells-fargo',
    icon: 'library',
    description: '••••8419',
    descriptionPosition: 'below' as const,
  },
  {
    label: 'Citibank Account',
    value: 'citibank',
    icon: 'library',
    description: '••••3674',
    descriptionPosition: 'below' as const,
  },
];

export const SIGNATURE_NAME_PATTERN = /^[a-zA-Z0-9.\\/\\'_:,#&\s-]+$/;
export const SIGNATURE_INVALID_CHARS_MESSAGE =
  "You can only use letters, numbers, full stop (.), hyphen (-), forward slash (/), backslash (\\), single quote ('), underscore (_), comma (,), colon (:), hash (#), ampersand (&).";

export type SignatureMode = 'draw' | 'type';

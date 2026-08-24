import {
  payerOptions,
  type GlobalPaymentPreferences,
  type PayerSpecificPreferenceRow,
} from './data';

export const PAYMENT_PREFERENCE_SLOTS = [
  'primary',
  'secondary',
  'third',
] as const;

export type PaymentPreferenceSlot = (typeof PAYMENT_PREFERENCE_SLOTS)[number];

export function getOptionsForPreferenceSlot<
  T extends string,
  O extends { value: T },
>(
  slot: PaymentPreferenceSlot,
  values: Record<PaymentPreferenceSlot, T | ''>,
  allOptions: O[]
): O[] {
  const currentValue = values[slot];
  const otherValues = PAYMENT_PREFERENCE_SLOTS.filter((key) => key !== slot)
    .map((key) => values[key])
    .filter((value): value is T => value !== '');

  return allOptions.filter(
    (option) =>
      !otherValues.includes(option.value) || option.value === currentValue
  );
}

export function getPreferenceOptionsBySlot<
  T extends string,
  O extends { value: T },
>(
  values: Record<PaymentPreferenceSlot, T | ''>,
  allOptions: O[]
): Record<PaymentPreferenceSlot, O[]> {
  return PAYMENT_PREFERENCE_SLOTS.reduce(
    (acc, slot) => {
      acc[slot] = getOptionsForPreferenceSlot(slot, values, allOptions);
      return acc;
    },
    {} as Record<PaymentPreferenceSlot, O[]>
  );
}

export type ResolvedPaymentMethod = {
  method: 'quick-pay' | 'bank-account' | 'paper-check';
  bankAccount?: 'wells-fargo' | 'citibank';
};

/**
 * Preferences and the Get Paid wizard use different vocabularies. `chase-bank`
 * has no counterpart among the Get Paid bank accounts, so it is unresolvable
 * and the next preference slot is used instead.
 */
const GET_PAID_EQUIVALENTS: Record<string, ResolvedPaymentMethod | null> = {
  'quick-pay': { method: 'quick-pay' },
  citibank: { method: 'bank-account', bankAccount: 'citibank' },
  'wells-fargo': { method: 'bank-account', bankAccount: 'wells-fargo' },
  'check-billing-address': { method: 'paper-check' },
  'check-business-address': { method: 'paper-check' },
  'chase-bank': null,
};

/**
 * Picks the payment method the payer should be charged with: the payer specific
 * row wins over the global preferences, and within either one the first slot
 * that maps onto a Get Paid option wins.
 */
export const resolvePaymentMethod = ({
  payerName,
  globalPreferences,
  payerPreferenceRows,
}: {
  payerName: string;
  globalPreferences: GlobalPaymentPreferences;
  payerPreferenceRows: PayerSpecificPreferenceRow[];
}): ResolvedPaymentMethod | null => {
  const payerIds = payerOptions
    .filter((option) => option.label === payerName)
    .map((option) => option.value);
  const rowsForPayer = payerPreferenceRows.filter((row) =>
    payerIds.includes(row.payerId)
  );
  const source =
    rowsForPayer.find((row) => row.entityId === 'all') ??
    rowsForPayer[0] ??
    globalPreferences;

  for (const slot of PAYMENT_PREFERENCE_SLOTS) {
    const preference = source[slot];
    if (!preference) continue;

    const resolved = GET_PAID_EQUIVALENTS[preference];
    if (resolved) return resolved;
  }

  return null;
};

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

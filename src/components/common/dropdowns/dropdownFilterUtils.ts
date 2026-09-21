export type FilterCategoryId = string;

export type FilterSelections = Partial<Record<FilterCategoryId, string[]>>;

export type FilterCategory = {
  id: FilterCategoryId;
  label: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  listTitle?: string;
  type?: 'list' | 'amountRange' | 'dateRange';
  options: string[];
};

export type AppliedFilterChip = {
  categoryId: FilterCategoryId;
  categoryLabel: string;
  count: number;
  value: string;
  showCount: boolean;
};

export const RANGE_FROM_INDEX = 0;
export const RANGE_TO_INDEX = 1;

export const isAmountValueSet = (value?: string) =>
  Boolean(value && value.trim() !== '' && value.trim() !== '0.00');

export const isDateValueSet = (value?: string) =>
  Boolean(value && value.trim() !== '');

export const getRangeValues = (
  selections: FilterSelections,
  categoryId: FilterCategoryId
) => {
  const values = selections[categoryId] ?? [];
  return {
    from: values[RANGE_FROM_INDEX] ?? '',
    to: values[RANGE_TO_INDEX] ?? '',
  };
};

export const formatAmountChipValue = (from: string, to: string) => {
  const fromLabel = isAmountValueSet(from) ? `$${from}` : null;
  const toLabel = isAmountValueSet(to) ? `$${to}` : null;
  if (fromLabel && toLabel) return `${fromLabel} – ${toLabel}`;
  if (fromLabel) return `From ${fromLabel}`;
  if (toLabel) return `To ${toLabel}`;
  return '';
};

export const formatDateChipValue = (from: string, to: string) => {
  const fromLabel = isDateValueSet(from) ? from : null;
  const toLabel = isDateValueSet(to) ? to : null;
  if (fromLabel && toLabel) return `${fromLabel} – ${toLabel}`;
  if (fromLabel) return `From ${fromLabel}`;
  if (toLabel) return `To ${toLabel}`;
  return '';
};

/** Formats typed digits into MM/DD/YYYY as the user types. */
export const formatMmDdYyyyInput = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/** Default payables filter categories — Bills Payables table data. */
export const PAYABLES_FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'payee',
    label: 'Payee',
    searchable: true,
    searchPlaceholder: 'Search payee',
    listTitle: 'Payee Name',
    options: [
      'Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.',
      'Rad Roofing',
      "Lily's Flower Shop",
      'Big Kahuna Burger Ltd.',
      'Liam Anderson',
      'Ava Martinez',
      'Ethan Sullivan',
      'Carlos Romero',
      'Ava Schmidt',
      'Eva Schmidt',
      'Noah Thompson',
      'Emma Fischer',
      'James Okafor',
      'Isabella Laurent',
    ],
  },
  {
    id: 'paymentType',
    label: 'Payment Type',
    listTitle: 'Payment Type',
    options: ['Card', 'ACH', 'Wire', 'SMART Disburse', 'SMART Exchange'],
  },
  {
    id: 'status',
    label: 'Status',
    listTitle: 'Status',
    options: [
      'Unprocessed',
      'Processing',
      'Pending Initiation',
      'Initiated',
      'Scheduled',
      'Past Due',
      'Paid',
      'Failed',
    ],
  },
  {
    id: 'checkStatus',
    label: 'Check Status',
    listTitle: 'Check Status',
    options: ['Voided', 'Returned'],
  },
  {
    id: 'failureReasons',
    label: 'Failure Reasons',
    listTitle: 'Failure Reasons',
    options: [
      'Revoked due to OTP',
      'Revoked due to Security Questions',
      'Revoked due to Dispute',
      'Token Expired',
      'Payment Failed',
      'Internal Error',
    ],
  },
  {
    id: 'amount',
    label: 'Amount',
    listTitle: 'Amount',
    type: 'amountRange',
    options: [],
  },
  {
    id: 'dueDate',
    label: 'Due Date',
    listTitle: 'Due Date',
    type: 'dateRange',
    options: [],
  },
  {
    id: 'paymentDate',
    label: 'Payment Date',
    listTitle: 'Payment Date',
    type: 'dateRange',
    options: [],
  },
  {
    id: 'source',
    label: 'Source',
    listTitle: 'Source',
    options: ['Sage (ERP)', 'Batch Upload', 'SMART API'],
  },
];

/** @deprecated use PAYABLES_FILTER_CATEGORIES or pass page-specific categories */
export const FILTER_CATEGORIES = PAYABLES_FILTER_CATEGORIES;

export const emptySelections = (): FilterSelections => ({});

export const countSelected = (
  categoryId: FilterCategoryId,
  values?: string[],
  categories: FilterCategory[] = PAYABLES_FILTER_CATEGORIES
) => {
  const category = categories.find((item) => item.id === categoryId);
  if (category?.type === 'amountRange') {
    const from = values?.[RANGE_FROM_INDEX] ?? '';
    const to = values?.[RANGE_TO_INDEX] ?? '';
    return isAmountValueSet(from) || isAmountValueSet(to) ? 1 : 0;
  }
  if (category?.type === 'dateRange') {
    const from = values?.[RANGE_FROM_INDEX] ?? '';
    const to = values?.[RANGE_TO_INDEX] ?? '';
    return isDateValueSet(from) || isDateValueSet(to) ? 1 : 0;
  }
  return values?.length ?? 0;
};

export const countAllSelected = (
  selections: FilterSelections,
  categories: FilterCategory[] = PAYABLES_FILTER_CATEGORIES
) =>
  (Object.keys(selections) as FilterCategoryId[]).reduce(
    (sum, categoryId) =>
      sum + countSelected(categoryId, selections[categoryId], categories),
    0
  );

export const countActiveCategories = (
  selections: FilterSelections,
  categories: FilterCategory[] = PAYABLES_FILTER_CATEGORIES
) =>
  categories.filter(
    (category) =>
      countSelected(category.id, selections[category.id], categories) > 0
  ).length;

export const getAppliedFilterChips = (
  selections: FilterSelections,
  categories: FilterCategory[] = PAYABLES_FILTER_CATEGORIES
): AppliedFilterChip[] => {
  const chips: AppliedFilterChip[] = [];

  for (const category of categories) {
    if (category.type === 'amountRange') {
      const { from, to } = getRangeValues(selections, category.id);
      const value = formatAmountChipValue(from, to);
      if (!value) continue;
      chips.push({
        categoryId: category.id,
        categoryLabel: category.label,
        count: 1,
        value,
        showCount: false,
      });
      continue;
    }

    if (category.type === 'dateRange') {
      const { from, to } = getRangeValues(selections, category.id);
      const value = formatDateChipValue(from, to);
      if (!value) continue;
      chips.push({
        categoryId: category.id,
        categoryLabel: category.label,
        count: 1,
        value,
        showCount: false,
      });
      continue;
    }

    const values = selections[category.id] ?? [];
    if (values.length === 0) continue;

    chips.push({
      categoryId: category.id,
      categoryLabel: category.label,
      count: values.length,
      value: values.join(', '),
      showCount: true,
    });
  }

  return chips;
};

export const removeFilterCategory = (
  selections: FilterSelections,
  categoryId: FilterCategoryId
): FilterSelections => {
  const next = { ...selections };
  delete next[categoryId];
  return next;
};

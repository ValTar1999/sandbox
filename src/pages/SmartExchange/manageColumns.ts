import type { SmartExchangeTab } from './data';

/** Columns that can appear in SmartExchangePaymentsTable (expand / actions are fixed). */
export type SmartExchangeColumnId =
  | 'amount'
  | 'vendorEntry'
  | 'invoiceNumber'
  | 'customer'
  | 'dateInitiated'
  | 'paymentMethod'
  | 'status';

export type SmartExchangeColumnConfig = {
  id: SmartExchangeColumnId;
  visible: boolean;
};

export type SmartExchangeColumnDefinition = {
  id: SmartExchangeColumnId;
  label: string;
  badge?: string;
};

export const COLUMN_DEFINITIONS: Record<
  SmartExchangeColumnId,
  SmartExchangeColumnDefinition
> = {
  amount: { id: 'amount', label: 'Amount' },
  vendorEntry: { id: 'vendorEntry', label: 'Vendor Entry' },
  invoiceNumber: { id: 'invoiceNumber', label: 'Invoice #' },
  customer: { id: 'customer', label: 'Customer' },
  dateInitiated: { id: 'dateInitiated', label: 'Date Initiated' },
  paymentMethod: { id: 'paymentMethod', label: 'Payment Method' },
  status: { id: 'status', label: 'Status' },
};

export const ALL_COLUMN_IDS: SmartExchangeColumnId[] = [
  'amount',
  'vendorEntry',
  'invoiceNumber',
  'customer',
  'dateInitiated',
  'paymentMethod',
  'status',
];

/** Default-visible columns per tab — matches current SmartExchangePaymentsTable. */
export const ACTIVE_COLUMNS_BY_TAB: Record<
  SmartExchangeTab,
  SmartExchangeColumnId[]
> = {
  pending: [...ALL_COLUMN_IDS],
  paid: [...ALL_COLUMN_IDS],
  exceptions: [...ALL_COLUMN_IDS],
};

export const getDefaultColumnsForTab = (
  tab: SmartExchangeTab
): SmartExchangeColumnConfig[] => {
  const active = ACTIVE_COLUMNS_BY_TAB[tab];
  const activeSet = new Set(active);

  const activeConfigs = active.map((id) => ({ id, visible: true }));
  const inactiveConfigs = ALL_COLUMN_IDS.filter((id) => !activeSet.has(id)).map(
    (id) => ({ id, visible: false })
  );

  return [...activeConfigs, ...inactiveConfigs];
};

export const DEFAULT_COLUMNS_BY_TAB: Record<
  SmartExchangeTab,
  SmartExchangeColumnConfig[]
> = {
  pending: getDefaultColumnsForTab('pending'),
  paid: getDefaultColumnsForTab('paid'),
  exceptions: getDefaultColumnsForTab('exceptions'),
};

export const getManageColumnDefinition = (id: SmartExchangeColumnId) =>
  COLUMN_DEFINITIONS[id];

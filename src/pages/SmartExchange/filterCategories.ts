import { smartExchangePayments } from './data';
import type { FilterCategory } from '../../components/common/dropdowns/dropdownFilterUtils';

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

const customerOptions = uniqueSorted(
  smartExchangePayments.map((row) => row.customer)
);
const vendorOptions = uniqueSorted(
  smartExchangePayments.map((row) => row.vendorEntry)
);

/** Filter categories adapted to the SMART Exchange table columns/data. */
export const SMART_EXCHANGE_FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'customer',
    label: 'Customer',
    searchable: true,
    searchPlaceholder: 'Search customer',
    listTitle: 'Customer Name',
    options: customerOptions,
  },
  {
    id: 'vendorEntry',
    label: 'Vendor Entry',
    searchable: true,
    searchPlaceholder: 'Search vendor',
    listTitle: 'Vendor Entry',
    options: vendorOptions,
  },
  {
    id: 'paymentMethod',
    label: 'Payment Method',
    listTitle: 'Payment Method',
    options: ['SMART Exchange', 'Card'],
  },
  {
    id: 'status',
    label: 'Status',
    listTitle: 'Status',
    options: ['Pending Your Action', 'Paid', 'Exception'],
  },
  {
    id: 'amount',
    label: 'Amount',
    listTitle: 'Amount',
    type: 'amountRange',
    options: [],
  },
  {
    id: 'dateInitiated',
    label: 'Date Initiated',
    listTitle: 'Date Initiated',
    type: 'dateRange',
    options: [],
  },
];

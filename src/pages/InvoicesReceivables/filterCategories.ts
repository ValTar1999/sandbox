import { receivables } from './data';
import type { FilterCategory } from '../../components/common/dropdowns/dropdownFilterUtils';

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

const customerOptions = uniqueSorted(receivables.map((row) => row.customer));

/** Filter categories adapted to the Receivables table columns/data. */
export const RECEIVABLES_FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'customer',
    label: 'Customer',
    searchable: true,
    searchPlaceholder: 'Search customer',
    listTitle: 'Customer Name',
    options: customerOptions,
  },
  {
    id: 'paymentType',
    label: 'Payment Type',
    listTitle: 'Payment Type',
    options: ['SMART Collect', 'Bank', 'Card', 'RFP', 'ACH'],
  },
  {
    id: 'status',
    label: 'Status',
    listTitle: 'Status',
    options: [
      'Unprocessed',
      'Processing',
      'Past Due',
      'Paid',
      'Failed',
      'Waiting On Customer',
      'In Process',
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
    id: 'created',
    label: 'Created',
    listTitle: 'Created',
    type: 'dateRange',
    options: [],
  },
  {
    id: 'dueDate',
    label: 'Due Date',
    listTitle: 'Due Date',
    type: 'dateRange',
    options: [],
  },
];

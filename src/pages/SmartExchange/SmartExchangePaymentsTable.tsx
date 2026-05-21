import React, {
  useState,
  useCallback,
  useEffect,
  type ComponentProps,
} from 'react';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import Icon from '../../components/common/base/Icon';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import Menu, { useMenuContext } from '../../components/common/base/Menu';
import Tooltip, {
  TooltipTrigger,
  TooltipContent,
} from '../../components/common/base/Tooltip';
import ExpandableTableRow from '../../components/common/base/ExpandableTableRow';
import ExpandableRow from '../../components/common/base/ExpandableRow';
import {
  TH_CLASS,
  TH_TEXT_CLASS,
  TD_CLASS,
  FLEX_END,
  FLEX_START,
} from '../../constants/tableStyles';
import type { SmartExchangePayment, SmartExchangeRowStatus } from './data';
import VisaCardIcon from '../../assets/image/visa-card.svg';
import ViewCardDetailsModal from '../../modals/ViewCardDetailsModal';

const formatAmountValue = (amountCents: number) => {
  const n = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
};

const PaymentMethodCell = ({
  method,
}: {
  method: SmartExchangePayment['paymentMethod'];
}) => {
  if (method.kind === 'smart_exchange') {
    return (
      <span className="text-sm font-medium whitespace-nowrap text-gray-900">
        SMART Exchange
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {method.brand === 'visa' ? (
        <img
          src={VisaCardIcon}
          alt="Visa"
          className="h-4 w-6 shrink-0 object-contain"
          width={24}
          height={16}
        />
      ) : null}
      <span className="text-sm text-gray-900">{method.last4}</span>
    </div>
  );
};

const StatusCell = ({ status }: { status: SmartExchangeRowStatus }) => {
  if (status === 'pending_your_action') {
    return (
      <Badge
        size="sm"
        color="yellow"
        icon="clock"
        iconVariant="solid"
        iconDirection="left"
      >
        Pending Your Action
      </Badge>
    );
  }
  if (status === 'paid') {
    return (
      <Badge size="sm" color="green" icon="check-circle" iconDirection="left">
        Paid
      </Badge>
    );
  }
  return (
    <Badge size="sm" color="red" icon="exclamation-circle" iconDirection="left">
      Exception
    </Badge>
  );
};

const CloseMenuItem = ({
  children,
  ...props
}: ComponentProps<typeof Menu.Item>) => {
  const { setOpen } = useMenuContext();
  return (
    <Menu.Item
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
    >
      {children}
    </Menu.Item>
  );
};

const rowActionItemClass =
  'px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300';

const RowKebabMenu = ({
  paymentMethod,
  onViewCardDetails,
}: {
  paymentMethod: SmartExchangePayment['paymentMethod'];
  onViewCardDetails: () => void;
}) => {
  return (
    <div className="flex justify-end">
      <Menu.Root placement="bottom-end">
        <Menu.Trigger asChild>
          <Button
            variant="secondary"
            size="sm"
            icon="dots-vertical"
            iconVariant="outline"
            iconClass="w-4.5 h-4.5 text-gray-500"
            aria-label="Payment row actions"
          />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup className="z-50 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <CloseMenuItem className={rowActionItemClass}>
                Mark as paid
              </CloseMenuItem>
              {paymentMethod.kind === 'card' ? (
                <CloseMenuItem
                  className={rowActionItemClass}
                  onClick={onViewCardDetails}
                >
                  View card details
                </CloseMenuItem>
              ) : null}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

const FilterColumnHeader = ({ label }: { label: string }) => (
  <div className={clsx('flex items-center gap-1', FLEX_START)}>
    <div className={TH_TEXT_CLASS}>{label}</div>
    <Menu.Root placement="bottom-end">
      <Menu.Trigger as="span">
        <Button icon="filter" size="xs" variant="linkSecondary" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="z-50 min-w-32 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <CloseMenuItem>All</CloseMenuItem>
            <CloseMenuItem>Clear filters</CloseMenuItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
);

const TABLE_COL_SPAN = 9;

interface SmartExchangePaymentsTableProps {
  payments: SmartExchangePayment[];
}

const SmartExchangePaymentsTable = ({
  payments,
}: SmartExchangePaymentsTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [cardDetailsPayment, setCardDetailsPayment] =
    useState<SmartExchangePayment | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    setExpandedRow(null);
  }, [payments]);

  const getExpandableContent = useCallback((row: SmartExchangePayment) => {
    return (
      <div className="flex flex-col">
        <ExpandableRow label="Notes">
          <span className="text-sm font-medium text-gray-900">
            {row.notes?.trim() ? row.notes : '-'}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Status">
          <StatusCell status={row.status} />
        </ExpandableRow>
        <ExpandableRow label="Vendor entry">
          <span className="text-sm font-medium text-gray-900">
            {row.vendorEntry}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Invoice #">
          <span className="text-sm font-medium text-gray-900">
            {row.invoiceNumber}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Customer">
          <span className="text-sm font-medium text-gray-900">
            {row.customer}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Date initiated">
          <span className="text-sm font-medium text-gray-900">
            {format(parseISO(row.dateInitiated), 'MMM d, yyyy')}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Payment method" borderTop>
          <PaymentMethodCell method={row.paymentMethod} />
        </ExpandableRow>
      </div>
    );
  }, []);

  return (
    <>
      <div className="overflow-x-auto w-full px-6 grid">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-dashed border-gray-200">
              <th
                className="w-[52px] max-w-[52px] min-w-[52px]"
                aria-label="Expand row"
              />

              <th scope="col" className={TH_CLASS}>
                <div className={FLEX_END}>
                  <button type="button" className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>amount</div>
                    <Icon icon="selector" className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
              <th scope="col" className={TH_CLASS}>
                <FilterColumnHeader label="vendor entry" />
              </th>
              <th scope="col" className={TH_CLASS}>
                <div className={FLEX_START}>
                  <button type="button" className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>invoice #</div>
                    <Icon icon="selector" className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
              <th scope="col" className={TH_CLASS}>
                <div className={FLEX_START}>
                  <button type="button" className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>customer</div>
                    <Icon icon="selector" className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
              <th scope="col" className={TH_CLASS}>
                <div className={clsx('flex items-center gap-1', FLEX_START)}>
                  <div className={TH_TEXT_CLASS}>date initiated</div>
                  <Tooltip trigger="hover" placement="top">
                    <TooltipTrigger
                      as="span"
                      className="inline-flex shrink-0 cursor-help"
                    >
                      <Icon
                        icon="information-circle"
                        variant="solid"
                        className="h-4 w-4 text-gray-400"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-900 px-3 py-2 text-xs text-white">
                      Date when the payment was initiated in SMART Exchange.
                    </TooltipContent>
                  </Tooltip>
                  <button
                    type="button"
                    className="inline-flex shrink-0"
                    aria-label="Sort by date initiated"
                  >
                    <Icon icon="selector" className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
              <th scope="col" className={TH_CLASS}>
                <FilterColumnHeader label="payment method" />
              </th>
              <th scope="col" className={TH_CLASS}>
                <FilterColumnHeader label="status" />
              </th>
              <th className="w-[100px]" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {payments.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  onClick={() => toggleExpand(row.id)}
                  className={clsx(
                    'transition-colors duration-300 ease-in-out',
                    'cursor-pointer hover:bg-gray-50',
                    expandedRow === row.id && 'bg-gray-100'
                  )}
                >
                  <td className="w-[52px] max-w-[52px] min-w-[52px]">
                    <Icon
                      icon="chevron-right"
                      className={clsx(
                        'ml-4 text-gray-500 transition-transform duration-300 ease-in-out',
                        expandedRow === row.id && 'rotate-90'
                      )}
                    />
                  </td>
                  <td className={clsx(TD_CLASS, 'whitespace-nowrap')}>
                    <div className={clsx('flex items-center gap-1', FLEX_END)}>
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmountValue(row.amountCents)}
                      </div>
                      <div className="text-sm font-normal text-gray-500">
                        USD
                      </div>
                    </div>
                  </td>
                  <td
                    className={clsx(
                      TD_CLASS,
                      'whitespace-nowrap text-sm text-gray-900'
                    )}
                  >
                    {row.vendorEntry}
                  </td>
                  <td
                    className={clsx(
                      TD_CLASS,
                      'whitespace-nowrap text-sm font-normal text-gray-500'
                    )}
                  >
                    {row.invoiceNumber}
                  </td>
                  <td
                    className={clsx(
                      TD_CLASS,
                      'whitespace-nowrap text-sm text-gray-900'
                    )}
                  >
                    {row.customer}
                  </td>
                  <td
                    className={clsx(
                      TD_CLASS,
                      'whitespace-nowrap text-sm text-gray-500'
                    )}
                  >
                    {format(parseISO(row.dateInitiated), 'MMM d, yyyy')}
                  </td>
                  <td className={TD_CLASS}>
                    <PaymentMethodCell method={row.paymentMethod} />
                  </td>
                  <td className={TD_CLASS}>
                    <StatusCell status={row.status} />
                  </td>
                  <td
                    className={clsx(TD_CLASS, 'text-right')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.showGetPaid ? (
                      <Button variant="primary" size="sm">
                        Get paid
                      </Button>
                    ) : (
                      <RowKebabMenu
                        paymentMethod={row.paymentMethod}
                        onViewCardDetails={() => setCardDetailsPayment(row)}
                      />
                    )}
                  </td>
                </tr>
                <ExpandableTableRow
                  colSpan={TABLE_COL_SPAN}
                  isExpanded={expandedRow === row.id}
                >
                  {getExpandableContent(row)}
                </ExpandableTableRow>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <ViewCardDetailsModal
        open={cardDetailsPayment !== null}
        onClose={() => setCardDetailsPayment(null)}
        payment={cardDetailsPayment}
      />
    </>
  );
};

export default SmartExchangePaymentsTable;

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import Icon from '../../components/common/base/Icon';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
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
import type { SmartExchangePayment } from './data';
import { formatAmountValue } from './utils';
import { ACTIVITY_LOG_ICONS } from './constants';
import PaymentMethodCell from './components/table/PaymentMethodCell';
import StatusCell from './components/table/StatusCell';
import CardPaymentDetailsPanel from './components/table/CardPaymentDetailsPanel';
import SmartDisburseDetailsPanel from './components/table/SmartDisburseDetailsPanel';
import ActivityLogDescription from './components/table/ActivityLogDescription';
import {
  MarkPaymentAsPaidModal,
  MarkPaymentPaidSuccessModal,
} from './components/table/MarkPaymentModals';
import RowKebabMenu from './components/table/RowKebabMenu';
import FilterColumnHeader from './components/table/FilterColumnHeader';
import ViewCardDetailsModal from '../../modals/ViewCardDetailsModal';
import { useSmartExchangeSetupAlert } from '../../context/smartExchangeSetupAlert';

const TABLE_COL_SPAN = 9;

interface SmartExchangePaymentsTableProps {
  payments: SmartExchangePayment[];
}

const SmartExchangePaymentsTable = ({
  payments,
}: SmartExchangePaymentsTableProps) => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [cardDetailsPayment, setCardDetailsPayment] =
    useState<SmartExchangePayment | null>(null);
  const [markAsPaidPayment, setMarkAsPaidPayment] =
    useState<SmartExchangePayment | null>(null);
  const [markPaidSuccessOpen, setMarkPaidSuccessOpen] = useState(false);
  const [cardDetailsAfterSuccess, setCardDetailsAfterSuccess] =
    useState<SmartExchangePayment | null>(null);
  const [paidPaymentIds, setPaidPaymentIds] = useState<Set<string>>(
    () => new Set()
  );
  const [revealedCardDetailsRowIds, setRevealedCardDetailsRowIds] = useState<
    Set<string>
  >(() => new Set());
  const [showSetupAlertOnDetailsClose, setShowSetupAlertOnDetailsClose] =
    useState(false);
  const { showSetupAlert } = useSmartExchangeSetupAlert();

  const toggleExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    setExpandedRow(null);
    setRevealedCardDetailsRowIds(new Set());
  }, [payments]);

  const handleViewPaymentDetails = useCallback((row: SmartExchangePayment) => {
    setCardDetailsPayment(row);
    setShowSetupAlertOnDetailsClose(true);
  }, []);

  const handleCardDetailsModalClose = useCallback(() => {
    setCardDetailsPayment(null);
    if (showSetupAlertOnDetailsClose) {
      setShowSetupAlertOnDetailsClose(false);
      showSetupAlert();
    }
  }, [showSetupAlertOnDetailsClose, showSetupAlert]);

  const handleCardDetailsRevealedChange = useCallback(
    (rowId: string, revealed: boolean) => {
      setRevealedCardDetailsRowIds((prev) => {
        const next = new Set(prev);
        if (revealed) {
          next.add(rowId);
        } else {
          next.delete(rowId);
        }
        return next;
      });
    },
    []
  );

  const handleConfirmMarkAsPaid = () => {
    if (!markAsPaidPayment) return;

    setPaidPaymentIds((prev) => {
      const next = new Set(prev);
      next.add(markAsPaidPayment.id);
      return next;
    });
    setCardDetailsAfterSuccess(
      markAsPaidPayment.paymentMethod.kind === 'card' ? markAsPaidPayment : null
    );
    setMarkAsPaidPayment(null);
    setMarkPaidSuccessOpen(true);
  };

  const handleMarkPaidSuccessClose = () => {
    setMarkPaidSuccessOpen(false);
    if (cardDetailsAfterSuccess) {
      setCardDetailsPayment(cardDetailsAfterSuccess);
      setCardDetailsAfterSuccess(null);
    }
  };

  const getExpandableContent = useCallback(
    (row: SmartExchangePayment) => {
      const details = row.smartDisburseDetails;

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
          <ExpandableRow label="Attachments" borderTop>
            <div className="flex flex-wrap gap-2">
              {row.attachments?.length ? (
                row.attachments.map((filename) => (
                  <Badge
                    key={filename}
                    size="sm"
                    color="gray"
                    icon="document-text"
                    iconDirection="left"
                  >
                    {filename}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">-</span>
              )}
            </div>
          </ExpandableRow>
          {row.paymentMethod.kind === 'card' && (
            <ExpandableRow label="Payment method details" borderTop>
              <CardPaymentDetailsPanel
                paymentMethod={row.paymentMethod}
                revealed={revealedCardDetailsRowIds.has(row.id)}
                onRevealedChange={(revealed) =>
                  handleCardDetailsRevealedChange(row.id, revealed)
                }
              />
            </ExpandableRow>
          )}
          {details && (
            <ExpandableRow
              label="Payment method details"
              borderTop={row.paymentMethod.kind !== 'card'}
            >
              <SmartDisburseDetailsPanel details={details} />
            </ExpandableRow>
          )}
          {row.activityLog && row.activityLog.length > 0 && (
            <ExpandableRow label="Activity log" borderTop>
              <div className="relative pl-5">
                <div className="space-y-0">
                  {row.activityLog.map((item, index) => {
                    const icon =
                      ACTIVITY_LOG_ICONS[item.iconKey ?? item.status];
                    const showLine = index < row.activityLog!.length - 1;

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex gap-4"
                      >
                        <div className="mt-1 flex flex-shrink-0 flex-col items-center -ml-5">
                          <Icon
                            icon={icon.icon}
                            variant="solid"
                            className={icon.className}
                          />
                          {showLine && (
                            <div className="my-1 min-h-4 w-0.5 flex-1 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1 pb-6">
                          <div className="text-base font-medium leading-6 text-gray-900">
                            {item.title}
                          </div>
                          <ActivityLogDescription
                            description={item.description}
                            links={[
                              ...(row.showGetPaid
                                ? [
                                    {
                                      text: 'Get Paid',
                                      onClick: () =>
                                        navigate(
                                          `/smart-exchange/get-paid/${row.id}`
                                        ),
                                    },
                                  ]
                                : []),
                              {
                                text: `#${row.invoiceNumber}`,
                                onClick: () =>
                                  navigate(
                                    `/smart-exchange/get-paid/${row.id}`
                                  ),
                              },
                            ]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ExpandableRow>
          )}
        </div>
      );
    },
    [navigate, revealedCardDetailsRowIds, handleCardDetailsRevealedChange]
  );

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
                    <TooltipContent className="relative max-w-72 -translate-y-2 bg-gray-900 p-3 text-xs text-gray-100 rounded-lg after:absolute after:left-1/2 after:top-full after:-ml-2 after:border-8 after:border-transparent after:border-t-gray-900">
                      The date the payment was initiated by your customer to
                      you.
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
            {payments.map((row) => {
              const effectiveRow = paidPaymentIds.has(row.id)
                ? ({ ...row, status: 'paid' } as SmartExchangePayment)
                : row;

              return (
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
                      <div
                        className={clsx('flex items-center gap-1', FLEX_END)}
                      >
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
                      <StatusCell status={effectiveRow.status} />
                    </td>
                    <td
                      className={clsx(TD_CLASS, 'text-right')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.showGetPaid ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/smart-exchange/get-paid/${row.id}`)
                          }
                        >
                          Get paid
                        </Button>
                      ) : (
                        <RowKebabMenu
                          paymentMethod={row.paymentMethod}
                          onMarkAsPaid={() => setMarkAsPaidPayment(row)}
                          onViewPaymentDetails={() =>
                            handleViewPaymentDetails(row)
                          }
                        />
                      )}
                    </td>
                  </tr>
                  <ExpandableTableRow
                    colSpan={TABLE_COL_SPAN}
                    isExpanded={expandedRow === row.id}
                  >
                    {getExpandableContent(effectiveRow)}
                  </ExpandableTableRow>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <ViewCardDetailsModal
        open={cardDetailsPayment !== null}
        onClose={handleCardDetailsModalClose}
        payment={cardDetailsPayment}
      />
      <MarkPaymentAsPaidModal
        open={markAsPaidPayment !== null}
        onClose={() => setMarkAsPaidPayment(null)}
        onConfirm={handleConfirmMarkAsPaid}
      />
      <MarkPaymentPaidSuccessModal
        open={markPaidSuccessOpen}
        onClose={handleMarkPaidSuccessClose}
      />
    </>
  );
};

export default SmartExchangePaymentsTable;

import React, {
  useState,
  useCallback,
  useEffect,
  type ComponentProps,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import Icon from '../../components/common/base/Icon';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import { Avatar } from '../../components/common/base/Avatar';
import Menu, { useMenuContext } from '../../components/common/base/Menu';
import Tooltip, {
  TooltipTrigger,
  TooltipContent,
} from '../../components/common/base/Tooltip';
import LayoutModal from '../../components/common/modal/LayoutModal';
import Modal from '../../components/common/modal/Modal';
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
import SmartDisburseIcon from '../../assets/image/SMART-Disburse.svg';
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
    <Tooltip trigger="hover" placement="top">
      <TooltipTrigger as="span" className="inline-flex">
        <div className="flex cursor-help items-center gap-2">
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
      </TooltipTrigger>
      <TooltipContent className="relative max-w-72 bg-gray-900 p-3 -translate-y-2 text-sm leading-5 text-gray-100 rounded-lg after:absolute after:left-1/2 after:top-full after:-ml-2 after:border-8 after:border-transparent after:border-t-gray-900">
        This card has been initiated by your Customer.
      </TooltipContent>
    </Tooltip>
  );
};

const StatusCell = ({ status }: { status: SmartExchangeRowStatus }) => {
  if (status === 'pending_your_action') {
    return (
      <Tooltip trigger="hover" placement="top">
        <TooltipTrigger as="span" className="inline-flex">
          <span className="cursor-help">
            <Badge
              size="sm"
              color="yellow"
              icon="clock"
              iconVariant="solid"
              iconDirection="left"
            >
              Pending Your Action
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent className="relative max-w-72 rounded-lg -translate-y-2 bg-gray-900 p-3 text-sm leading-5 text-gray-100 after:absolute after:left-1/2 after:top-full after:-ml-2 after:border-8 after:border-transparent after:border-t-gray-900">
          Please process the card or check to complete the payment. The payment
          will be updated to <span className="font-semibold">Paid</span> once
          Transcard receives confirmation.
        </TooltipContent>
      </Tooltip>
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
  onMarkAsPaid,
  onViewPaymentDetails,
}: {
  paymentMethod: SmartExchangePayment['paymentMethod'];
  onMarkAsPaid: () => void;
  onViewPaymentDetails: () => void;
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
              <CloseMenuItem
                className={rowActionItemClass}
                onClick={onMarkAsPaid}
              >
                Mark as paid
              </CloseMenuItem>
              {paymentMethod.kind === 'card' ? (
                <CloseMenuItem
                  className={rowActionItemClass}
                  onClick={onViewPaymentDetails}
                >
                  View payment details
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

type CardPaymentMethod = Extract<
  SmartExchangePayment['paymentMethod'],
  { kind: 'card' }
>;

const CardDetailsCopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 cursor-pointer rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      <Icon
        icon={copied ? 'check' : 'duplicate'}
        variant="solid"
        className={clsx(
          'h-4 w-4 transition-colors',
          copied ? 'text-green-600' : 'text-gray-400'
        )}
      />
    </button>
  );
};

const CARD_DETAIL_LABEL_CLASS = 'text-sm font-medium leading-5 text-gray-500';

const CardDetailValue = ({
  children,
  copyValue,
}: {
  children: React.ReactNode;
  copyValue?: string;
}) => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0 text-sm font-normal leading-5 text-gray-900">
      {children}
    </div>
    {copyValue ? <CardDetailsCopyButton value={copyValue} /> : null}
  </div>
);

const CardPaymentDetailsPanel = ({
  paymentMethod,
  revealed,
  onRevealedChange,
}: {
  paymentMethod: CardPaymentMethod;
  revealed: boolean;
  onRevealedChange: (revealed: boolean) => void;
}) => {
  const { details, last4 } = paymentMethod;
  const addressLines = [
    details.addressLine1,
    details.addressLine2,
    [details.city, details.state, details.zip].filter(Boolean).join(', '),
    details.country,
  ].filter(Boolean);

  return (
    <div className="flex w-full items-start gap-9">
      <div className="flex shrink-0 items-center gap-1 text-sm font-semibold leading-5 text-nowrap text-gray-800">
        <span>Card</span>
      </div>

      <Icon icon="chevron-right" className="h-5 w-5 shrink-0 text-gray-400" />

      <div className="w-full max-w-96">
        <div className="grid grid-cols-2 gap-x-6">
          <h4 className="text-sm font-semibold leading-5 text-gray-900">
            Card Details
          </h4>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-end gap-1 text-sm font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700"
            onClick={() => onRevealedChange(!revealed)}
          >
            <Icon
              icon={revealed ? 'eye-off' : 'eye'}
              variant="solid"
              className="h-4 w-4"
            />
            {revealed ? 'Hide Details' : 'Reveal Details'}
          </button>
        </div>

        <div className="my-2 h-px w-full bg-gray-200" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className={CARD_DETAIL_LABEL_CLASS}>Name on Card</div>
          <CardDetailValue>{details.cardholderName}</CardDetailValue>

          <div className={CARD_DETAIL_LABEL_CLASS}>Address</div>
          <CardDetailValue>
            <div className="space-y-0">
              {addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </CardDetailValue>

          <div className={CARD_DETAIL_LABEL_CLASS}>Type</div>
          <CardDetailValue>
            {paymentMethod.brand === 'visa' ? (
              <img
                src={VisaCardIcon}
                alt="Visa"
                className="h-4 w-6 object-contain"
                width={24}
                height={16}
              />
            ) : null}
          </CardDetailValue>

          <div className={CARD_DETAIL_LABEL_CLASS}>Card Number</div>
          <CardDetailValue copyValue={details.cardNumber}>
            {revealed ? details.cardNumber : `•••• ${last4}`}
          </CardDetailValue>

          <div className={CARD_DETAIL_LABEL_CLASS}>Expires</div>
          <CardDetailValue copyValue={details.expiry}>
            {details.expiry}
          </CardDetailValue>

          <div className={CARD_DETAIL_LABEL_CLASS}>CVC2</div>
          <CardDetailValue copyValue={details.cvc2}>
            {revealed ? details.cvc2 : 'CVC2'}
          </CardDetailValue>
        </div>
      </div>
    </div>
  );
};

const SmartDisburseDetailsPanel = ({
  details,
}: {
  details: NonNullable<SmartExchangePayment['smartDisburseDetails']>;
}) => (
  <div className="flex w-full items-start gap-9">
    <div className="flex items-center gap-1 text-sm font-semibold text-nowrap leading-5 text-gray-800">
      <img
        src={SmartDisburseIcon}
        alt=""
        className="h-3.5 w-3.5 shrink-0 object-contain"
        width={18}
        height={18}
      />
      <span>{details.methodLabel}</span>
    </div>

    <Icon icon="chevron-right" className="h-5 w-5 shrink-0 text-gray-400" />

    <div className="w-full">
      <span className="font-semibold text-sm leading-5 text-gray-900 ml-4">
        {details.sectionTitle ?? 'Single-Party Payment'}
      </span>
      <div className="bg-gray-200 w-full h-px my-2"></div>
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center">
        {(['Payee name', 'Payment method', 'Amount', 'Status'] as const).map(
          (heading) => (
            <div
              key={heading}
              className={clsx(
                'py-3 px-4 text-xs font-medium uppercase tracking-wide text-gray-500 leading-4',
                heading !== 'Payee name' && 'whitespace-nowrap',
                heading === 'Amount' || heading === 'Status'
                  ? 'text-right'
                  : 'text-left'
              )}
            >
              {heading}
            </div>
          )
        )}
        <div className="col-start-1 row-start-2 flex h-[52px] px-4 min-w-0 items-center gap-2.5 border-t border-dashed border-gray-200 bg-gray-50">
          <Avatar size="xs" className="shrink-0 [&>div]:ring-0" />
          <span className="truncate text-sm font-medium leading-5 text-gray-900">
            {details.payeeName}
          </span>
        </div>
        <div className="col-start-2 row-start-2 flex h-[52px] px-4 items-center whitespace-nowrap border-t border-dashed border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-500">
          {details.paymentMethod}
        </div>
        <div className="col-start-3 row-start-2 flex h-[52px] px-4 items-center whitespace-nowrap border-t border-dashed border-gray-200 bg-gray-50 text-right text-sm font-medium leading-5 text-gray-900">
          {formatAmountValue(details.amountCents)}{' '}
          <span className="font-normal text-gray-500">USD</span>
        </div>
        <div className="col-start-4 row-start-2 flex h-[52px] px-4 items-center justify-end whitespace-nowrap border-t border-dashed border-gray-200 bg-gray-50">
          <Badge
            size="sm"
            color="gray"
            icon="clock"
            iconVariant="solid"
            iconDirection="left"
          >
            {details.statusLabel}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

type ActivityLogIconKey = SmartExchangeRowStatus | 'initiated';

const ACTIVITY_LOG_ICONS: Record<
  ActivityLogIconKey,
  { icon: string; className: string }
> = {
  pending_your_action: {
    icon: 'clock',
    className: 'h-3.5 w-3.5 text-yellow-500',
  },
  initiated: {
    icon: 'in-progress',
    className: 'h-3.5 w-3.5 text-gray-500',
  },
  paid: {
    icon: 'check-circle',
    className: 'h-3.5 w-3.5 text-green-500',
  },
  exception: {
    icon: 'exclamation-circle',
    className: 'h-3.5 w-3.5 text-red-500',
  },
};

const ACTIVITY_LOG_LINK_CLASS =
  'cursor-pointer font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700';

type ActivityLogLink = { text: string; onClick: () => void };

const ActivityLogDescription = ({
  description,
  links,
}: {
  description: string;
  links: ActivityLogLink[];
}) => {
  const activeLinks = links.filter((link) => description.includes(link.text));

  if (activeLinks.length === 0) {
    return (
      <span className="text-sm leading-5 text-gray-700">{description}</span>
    );
  }

  const pattern = activeLinks
    .map((link) => link.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');

  const parts = description.split(new RegExp(`(${pattern})`, 'g'));

  return (
    <span className="text-sm leading-5 text-gray-700">
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        const link = activeLinks.find((item) => item.text === part);

        if (link) {
          return (
            <button
              key={`${part}-${index}`}
              type="button"
              className={ACTIVITY_LOG_LINK_CLASS}
              onClick={(e) => {
                e.stopPropagation();
                link.onClick();
              }}
            >
              {part}
            </button>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

const MarkPaymentAsPaidModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <LayoutModal open={open}>
      <Modal
        className="w-128"
        title="Mark Payment as Paid"
        description="You are about to change the status of this payment to Paid. Are you sure you want to continue?"
        titleCenter
        icon={
          <Icon
            icon="information-circle"
            variant="solid"
            className="h-11 w-11 text-blue-500"
          />
        }
        onClose={onClose}
        footer={
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        }
      />
    </LayoutModal>
  );
};

const MarkPaymentPaidSuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <LayoutModal open={open}>
      <Modal
        className="w-128"
        title="Status successfully changed!"
        titleCenter
        icon={
          <Icon
            icon="check-circle"
            variant="solid"
            className="h-11 w-11 text-green-500"
          />
        }
        onClose={onClose}
      >
        <Button size="lg" className="w-full" onClick={onClose}>
          Done
        </Button>
      </Modal>
    </LayoutModal>
  );
};

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

  const toggleExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    setExpandedRow(null);
    setRevealedCardDetailsRowIds(new Set());
  }, [payments]);

  const handleViewPaymentDetails = useCallback((row: SmartExchangePayment) => {
    setExpandedRow(row.id);
    setRevealedCardDetailsRowIds((prev) => {
      const next = new Set(prev);
      next.add(row.id);
      return next;
    });
  }, []);

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
        onClose={() => setCardDetailsPayment(null)}
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

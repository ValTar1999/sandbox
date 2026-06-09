import { useCallback, useState } from 'react';
import clsx from 'clsx';
import Icon from '../../../../components/common/base/Icon';
import type { SmartExchangePayment } from '../../data';
import { getCardAddressLines } from '../../utils';
import VisaCardIcon from '../../../../assets/image/visa-card.svg';

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
  const addressLines = getCardAddressLines(details);

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
          <div className="">
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

export default CardPaymentDetailsPanel;

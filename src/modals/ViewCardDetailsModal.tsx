import React, { useCallback, useState } from 'react';
import LayoutModal from '../components/common/modal/LayoutModal';
import clsx from 'clsx';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';
import type { SmartExchangePayment } from '../pages/SmartExchange/data';
import VisaCardIcon from '../assets/image/visa-logo.svg';

const formatAmountValue = (amountCents: number) => {
  const n = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
};

interface ViewCardDetailsModalProps {
  open: boolean;
  onClose: () => void;
  payment: SmartExchangePayment | null;
}

const CopyableValue = ({ value }: { value: string }) => {
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
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-sm font-normal text-gray-900">{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
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
    </div>
  );
};

const DETAILS_GRID_CLASS = 'grid grid-cols-2 items-start gap-x-6 gap-y-2';

const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <>
    <dt className="text-sm font-medium leading-5 text-gray-900">{label}</dt>
    <dd className="text-sm leading-5 text-gray-700">{children}</dd>
  </>
);

const ViewCardDetailsModal: React.FC<ViewCardDetailsModalProps> = ({
  open,
  onClose,
  payment,
}) => {
  if (!open || !payment || payment.paymentMethod.kind !== 'card') return null;

  const { details } = payment.paymentMethod;
  const addressLines = [
    details.addressLine1,
    details.addressLine2,
    `${details.city}, ${details.state} ${details.zip}`,
    details.country,
  ].filter(Boolean);

  return (
    <LayoutModal>
      <div className="relative m-auto w-full max-w-128 overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex justify-end">
          <Button
            icon="x"
            size="md"
            variant="linkSecondary"
            onClick={onClose}
            aria-label="Close"
            className="mt-4 mr-4"
          />
        </div>

        <div className="p-6 pt-6 space-y-4">
          <div className="rounded-xl bg-[#142435] overflow-hidden p-5 w-full mx-auto max-w-80">
            <div className="flex justify-end mb-6">
              <span className="rounded-full bg-white/20 px-1.5 text-[11px] leading-4 text-white">
                CVV : •••
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-white leading-8">
                  {formatAmountValue(payment.amountCents)}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="28"
                  viewBox="0 0 19 28"
                  fill="none"
                >
                  <path
                    d="M1.63451 14.0121C1.63451 16.3874 0 16.4362 0 17.3061C0 17.7886 0.415193 18.1801 0.926639 18.1801C1.17182 18.1801 1.60287 17.9797 1.60287 17.9797C2.76417 17.003 3.51553 15.5899 3.51553 14.0121C3.51553 12.4514 2.78131 11.0119 1.60683 10.0167C1.60683 10.0167 0.805383 9.3695 0.216164 10.1419C-0.228056 10.7246 0.266249 11.2756 0.540427 11.5497C1.18896 12.1983 1.63451 13.059 1.63451 14.0121ZM6.37329 14.0121C6.37329 16.2925 5.37282 18.3304 3.77784 19.7843L3.79103 19.7948C3.67372 19.9412 3.60515 20.1217 3.60515 20.3195C3.60515 20.8032 4.02038 21.1947 4.53182 21.1947C4.78359 21.1947 5.01162 21.0998 5.17903 20.9456L5.18959 20.9548C7.07851 19.1779 8.25431 16.7196 8.25431 13.9883C8.25431 11.269 7.07851 8.81719 5.18959 7.04294L5.17771 7.05348C5.01162 6.90058 4.78359 6.80567 4.53182 6.80567C4.02038 6.80567 3.60515 7.19716 3.60515 7.68093C3.60515 7.87733 3.67372 8.05924 3.78971 8.20555L3.7818 8.21215C5.38732 9.68454 6.37329 11.7461 6.37329 14.0121ZM7.8681 5.0591C11.8964 9.08741 11.6275 13.9501 11.6275 13.9501C11.6275 18.2025 9.67792 21.0998 7.85359 22.9531C7.64927 23.1126 7.52009 23.3552 7.52009 23.6254C7.52009 24.1079 7.93531 24.4994 8.44676 24.4994C8.71566 24.4994 8.95691 24.3926 9.12563 24.2212C9.12563 24.2212 13.5085 20.4131 13.5085 14.0239C13.5085 7.48848 9.12563 3.77917 9.12563 3.77917C8.95559 3.60781 8.71434 3.49973 8.44676 3.49973C7.93531 3.49973 7.52009 3.89254 7.52009 4.37499C7.52009 4.6518 7.65588 4.89829 7.8681 5.0591ZM11.8384 1.52644C17.1071 6.68968 17.0623 13.1737 17.0623 14.0002C17.0623 14.0002 17.5803 20.6002 11.8437 26.4758C11.671 26.6524 11.5378 26.8672 11.5378 27.1246C11.5378 27.6081 11.9531 28 12.4645 28C12.7809 28 13.2396 27.6343 13.2396 27.6343C19.4745 21.3107 18.942 14.0002 18.942 14.0002C18.942 5.62065 13.2857 0.375671 13.2857 0.375671C13.1183 0.148949 12.7809 -1.90735e-06 12.4645 -1.90735e-06C11.9531 -1.90735e-06 11.5378 0.392813 11.5378 0.875259C11.5378 1.1323 11.6552 1.3643 11.8423 1.5238L11.8384 1.52644Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="text-lg text-white leading-6">
                •••• {payment.paymentMethod.last4}
              </div>
            </div>

            <div className="flex flex-col mt-2 space-y-4">
              <div className="flex items-center gap-1 text-white ml-14">
                <span className="text-[7px] leading-normal font-bold w-[47px] block">
                  EXPIRATION DATE
                </span>
                <span className="text-sm leading-5">
                  {details.expiryDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm uppercase leading-5 text-white">
                  {details.cardholderName}
                </div>
                <img src={VisaCardIcon} alt="Visa" className="h-4.5 w-auto" />
              </div>
            </div>
          </div>

          <dl className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className={DETAILS_GRID_CLASS}>
              <DetailField label="Pending Payment">
                {formatAmountValue(payment.amountCents)} USD
              </DetailField>
              <DetailField label="Cardholder Name">
                {details.cardholderName}
              </DetailField>
              <DetailField label="Cardholder Address">
                <div className="space-y-0.5">
                  {addressLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </DetailField>
              <DetailField label="Type">
                <img
                  src={VisaCardIcon}
                  alt="Visa"
                  className="h-4 w-6 object-contain"
                />
              </DetailField>
              <DetailField label="Card Number">
                <CopyableValue value={details.cardNumber} />
              </DetailField>
              <DetailField label="Expires">
                <CopyableValue value={details.expiry} />
              </DetailField>
              <DetailField label="CVC2">
                <CopyableValue value={details.cvc2} />
              </DetailField>
            </div>
          </dl>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 leading-5">
              How can you use the payer&apos;s card?
            </h3>
            <p className="text-xs leading-4 text-gray-500">
              The payer has provided their card to cover a specific amount. You
              are only authorized to charge the amount indicated. To process the
              payment, enter the card details into your card terminal.
            </p>
            <ul className="list-disc pl-5 text-xs leading-4 text-gray-500">
              <li>The card may also be used for future authorized payments.</li>
              <li>
                It can be securely stored under the{' '}
                <span className="font-medium text-gray-900">
                  Payment Preference
                </span>{' '}
                tab in the{' '}
                <span className="font-medium text-gray-900">
                  SMART Exchange
                </span>
                .
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LayoutModal>
  );
};

export default ViewCardDetailsModal;

import React from 'react';
import { format, parseISO } from 'date-fns';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';
import VisaCardIcon from '../assets/image/visa-card.svg';

const formatAmountValue = (amountCents: number) => {
  const n = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
};

interface GetPaidSubmittedModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  amountCents: number;
  paymentDate: string;
  transactionId: string;
  cardLast4?: string;
  showCardReveal?: boolean;
  showProcessingNotice?: boolean;
  onRevealCardDetails?: () => void;
}

const GetPaidSubmittedModal: React.FC<GetPaidSubmittedModalProps> = ({
  open,
  onClose,
  onDone,
  amountCents,
  paymentDate,
  transactionId,
  cardLast4 = '5612',
  showCardReveal = false,
  showProcessingNotice = false,
  onRevealCardDetails,
}) => {
  const formattedPaymentDate = (() => {
    try {
      return format(parseISO(paymentDate), 'MMMM d, yyyy');
    } catch {
      return paymentDate;
    }
  })();

  return (
    <LayoutModal open={open}>
      <Modal
        className="w-128"
        title="Successfully Submitted!"
        icon={
          <Icon
            icon="check-circle"
            variant="solid"
            className="h-11 w-11 text-green-500"
          />
        }
        onClose={onClose}
        titleCenter
        titleClassName="text-xl leading-7"
      >
        <div className="w-full space-y-4">
          <div className="w-full rounded-mf border border-gray-200 bg-gray-50 overflow-hidden divide-y divide-gray-200">
            <div className="p-4">
              <div className="text-sm font-semibold leading-5 text-gray-600">
                Amount
              </div>
              <div className="mt-2 text-2xl font-bold leading-9 text-gray-900">
                {formatAmountValue(amountCents)}
              </div>
              {showCardReveal && (
                <div className="inline-flex items-center bg-gray-100 rounded-md mt-5">
                  <div className="flex flex-col gap-0.5 items-end rounded-md overflow-hidden bg-gray-950 p-2">
                    <img
                      src={VisaCardIcon}
                      alt="Visa"
                      className="w-6 h-4 object-contain"
                    />
                    <span className="text-[10px] leading-3 text-gray-200">
                      •••• {cardLast4}
                    </span>
                  </div>
                  <Button
                    variant="linkSecondary"
                    size="md"
                    icon="eye"
                    iconVariant="solid"
                    onClick={onRevealCardDetails}
                  >
                    Reveal Card Details
                  </Button>
                </div>
              )}
              {showProcessingNotice && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-blue-50 p-3">
                  <Icon
                    icon="information-circle"
                    variant="solid"
                    className="h-5 w-5 text-blue-500"
                  />
                  <p className="text-sm leading-5 font-medium text-blue-700">
                    Continue processing payments manually until automatic card
                    processing set up is complete.
                  </p>
                </div>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-xs leading-4">
              <dt className="text-gray-500">Transaction ID</dt>
              <dd className="font-medium text-gray-900">{transactionId}</dd>
              <dt className="text-gray-500">Payment date</dt>
              <dd className="font-medium text-gray-900">
                {formattedPaymentDate}
              </dd>
            </dl>

            <div className="p-4">
              <Button
                variant="linkPrimary"
                iconVariant="outline"
                size="sm"
                icon="arrow-down-tray"
              >
                Download Details
              </Button>
            </div>
          </div>

          <Button size="xl" className="w-full" onClick={onDone}>
            Done
          </Button>
        </div>
      </Modal>
    </LayoutModal>
  );
};

export default GetPaidSubmittedModal;

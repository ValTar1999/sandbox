import React from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';
import ContentSeImg from '../assets/image/Content-SE-img-modal.svg';

type StepStatus = 'completed' | 'current' | 'pending';

interface SetupStep {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  status: StepStatus;
  actionLabel?: string;
  action?: 'verify' | 'payments';
}

const depositVerificationSteps: SetupStep[] = [
  {
    id: 1,
    title: 'Agreement Signature (Acknowledged)',
    subtitle: 'Confirmed at - 04/06/2026, 11:53:17 AM',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Process Any Card Payment',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Verify Your Bank Account (Penny Test)',
    description:
      "A small test deposit was sent to your bank account, this may take 2-3 days to appear depending on your bank. You'll need to confirm the exact amount to complete setup.",
    status: 'current',
    actionLabel: 'Verify now',
    action: 'verify',
  },
  {
    id: 4,
    title: 'Automatic Card Processing Activated',
    subtitle: 'Your settlement account has been verified.',
    status: 'pending',
  },
];

const processPaymentSteps: SetupStep[] = [
  {
    id: 1,
    title: 'Agreement Signature (Acknowledged)',
    subtitle: 'Confirmed at - 04/06/2026, 11:53:17 AM',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Process Any Card Payment',
    description: 'This will provide us with information to confirm eligibility',
    status: 'current',
    actionLabel: 'Go to Payments',
    action: 'payments',
  },
  {
    id: 3,
    title: 'Verify Your Bank Account (Penny Test)',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Automatic Card Processing Activated',
    status: 'pending',
  },
];

const connectorColor = (status: StepStatus) =>
  status === 'completed' ? 'bg-smart-main' : 'bg-gray-200';

const StepIndicator = ({
  status,
  stepNumber,
}: {
  status: StepStatus;
  stepNumber: number;
}) => {
  if (status === 'completed') {
    return (
      <span
        className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600"
        aria-hidden
      >
        <Icon icon="check" variant="solid" className="h-4 w-4 text-white" />
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span
        className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-blue-400 bg-blue-100 text-xs font-medium leading-4 text-blue-700"
        aria-current="step"
      >
        {stepNumber}
      </span>
    );
  }

  return (
    <span
      className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-gray-300 bg-white text-xs font-medium leading-4 text-gray-800"
      aria-hidden
    >
      {stepNumber}
    </span>
  );
};

interface SmartExchangeLearnMoreModalProps {
  open: boolean;
  onClose: () => void;
  onVerifyNow?: () => void;
  onGoToPayments?: () => void;
  mode?: 'deposit-verification' | 'process-payment';
}

const SmartExchangeLearnMoreModal: React.FC<
  SmartExchangeLearnMoreModalProps
> = ({
  open,
  onClose,
  onVerifyNow,
  onGoToPayments,
  mode = 'deposit-verification',
}) => {
  const steps =
    mode === 'process-payment' ? processPaymentSteps : depositVerificationSteps;

  return (
    <LayoutModal open={open}>
      <div className="m-auto w-full max-w-[800px] overflow-hidden rounded-3xl bg-white p-2 space-x-2 grid grid-cols-3">
        <div className="shrink-0 w-3xs">
          <img
            src={ContentSeImg}
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>

        <div className="relative flex flex-col px-9 py-20 col-span-2">
          <Button
            icon="x"
            size="xl"
            variant="linkSecondary"
            className="absolute right-2 top-2"
            onClick={onClose}
            aria-label="Close"
          />

          <h2 className="text-3xl font-semibold leading-9 text-gray-900">
            To enable automatic card processing, complete the steps below.
          </h2>

          <ol className="mt-6 space-y-0">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const handleAction =
                step.action === 'payments' ? onGoToPayments : onVerifyNow;

              return (
                <li key={step.id} className="flex gap-3">
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <StepIndicator status={step.status} stepNumber={step.id} />
                    {!isLast && (
                      <div
                        className={clsx(
                          'w-[1.5px] flex-1 min-h-6',
                          connectorColor(step.status)
                        )}
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className={clsx('min-w-0 flex-1', !isLast && 'pb-8')}>
                    <div className="text-sm font-semibold leading-5 text-gray-900">
                      {step.title}
                    </div>
                    {step.subtitle && (
                      <p className="mt-2.5 text-sm text-gray-700">
                        {step.subtitle}
                      </p>
                    )}
                    {step.description && (
                      <p className="mt-2.5 text-sm leading-5 text-gray-700">
                        {step.description}
                      </p>
                    )}
                    {step.actionLabel && (
                      <Button
                        variant="primary"
                        size="md"
                        className="mt-4"
                        onClick={handleAction}
                      >
                        {step.actionLabel}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </LayoutModal>
  );
};

export default SmartExchangeLearnMoreModal;

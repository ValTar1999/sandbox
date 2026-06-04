import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import WrapModal from '../components/common/modal/WrapModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Input from '../components/common/base/Input';
import Icon from '../components/common/base/Icon';

type ModalStep = 'verify' | 'success';
const MODAL_EXIT_MS = 280;

interface BankAccountVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

/** Exact micro-deposit amount sent to the settlement account (sandbox). */
const EXPECTED_DEPOSIT_DOLLARS = 0.07;

const AMOUNT_MISMATCH_MESSAGE =
  'The amount entered is incorrect. Please try again.';

const INFO_BULLETS = [
  'Banks may take a little time to post the micro-deposit.',
  'The deposit will appear in your card settlement account.',
  'Card processors have varying settlement times.',
];

const parseAmountDollars = (value: string): number | null => {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return Number.isNaN(parsed) ? null : parsed;
};

const amountsMatch = (entered: string, expectedDollars: number): boolean => {
  const parsed = parseAmountDollars(entered);
  if (parsed === null) return false;
  return Math.round(parsed * 100) === Math.round(expectedDollars * 100);
};

const BankAccountVerificationModal: React.FC<
  BankAccountVerificationModalProps
> = ({ open, onClose }) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [step, setStep] = useState<ModalStep>('verify');
  const [amount, setAmount] = useState('');
  const [amountMismatch, setAmountMismatch] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, MODAL_EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open && !shouldRender) {
      setStep('verify');
      setAmount('');
      setAmountMismatch(false);
    }
  }, [open, shouldRender]);

  const resetAndClose = useCallback(() => {
    setStep('verify');
    setAmount('');
    setAmountMismatch(false);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    resetAndClose();
  }, [resetAndClose]);

  const parsedAmount = parseAmountDollars(amount);
  const canVerify = parsedAmount !== null && parsedAmount > 0;

  const handleVerify = () => {
    if (!canVerify) return;

    if (!amountsMatch(amount, EXPECTED_DEPOSIT_DOLLARS)) {
      setAmountMismatch(true);
      return;
    }

    setAmountMismatch(false);
    setStep('success');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const normalized =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join('')}`
        : parts[1] !== undefined
          ? `${parts[0]}.${parts[1].slice(0, 2)}`
          : raw;
    setAmount(normalized);
    if (amountMismatch) setAmountMismatch(false);
  };

  if (!shouldRender) return null;

  if (step === 'success') {
    return (
      <LayoutModal open={open}>
        <Modal
          className="w-128"
          title="Bank Account Verified Successfully!"
          description="Automatic card processing is set up, all future card payments will be processed automatically with notifications sent."
          icon={
            <Icon
              icon="check-circle"
              className="mx-auto h-11 w-11 text-green-500"
            />
          }
          onClose={handleClose}
          titleCenter
        >
          <p className="text-center text-sm leading-5 text-gray-500">
            Manually processing on any previous card payments that are Pending
            Your Action.
          </p>
          <Button size="xl" className="w-full" onClick={handleClose}>
            Done
          </Button>
        </Modal>
      </LayoutModal>
    );
  }

  return (
    <LayoutModal open={open}>
      <WrapModal
        className="w-[480px] max-w-full"
        onClose={handleClose}
        classContent="px-6 pb-6"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleVerify} disabled={!canVerify}>
              Verify
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-6">
          <Icon
            icon="library"
            variant="solid"
            className="h-11 w-11 text-blue-500"
          />

          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Bank Account Verification
            </h2>
            <p className="text-sm leading-5 text-gray-700">
              A small test deposit was sent to the business card settlement
              account, this may take 2-3 days to appear depending on the card
              processor.
            </p>
          </div>

          <div className="w-full space-y-1.5">
            <label
              htmlFor="verification-amount"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Amount received
            </label>
            <div className="relative">
              <span
                className={clsx(
                  'pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-normal',
                  amountMismatch ? 'text-red-500' : 'text-gray-500'
                )}
              >
                $
              </span>
              <Input
                id="verification-amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="w-full"
                inputClass="pl-7"
                error={amountMismatch}
                aria-invalid={amountMismatch}
                aria-describedby={
                  amountMismatch ? 'verification-amount-error' : undefined
                }
              />
            </div>
            {amountMismatch ? (
              <p
                id="verification-amount-error"
                className="text-sm leading-5 text-red-600"
                role="alert"
              >
                {AMOUNT_MISMATCH_MESSAGE}
              </p>
            ) : (
              <p className="text-sm leading-5 text-gray-500">
                Enter the exact amount you received.
              </p>
            )}
          </div>

          <div className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left">
            <p className="text-sm font-semibold leading-5 text-gray-900">
              Not seeing it yet? This may take 2-3 days.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-5 text-gray-700">
              {INFO_BULLETS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default BankAccountVerificationModal;

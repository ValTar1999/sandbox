import React from 'react';
import LayoutModal from '../components/common/modal/LayoutModal';
import Button from '../components/common/base/Button';
import ContentSeImg from '../assets/image/Content-SE-img-2.svg';

const STEPS = [
  'Continue processing payments manually until set up is complete.',
  "We'll confirm eligibility and initiate one small (micro) deposit into the account the business currently uses to settle card payments (typically deposited in 2-3 business days).",
  'Verify the micro deposit and set up is complete (Opt-out is available).',
];

interface SmartExchangeOptInLearnMoreModalProps {
  open: boolean;
  onClose: () => void;
}

const SmartExchangeOptInLearnMoreModal: React.FC<
  SmartExchangeOptInLearnMoreModalProps
> = ({ open, onClose }) => {
  return (
    <LayoutModal open={open}>
      <div className="m-auto grid w-full max-w-[800px] grid-cols-[256px_1fr] gap-2 overflow-hidden rounded-3xl bg-white p-2">
        <div className="min-h-[620px] overflow-hidden rounded-2xl">
          <img
            src={ContentSeImg}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="relative flex flex-col p-9 space-y-6">
          <Button
            icon="x"
            size="xl"
            variant="linkSecondary"
            className="absolute right-2 top-2"
            onClick={onClose}
            aria-label="Close"
          />

          <h2 className="max-w-lg text-3xl font-semibold leading-9 text-gray-900">
            Enable Automatic Card Processing
          </h2>

          <p className="max-w-lg text-lg leading-6 text-gray-900">
            Say goodbye to manual card processing. Once enrolled, VISA will
            securely transmit your transactions to the business&apos;s existing
            merchant processor. No more manual work.
          </p>

          <div>
            <h3 className="text-sm font-semibold leading-5 text-gray-900">
              How it works:
            </h3>

            <ol className="mt-4 space-y-4">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-gray-200 rounded-full bg-gray-100 text-xs font-medium leading-4 text-gray-800">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-5 text-gray-900">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </LayoutModal>
  );
};

export default SmartExchangeOptInLearnMoreModal;

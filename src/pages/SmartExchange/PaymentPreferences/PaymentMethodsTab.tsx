import Button from '../../../components/common/base/Button';
import Badge from '../../../components/common/base/Badge';
import Icon from '../../../components/common/base/Icon';
import CardsList from './CardsList';
import { AUTOMATIC_CARD_PROCESSING_DATE_INITIATED } from './data';

interface PaymentMethodsTabProps {
  onVerifyNow: () => void;
}

const PaymentMethodsTab = ({ onVerifyNow }: PaymentMethodsTabProps) => {
  const showMicroDepositAlert = false;

  return (
    <div className="space-y-6">
      <div className="p-4 flex items-start justify-between rounded-lg bg-gray-50 w-full">
        <div className="flex items-start gap-3">
          <Icon
            icon="credit-card-sparkle"
            variant="outline"
            className="h-5 w-5 text-blue-600  mt-1"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 leading-5">
                Automatic Card Processing
              </h3>
              <Badge size="sm" color="yellow" rounded>
                Pending Agreement Signature
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              To complete enablement of automatic card processing, signature for
              Visa agreement is required
            </p>
          </div>
        </div>
        <Button variant="linkSecondary" size="sm">
          Review
        </Button>
      </div>

      {showMicroDepositAlert ? (
        <div
          role="alert"
          className="rounded-md bg-yellow-50 p-4 flex space-x-3 items-start"
        >
          <Icon
            icon="exclamation"
            variant="solid"
            className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500"
          />
          <div>
            <div className="space-y-2">
              <p className="text-sm font-semibold leading-5 text-yellow-800">
                Automatic Card Processing
              </p>
              <p className="text-sm leading-5 text-yellow-700">
                To complete set-up, please confirm the small deposit amount.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="secondary"
                size="xs"
                icon="arrow-narrow-right"
                iconVariant="solid"
                iconDirection="right"
                iconClass="!w-3.5 !h-3.5"
                onClick={onVerifyNow}
              >
                Verify now
              </Button>
              <Button variant="linkSecondary" size="xs">
                Don&apos;t see a small deposit?
              </Button>
            </div>
            <p className="text-xs leading-4 text-gray-500 mt-4">
              Date initiated: {AUTOMATIC_CARD_PROCESSING_DATE_INITIATED}
            </p>
          </div>
        </div>
      ) : null}

      <span className="block h-px w-full bg-gray-200"></span>

      <CardsList />
    </div>
  );
};

export default PaymentMethodsTab;

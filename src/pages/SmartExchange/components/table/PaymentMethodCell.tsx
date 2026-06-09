import Tooltip, {
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/common/base/Tooltip';
import type { SmartExchangePayment } from '../../data';
import VisaCardIcon from '../../../../assets/image/visa-card.svg';

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

export default PaymentMethodCell;

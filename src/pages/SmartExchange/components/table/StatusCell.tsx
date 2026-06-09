import Badge from '../../../../components/common/base/Badge';
import Tooltip, {
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/common/base/Tooltip';
import type { SmartExchangeRowStatus } from '../../data';

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

export default StatusCell;

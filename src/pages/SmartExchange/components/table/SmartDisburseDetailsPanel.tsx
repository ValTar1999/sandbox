import Badge from '../../../../components/common/base/Badge';
import Icon from '../../../../components/common/base/Icon';
import { Avatar } from '../../../../components/common/base/Avatar';
import clsx from 'clsx';
import type { SmartExchangePayment } from '../../data';
import { formatAmountValue } from '../../utils';
import SmartDisburseIcon from '../../../../assets/image/SMART-Disburse.svg';

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

export default SmartDisburseDetailsPanel;

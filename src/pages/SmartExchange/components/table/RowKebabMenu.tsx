import Button from '../../../../components/common/base/Button';
import Menu from '../../../../components/common/base/Menu';
import MenuCloseItem from '../../../../components/common/base/MenuCloseItem';
import type { SmartExchangePayment } from '../../data';

const rowActionItemClass =
  'px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300';

const RowKebabMenu = ({
  paymentMethod,
  onMarkAsPaid,
  onViewPaymentDetails,
}: {
  paymentMethod: SmartExchangePayment['paymentMethod'];
  onMarkAsPaid: () => void;
  onViewPaymentDetails: () => void;
}) => (
  <div className="flex justify-end">
    <Menu.Root placement="bottom-end">
      <Menu.Trigger asChild>
        <Button
          variant="secondary"
          size="sm"
          icon="dots-vertical"
          iconVariant="outline"
          iconClass="w-4.5 h-4.5 text-gray-500"
          aria-label="Payment row actions"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="z-50 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <MenuCloseItem
              className={rowActionItemClass}
              onClick={onMarkAsPaid}
            >
              Mark as paid
            </MenuCloseItem>
            {paymentMethod.kind === 'card' ? (
              <MenuCloseItem
                className={rowActionItemClass}
                onClick={onViewPaymentDetails}
              >
                View payment details
              </MenuCloseItem>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
);

export default RowKebabMenu;

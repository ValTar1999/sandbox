import React, { useMemo, useState } from 'react';
import Input from '../../../components/common/base/Input';
import CheckBox from '../../../components/common/base/CheckBox';
import Button from '../../../components/common/base/Button';
import Icon from '../../../components/common/base/Icon';
import Menu, { useMenuContext } from '../../../components/common/base/Menu';
import type { PayerCard } from './data';
import { payerCards, TOTAL_PAYER_CARDS } from './data';
import VisaCardIcon from '../../../assets/image/visa-card.svg';

const rowMenuItemClass =
  'px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300';

const CloseMenuItem = ({
  children,
  ...props
}: React.ComponentProps<typeof Menu.Item>) => {
  const { setOpen } = useMenuContext();
  return (
    <Menu.Item
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
    >
      {children}
    </Menu.Item>
  );
};

const CardRowMenu = () => (
  <Menu.Root placement="bottom-end">
    <Menu.Trigger asChild>
      <Button
        variant="linkSecondary"
        size="sm"
        icon="dots-vertical"
        iconVariant="outline"
        iconClass="w-4.5 h-4.5 text-gray-500"
        aria-label="Card actions"
      />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup className="z-50 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <CloseMenuItem className={rowMenuItemClass}>
            View details
          </CloseMenuItem>
          <CloseMenuItem className={rowMenuItemClass}>
            Remove card
          </CloseMenuItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

const CardRow = ({ card }: { card: PayerCard }) => (
  <li className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
    <div className="flex items-start gap-3">
      <img
        src={VisaCardIcon}
        alt="Visa"
        className="h-4 w-6 shrink-0 object-contain mt-1"
        width={24}
        height={16}
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-5 text-gray-900">
          {card.customerName} •••• {card.last4}
        </div>
        <div className="mt-1 text-sm leading-5 text-gray-500">
          Expiration {card.expiry}
        </div>
      </div>
    </div>
    <CardRowMenu />
  </li>
);

const CardsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredCards = useMemo(() => {
    let list = payerCards;
    if (activeOnly) {
      list = list.filter((card) => card.active);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((card) => card.customerName.toLowerCase().includes(q));
    }
    return list;
  }, [searchQuery, activeOnly]);

  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, 6);

  return (
    <section>
      <h3 className="text-sm font-semibold leading-5 text-gray-900">Cards</h3>

      <div className="mt-4 flex items-center gap-4">
        <Input
          placeholder="Search customer"
          type="text"
          className="min-w-0 flex-1"
          icon="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-3 ml-11 py-1.5 px-3 bg-gray-50 rounded-lg">
          <CheckBox
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Active only</span>
        </label>
        <Button
          size="md"
          variant="secondary"
          icon="plus"
          iconDirection="left"
          className="shrink-0"
          iconVariant="outline"
          iconClass="!w-4.5 !h-4.5"
        >
          Filter
        </Button>
      </div>

      {visibleCards.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {visibleCards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No cards match your search.
        </div>
      )}

      {!showAll && filteredCards.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Show all ({TOTAL_PAYER_CARDS})
          <Icon icon="chevron-down" className="h-4 w-4" />
        </button>
      )}
    </section>
  );
};

export default CardsList;

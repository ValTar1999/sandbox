import React from 'react';
import { clsx } from 'clsx'; 
import Input from '../base/Input';
import Button from '../base/Button'; 
import { RefreshButton } from '../base/RefreshButton';

interface BoxHeaderProps {
  title?: string;
  description?: string;
  selectedCount?: number;
  onSearch?: (value: string) => void;
  onDeselect?: () => void;
  onPay?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const BoxHeader: React.FC<BoxHeaderProps> = ({
  title = 'Payments Overview',
  description = '0 Payments',
  selectedCount = 0,
  onSearch,
  onDeselect,
  onPay,
  children,
  className,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const hasSelection = selectedCount > 0;

  return (
    <div className={clsx('flex w-full items-center flex-wrap', className)}>
      <div className="grid gap-1 pr-12">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>

      {hasSelection && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm leading-5 text-gray-700">
              {selectedCount} Payments
            </div>
            <span className="w-1px h-[21px] bg-gray-300 px-[0.5px]"></span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="linkPrimary" size="xs" onClick={onDeselect}>
              Deselect
            </Button>
            <Button variant="primary" size="xs" onClick={onPay}>
              Pay
            </Button>
          </div>
        </div>
      )}

      {!hasSelection && <RefreshButton />}

      <div className="ml-auto grid grid-flow-col gap-6 pl-8">
        <Input
          placeholder="Search"
          type="text"
          className="w-80"
          icon="search"
          onChange={handleSearch}
        />
        <Button
          size="lg"
          variant="secondary"
          icon="chevron-down"
        >
          Filter
        </Button>
      </div>

      {children}
    </div>
  );
};

export default BoxHeader;

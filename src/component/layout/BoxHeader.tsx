import React from 'react';
import { clsx } from 'clsx'; 
import Input from '../base/Input';
import Button from '../base/Button'; 
import { RefreshButton } from '../base/RefreshButton';

interface BoxHeaderProps {
  title?: string; 
  description?: string;
  showFilter?: boolean;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const BoxHeader: React.FC<BoxHeaderProps> = ({
  title = 'Payments Overview',
  description = '0 Payments',
  showFilter = true,
  onSearch,
  onFilter,
  children,
  className,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={clsx('flex w-full items-center flex-wrap', className)}>
      <div className="grid gap-1 pr-12">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>

      <RefreshButton/>

      <div className="ml-auto grid grid-flow-col gap-6 pl-8">
        <Input
          placeholder="Search"
          type="text"
          className="w-80"
          icon="search"
          onChange={handleSearch}
        />
        {showFilter && onFilter && (
          <Button
            size="md"
            variant="secondary"
            icon="chevron-down"
            onClick={onFilter}
          >
            Filter
          </Button>
        )}
      </div>

      {children}
    </div>
  );
};

export default BoxHeader;

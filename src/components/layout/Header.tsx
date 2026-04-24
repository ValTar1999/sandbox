import { FC } from 'react';
import clsx from 'clsx';
import Breadcrumb from '../layout/Breadcrumb';
import { DropdownUser } from '../common/dropdowns/DropdownUser';
import Button from '../common/base/Button';

interface HeaderProps {
  userName?: string;
  companyName?: string;
}

const Header: FC<HeaderProps> = ({
  userName = 'Johnny Anderson',
  companyName = 'Big Kahuna Burger',
}) => {
  const headerClasses = clsx('bg-white px-6 border-b border-gray-200');

  const titleClasses = clsx(
    'text-2xl font-semibold text-gray-900',
    'pt-6 pb-4'
  );

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center">
        <h1 className={titleClasses}>Hello, {userName}</h1>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="lg">
            {companyName}
          </Button>
          <DropdownUser />
        </div>
      </div>
      <Breadcrumb />
    </header>
  );
};

export default Header;

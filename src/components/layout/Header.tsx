import { FC } from 'react';
import clsx from 'clsx';
import Breadcrumb from "../layout/Breadcrumb";
import { DropdownUser } from "../dropdowns/DropdownUser";

interface HeaderProps {
  userName?: string;
  companyName?: string;
}

const Header: FC<HeaderProps> = ({ 
  userName = 'Johnny Anderson',
  companyName = 'Big Kahuna Burger'
}) => {
  const headerClasses = clsx(
    'bg-white px-6 border-b border-gray-200'
  );

  const titleClasses = clsx(
    'text-2xl font-semibold text-gray-900',
    'pt-6 pb-4'
  );

  const buttonClasses = clsx(
    'px-4 py-2 border rounded',
    'hover:bg-gray-50 transition-colors duration-200'
  );

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center">
        <h1 className={titleClasses}>
          Hello, {userName}
        </h1>
        <div className="flex items-center gap-4">
          <button className={buttonClasses}>
            {companyName}
          </button>
          <DropdownUser />
        </div>
      </div>
      <Breadcrumb />
    </header>
  );
};

export default Header;
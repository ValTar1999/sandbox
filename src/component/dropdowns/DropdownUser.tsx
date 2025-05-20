import clsx from 'clsx';
import { focusButton, focusItem } from '../../config/commonStyles';

import { Dropdown } from './Dropdown';
import { Avatar } from '../base/Avatar';
import Icon from '../base/Icon'; 

// Img
import avatarImg from "../../assets/image/layout/avatar-example.jpeg";

interface DropdownItem {
  icon: string; 
  title: string;
  href: string;
}

interface UserInfo {
  name: string;
  role: string;
  avatar: string;
}

const dropdownItems: DropdownItem[] = [
  {
    icon: 'user', // Иконка профиля
    title: 'Profile', // Название элемента
    href: '#', // Ссылка
  },
  {
    icon: 'logout', // Иконка выхода
    title: 'Sign out', // Название элемента
    href: '#', // Ссылка
  },
];

const userInfo: UserInfo = {
  name: 'Emil Schaefer', 
  role: 'Role',
  avatar: avatarImg,
};

export const DropdownUser: React.FC = () => {
  const menuContent = (
    <>
      <div className="px-4 py-4">
        <h4 className="m-0 text-base font-semibold text-gray-900 truncate">
          {userInfo.name}
        </h4>
        <span className="text-sm font-normal text-gray-500">
          {userInfo.role}
        </span>
      </div>
      <div>
        {dropdownItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={clsx(
              'relative inline-flex items-center w-full px-4 py-3 text-sm font-normal text-gray-900 hover:bg-gray-50 last:rounded-b',
              focusItem()
            )}
          >
            <Icon icon={item.icon} className="mr-3 text-gray-500" />
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </>
  );

  const handleClick = () => {
    console.log('Menu clicked');
  };

  return (
    <Dropdown
      menuClass='w-50 rounded bg-white shadow-dropdown divide-y divide-gray-200 right-0 border border-gray-200 mt-1'
      trigger={
        <div
          onClick={handleClick}
          className={clsx('rounded-full cursor-pointer', focusButton())}
          aria-label="User menu"
        >
          <Avatar
            size="md"
            imageSrc={userInfo.avatar}
          />
        </div>
      }
      menu={menuContent}
    />
  );
};

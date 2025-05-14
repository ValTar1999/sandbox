import clsx from 'clsx';
import { focusButton, focusItem } from '../../config/commonStyles';

// Компоненты
import { Dropdown } from './Dropdown'; // Импорт компонента Dropdown
import { Avatar } from '../base/Avatar'; // Импорт компонента Avatar
import Icon from '../base/Icon'; // Импорт компонента Icon

// Активы
import avatarImg from "../../assets/image/layout/avatar-example.jpeg"; // Импорт изображения аватара

interface DropdownItem {
  icon: string; // Иконка для элемента меню
  title: string; // Заголовок элемента меню
  href: string; // Ссылка элемента меню
}

interface UserInfo {
  name: string; // Имя пользователя
  role: string; // Роль пользователя
  avatar: string; // Ссылка на изображение аватара
}

// Массив элементов для выпадающего меню
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

// Информация о пользователе
const userInfo: UserInfo = {
  name: 'Emil Schaefer', // Имя пользователя
  role: 'Role', // Роль пользователя
  avatar: avatarImg, // Ссылка на изображение аватара
};

export const DropdownUser: React.FC = () => {
  // Контент меню
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

  // Обработчик клика для открытия меню
  const handleClick = () => {
    console.log('Menu clicked'); // Логика для открытия меню, добавьте нужную логику
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

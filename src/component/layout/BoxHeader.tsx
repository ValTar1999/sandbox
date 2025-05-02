import React from 'react';
import { clsx } from 'clsx'; // Импортируем утилиту для условных классов
import Input from '../base/Input'; // Импорт компонента Input
import Button from '../base/Button'; // Импорт компонента Button
import { RefreshButton } from '../base/RefreshButton';

// Интерфейс пропсов для BoxHeader
interface BoxHeaderProps {
  title?: string; // Заголовок компонента
  description?: string; // Описание компонента
  showFilter?: boolean; // Флаг отображения кнопки фильтра
  onRefresh?: () => void; // Колбэк для кнопки обновления
  onSearch?: (value: string) => void; // Колбэк для поиска
  onFilter?: () => void; // Колбэк для кнопки фильтра
  children?: React.ReactNode; // Дочерние элементы
  className?: string; // Дополнительные классы для стилизации
}

const BoxHeader: React.FC<BoxHeaderProps> = ({
  title = 'Payments Overview', // Значение по умолчанию для заголовка
  description = '0 Payments', // Значение по умолчанию для описания
  showFilter = true, // Значение по умолчанию для показа фильтра
  onSearch, // Колбэк для поиска
  onFilter, // Колбэк для фильтра
  className, // Дополнительные классы
}) => {
  // Обработчик изменения значения в поле поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value); // Вызываем колбэк onSearch, если он передан
  };

  return (
    <div className={clsx('flex w-full items-center flex-wrap', className)}>
      {/* Контейнер для заголовка и описания */}
      <div className="grid gap-1 pr-12">
        <h3 className="text-lg font-medium">{title}</h3> {/* Заголовок */}
        {description && (
          <div className="text-xs text-gray-500">{description}</div> // Описание
        )}
      </div>

      <RefreshButton/>

      {/* Контейнер для поиска и кнопки фильтра */}
      <div className="ml-auto grid grid-flow-col gap-6 pl-8">
        <Input
          placeholder="Search" // Текст подсказки в поле поиска
          type="text" // Тип поля
          className="w-80" // Ширина поля поиска
          icon="search" // Иконка для поля поиска
          onChange={handleSearch} // Обработчик изменения поля
        />
        {showFilter && (
          <Button
            variant="secondary" // Стилизация кнопки
            icon="chevron-down" // Иконка для кнопки фильтра
            onClick={onFilter} // Колбэк для фильтра
          >
            Filter
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoxHeader; // Экспорт компонента

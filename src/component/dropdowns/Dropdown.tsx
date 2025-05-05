import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

interface DropdownProps {
  trigger: React.ReactNode; // Элемент, который будет триггером для открытия меню
  menu: React.ReactNode | ((args: { closeDropdown: () => void }) => React.ReactNode); // Содержимое меню
  className?: string; // Дополнительные стили для контейнера дропдауна
  menuClass?: string; // Дополнительные стили для меню
  onStateChange?: (isOpen: boolean) => void; // Функция обратного вызова для изменения состояния меню
}

export const Dropdown = ({
  trigger,
  menu,
  className,
  menuClass,
  onStateChange,
}: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false); // Состояние открытости меню
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на корневой элемент компонента

  // Обработчик кликов вне дропдауна для его закрытия
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Проверяем, что клик был не по элементам дропдауна
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Закрываем меню
      onStateChange?.(false); // Вызываем callback, если он передан
    }
  }, [onStateChange]);

  useEffect(() => {
    // Добавляем обработчик события клика на документ
    document.addEventListener('mousedown', handleClickOutside);
    
    // Убираем обработчик при размонтировании компонента
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Функция для переключения состояния меню (открыть/закрыть)
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      onStateChange?.(newState); // Вызываем callback с новым состоянием
      return newState;
    });
  }, [onStateChange]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onStateChange?.(false);
  }, [onStateChange]);
  

  return (
    <div 
      ref={dropdownRef} 
      className={clsx('relative inline-block', className)} // Применяем дополнительные стили, если они есть
    >
      <div
        onClick={toggleDropdown} // Переключаем состояние меню при клике
        role="button" // Указываем, что это элемент, который выполняет действие
        aria-haspopup="true" // Указываем, что элемент вызывает меню
        aria-expanded={isOpen} // Указываем, что меню открыто
        className="w-full cursor-pointer"
      >
        {trigger} {/* Вставляем триггерный элемент */}
      </div>

      {/* Отображаем меню только если оно открыто */}
      {isOpen && (
        <div 
          className={clsx(
            'absolute z-10 mt-1 rounded-md shadow-lg right-0',
            'bg-white border border-gray-200 transition-opacity duration-300 ease-out',
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            menuClass // Применяем дополнительные стили для меню
          )}
          role="menu"
          aria-orientation="vertical" // Указываем вертикальное расположение элементов в меню
        >
          {typeof menu === 'function' ? menu({ closeDropdown }) : menu} {/* Вставляем элементы меню */}
        </div>
      )}
    </div>
  );
};

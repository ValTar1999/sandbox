import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';
import Icon from '../base/Icon';

interface AccordionProps {
  header: ReactNode; // Заголовок аккордеона
  children: ReactNode; // Контент, который будет скрыт/показан в аккордеоне
  defaultOpen?: boolean; // Если аккордеон должен быть открыт по умолчанию
  className?: string; // Дополнительные классы для кастомизации
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  defaultOpen = false, // Если не передано, аккордеон будет закрыт по умолчанию
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen); // Состояние для открытия/закрытия аккордеона
  const [maxHeight, setMaxHeight] = useState<number | 'auto'>(defaultOpen ? 1000 : 0); // Состояние для maxHeight, используется для плавной анимации
  const contentRef = useRef<HTMLDivElement>(null); // Реф для получения высоты контента

  useEffect(() => {
    if (!contentRef.current) return;

    // Если аккордеон открыт, устанавливаем maxHeight равным высоте контента
    if (isOpen) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      // Если аккордеон закрыт, плавно анимируем maxHeight до 0
      setMaxHeight(0);
    }
  }, [isOpen]); // Эффект срабатывает при изменении состояния isOpen

  const toggle = () => setIsOpen((prev) => !prev); // Функция для переключения состояния аккордеона

  return (
    <div className={clsx('w-full overflow-hidden', className)}>
      {/* Триггер для открытия/закрытия аккордеона */}
      <div
        onClick={toggle}
        className={clsx(
          'w-full text-left focus:outline-none cursor-pointer py-4 border-t border-gray-200 first:border-0 hover:bg-gray-50 transition-all duration-300',
          { 'bg-gray-100': isOpen }
        )}
        aria-expanded={isOpen} // Атрибут доступности для указания состояния аккордеона
        aria-controls="accordion-content" // Атрибут доступности, который ссылается на содержимое аккордеона
        role="button" // Указываем, что элемент выполняет роль кнопки
      >
        <div className="flex items-center">
          {/* Иконка, которая вращается при открытии аккордеона */}
          <Icon
            icon="chevron-right"
            className={clsx(
              'transition-transform duration-300 text-gray-500 mr-6', // Плавная анимация для поворота
              isOpen && 'rotate-90' // Если аккордеон открыт, иконка вращается на 180 градусов
            )}
            aria-hidden
          />
          {/* Заголовок аккордеона */}
          <div className="flex-1">{header}</div>
        </div>
      </div>

      <div
        id="accordion-content"
        ref={contentRef} // Привязка рефа к элементу для измерения его высоты
        className="overflow-hidden transition-all duration-300 ease-in-out mb-2 rounded-b-lg shadow"  
        style={{ maxHeight: maxHeight === 'auto' ? 'none' : `${maxHeight}px` }} // Плавное изменение maxHeight с анимацией
      >
        <div className="">{children}</div>
      </div>
    </div>
  );
};

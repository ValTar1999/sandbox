import React, { useMemo } from "react"; // Импорт React и хука useMemo
import { Link, useLocation } from "react-router-dom"; // Импорт Link и useLocation из react-router-dom
import { focusButton } from '../../config/commonStyles'; // Импорт утилиты для стилизации кнопок
import Icon from '../base/Icon'; // Импорт компонента Icon
import clsx from 'clsx'; // Импорт библиотеки для условных классов

// Компонент для отображения отдельного сегмента хлебных крошек
interface BreadcrumbSegmentProps {
  segment: string; // Название сегмента пути
  pathTo: string; // Путь, к которому ведет сегмент
  isLast: boolean; // Флаг, указывающий, последний ли это сегмент
}

const BreadcrumbSegment: React.FC<BreadcrumbSegmentProps> = ({ segment, pathTo, isLast }) => {
  // Форматируем сегмент, заменяя дефисы на пробелы
  const formattedSegment = segment.replace(/-/g, " ");
  
  if (isLast) {
    return (
      // Если это последний сегмент, выводим его как обычный текст
      <span className="text-gray-500 text-sm font-medium capitalize">
        {formattedSegment}
      </span>
    );
  }

  return (
    // Для всех сегментов, кроме последнего, выводим ссылку
    <Link
      to={pathTo} // Путь к этому сегменту
      className={clsx(
        "text-gray-500 text-sm font-medium hover:text-gray-700 transition-all duration-300 capitalize", // Стилизация ссылки
        focusButton() // Добавляем стили для фокуса
      )}
    >
      {formattedSegment}
    </Link>
  );
};

// Компонент Breadcrumb для отображения хлебных крошек на основе текущего пути
const Breadcrumb: React.FC = () => {
  const location = useLocation(); // Получаем текущий путь с помощью useLocation

  // Разбиваем путь на сегменты и убираем пустые значения
  const pathnames = useMemo(() => 
    location.pathname.split("/").filter(Boolean),
    [location.pathname] // Хук useMemo, чтобы не пересчитывать путь при каждом рендере
  );

  return (
    <nav aria-label="breadcrumb" className="flex items-center border-t border-gray-200 py-4 space-x-4">
      <div className="flex items-center">
        <div className="text-xl font-semibold text-gray-900">
          Current location
        </div>

        <hr className="mx-6 flex h-5 w-[1px] bg-gray-300 border-transparent"/>

        <Link
          to="/" // Ссылка на главную страницу
          className={clsx(
            "inline-flex rounded text-gray-400 hover:text-gray-500", // Стилизация ссылки
            focusButton('focus-visible:ring-blue-600') // Добавляем стили для фокуса
          )}
        >
          <Icon icon="home" /> {/* Иконка для главной страницы */}
        </Link>
      </div>

      {/* Проходим по всем сегментам пути и отображаем их как хлебные крошки */}
      {pathnames.map((segment, index) => {
        const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`; // Формируем путь к текущему сегменту
        const isLast = index === pathnames.length - 1; // Проверяем, является ли это последним сегментом

        return (
          <React.Fragment key={pathTo}>
            <Icon icon="chevron-right" className="text-gray-400" /> {/* Иконка разделителя */}
            <BreadcrumbSegment
              segment={segment} // Текущий сегмент
              pathTo={pathTo} // Путь к текущему сегменту
              isLast={isLast} // Флаг, является ли сегмент последним
            />
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; // Экспортируем компонент

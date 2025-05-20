import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  onItemsPerPageChange,
  itemsPerPage,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handleChangeItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(e.target.value));
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center text-sm leading-5 text-gray-700">
      <div className="mr-4 flex items-center">
        Rows per page:
        <select
          value={itemsPerPage}
          onChange={handleChangeItemsPerPage}
          className="ml-2 p-2"
        >
          {[10, 25, 50].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <div className="mr-2">
          Showing <b className="font-semibold">{startItem} - {endItem}</b> of <b className="font-semibold">{totalItems}</b> results
        </div>

        <div className="grid grid-flow-col gap-2">
          <Button
            variant="secondary"
            size="md"
            icon="chevron-double-left"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          />
          <Button
            variant="secondary"
            size="md"
            icon="chevron-left"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          />
          <Button
            variant="secondary"
            size="md"
            icon="chevron-right"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          />
          <Button
            variant="secondary"
            size="md"
            icon="chevron-double-right"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;

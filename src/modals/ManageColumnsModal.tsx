import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import WrapModal from '../components/common/modal/WrapModal';
import Button from '../components/common/base/Button';
import CheckBox from '../components/common/base/CheckBox';
import Badge from '../components/common/base/Badge';
import {
  DEFAULT_MANAGE_COLUMNS,
  getManageColumnDefinition,
  type ManageColumnConfig,
  type ManageColumnId,
} from '../pages/BillsPayables/manageColumns';

const DragHandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.40039 10.8C2.40039 10.1372 2.93765 9.59998 3.60039 9.59998C4.26313 9.59998 4.80039 10.1372 4.80039 10.8C4.80039 11.4627 4.26313 12 3.60039 12C2.93765 12 2.40039 11.4627 2.40039 10.8Z"
      fill="#6B7280"
    />
    <path
      d="M6.80039 10.8C6.80039 10.1372 7.33765 9.59998 8.00039 9.59998C8.66313 9.59998 9.20039 10.1372 9.20039 10.8C9.20039 11.4627 8.66313 12 8.00039 12C7.33765 12 6.80039 11.4627 6.80039 10.8Z"
      fill="#6B7280"
    />
    <path
      d="M12.4004 9.59998C11.7376 9.59998 11.2004 10.1372 11.2004 10.8C11.2004 11.4627 11.7376 12 12.4004 12C13.0631 12 13.6004 11.4627 13.6004 10.8C13.6004 10.1372 13.0631 9.59998 12.4004 9.59998Z"
      fill="#6B7280"
    />
    <path
      d="M2.40039 5.99999C2.40039 5.33725 2.93765 4.79999 3.60039 4.79999C4.26313 4.79999 4.80039 5.33725 4.80039 5.99999C4.80039 6.66273 4.26313 7.19999 3.60039 7.19999C2.93765 7.19999 2.40039 6.66273 2.40039 5.99999Z"
      fill="#6B7280"
    />
    <path
      d="M6.80039 5.99999C6.80039 5.33725 7.33765 4.79999 8.00039 4.79999C8.66313 4.79999 9.20039 5.33725 9.20039 5.99999C9.20039 6.66273 8.66313 7.19999 8.00039 7.19999C7.33765 7.19999 6.80039 6.66273 6.80039 5.99999Z"
      fill="#6B7280"
    />
    <path
      d="M12.4004 4.79999C11.7376 4.79999 11.2004 5.33725 11.2004 5.99999C11.2004 6.66273 11.7376 7.19999 12.4004 7.19999C13.0631 7.19999 13.6004 6.66273 13.6004 5.99999C13.6004 5.33725 13.0631 4.79999 12.4004 4.79999Z"
      fill="#6B7280"
    />
  </svg>
);

interface ManageColumnsModalProps {
  open: boolean;
  onClose: () => void;
  value?: ManageColumnConfig[];
  defaultColumns?: ManageColumnConfig[];
  onApply?: (columns: ManageColumnConfig[]) => void;
}

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({
  open,
  onClose,
  value = DEFAULT_MANAGE_COLUMNS,
  defaultColumns = DEFAULT_MANAGE_COLUMNS,
  onApply,
}) => {
  const [draft, setDraft] = useState<ManageColumnConfig[]>(value);
  const [draggedId, setDraggedId] = useState<ManageColumnId | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setDraggedId(null);
      setDropIndex(null);
    }
  }, [open, value]);

  const toggleVisible = (id: ManageColumnId) => {
    setDraft((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, visible: !column.visible } : column
      )
    );
  };

  const reorder = (fromId: ManageColumnId, toIndex: number) => {
    setDraft((prev) => {
      const fromIndex = prev.findIndex((column) => column.id === fromId);
      if (fromIndex < 0 || fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
      next.splice(Math.max(0, insertAt), 0, moved);
      return next;
    });
  };

  const handleDragStart = (id: ManageColumnId) => {
    setDraggedId(id);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    index: number
  ) => {
    event.preventDefault();
    if (!draggedId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const after = event.clientY > rect.top + rect.height / 2;
    setDropIndex(after ? index + 1 : index);
  };

  const handleDrop = () => {
    if (draggedId == null || dropIndex == null) {
      setDraggedId(null);
      setDropIndex(null);
      return;
    }
    reorder(draggedId, dropIndex);
    setDraggedId(null);
    setDropIndex(null);
  };

  const handleReset = () => {
    setDraft(defaultColumns);
    setDraggedId(null);
    setDropIndex(null);
  };

  const handleApply = () => {
    onApply?.(draft);
    onClose();
  };

  return (
    <LayoutModal open={open}>
      <WrapModal
        className="w-128 max-w-full"
        noHeader
        footer={
          <div className="flex items-center justify-end gap-4">
            <Button variant="secondary" size="md" onClick={handleReset}>
              Reset default
            </Button>
            <Button variant="primary" size="md" onClick={handleApply}>
              Apply changes
            </Button>
          </div>
        }
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold leading-6 text-gray-900">
              Manage columns
            </h2>
            <p className="text-sm leading-5 text-gray-500">
              Choose which columns appear in the payments table.
            </p>
          </div>
          <Button
            icon="x"
            size="xl"
            variant="linkSecondary"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <ul className="relative grid gap-2 px-5 py-4" onDragEnd={handleDrop}>
          {draft.map((column, index) => {
            const definition = getManageColumnDefinition(column.id);
            const isDragging = draggedId === column.id;
            const showDropLine = dropIndex === index && draggedId !== column.id;

            return (
              <React.Fragment key={column.id}>
                {showDropLine && (
                  <li
                    aria-hidden
                    className="pointer-events-none mx-3 h-0.5 rounded-full bg-blue-600"
                  />
                )}
                <li
                  draggable
                  onDragStart={() => handleDragStart(column.id)}
                  onDragOver={(event) => handleDragOver(event, index)}
                  onDrop={handleDrop}
                  className={clsx(
                    'flex items-center gap-2.5 rounded-md p-2 transition-colors duration-150',
                    isDragging
                      ? 'bg-white opacity-40 shadow-sm ring-1 ring-gray-200'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-flex cursor-grab touch-none items-center justify-center p-0.5 active:cursor-grabbing"
                  >
                    <DragHandleIcon />
                  </span>

                  <CheckBox
                    checked={column.visible}
                    onChange={() => toggleVisible(column.id)}
                    label={
                      <span className="inline-flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {definition.label}
                        </span>
                        {definition.badge && (
                          <Badge size="xs" color="gray" rounded>
                            {definition.badge}
                          </Badge>
                        )}
                      </span>
                    }
                    labelClassName="ml-2"
                    wrapperClassName="min-w-0 flex-1"
                  />
                </li>
              </React.Fragment>
            );
          })}
          {dropIndex === draft.length && draggedId && (
            <li
              aria-hidden
              className="pointer-events-none mx-3 h-0.5 rounded-full bg-blue-600"
            />
          )}
        </ul>
      </WrapModal>
    </LayoutModal>
  );
};

export default ManageColumnsModal;

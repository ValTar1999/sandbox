import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Menu, { useMenuContext } from '../base/Menu';
import Button from '../base/Button';
import Input from '../base/Input';
import CheckBox from '../base/CheckBox';
import Icon from '../base/Icon';
import Badge from '../base/Badge';
import {
  FILTER_CATEGORIES,
  RANGE_FROM_INDEX,
  RANGE_TO_INDEX,
  countActiveCategories,
  countAllSelected,
  countSelected,
  emptySelections,
  formatMmDdYyyyInput,
  getAppliedFilterChips,
  getRangeValues,
  isAmountValueSet,
  isDateValueSet,
  type FilterCategoryId,
  type FilterSelections,
} from './dropdownFilterUtils';

const FilterPanel = ({
  applied,
  onApply,
}: {
  applied: FilterSelections;
  onApply: (next: FilterSelections) => void;
}) => {
  const { setOpen } = useMenuContext();
  const [activeCategoryId, setActiveCategoryId] =
    useState<FilterCategoryId>('payee');
  const [draft, setDraft] = useState<FilterSelections>(applied);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory =
    FILTER_CATEGORIES.find((category) => category.id === activeCategoryId) ??
    FILTER_CATEGORIES[0];

  const selectedValues = draft[activeCategory.id] ?? [];
  const amountRange = getRangeValues(draft, 'amount');
  const dateRange = getRangeValues(draft, activeCategory.id);

  const visibleOptions = useMemo(() => {
    if (
      activeCategory.type === 'amountRange' ||
      activeCategory.type === 'dateRange'
    ) {
      return [];
    }
    if (!activeCategory.searchable) return activeCategory.options;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeCategory.options;
    return activeCategory.options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  const allVisibleSelected =
    visibleOptions.length > 0 &&
    visibleOptions.every((option) => selectedValues.includes(option));

  const toggleOption = (option: string) => {
    setDraft((prev) => {
      const current = prev[activeCategory.id] ?? [];
      const next = current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option];
      return { ...prev, [activeCategory.id]: next };
    });
  };

  const setRangeField = (
    categoryId: FilterCategoryId,
    index: number,
    value: string,
    isSet: (value?: string) => boolean
  ) => {
    setDraft((prev) => {
      const current = [...(prev[categoryId] ?? ['', ''])];
      current[RANGE_FROM_INDEX] = current[RANGE_FROM_INDEX] ?? '';
      current[RANGE_TO_INDEX] = current[RANGE_TO_INDEX] ?? '';
      current[index] = value;
      const hasValue =
        isSet(current[RANGE_FROM_INDEX]) || isSet(current[RANGE_TO_INDEX]);
      if (!hasValue) {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      }
      return { ...prev, [categoryId]: current };
    });
  };

  const handleSelectAll = () => {
    setDraft((prev) => {
      const current = new Set(prev[activeCategory.id] ?? []);
      if (allVisibleSelected) {
        visibleOptions.forEach((option) => current.delete(option));
      } else {
        visibleOptions.forEach((option) => current.add(option));
      }
      return { ...prev, [activeCategory.id]: Array.from(current) };
    });
  };

  const handleReset = () => {
    setDraft(emptySelections());
    setSearchQuery('');
    onApply(emptySelections());
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const hasDraftSelection = countAllSelected(draft) > 0;

  return (
    <div className="flex w-[628px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-dropdown">
      <div className="flex h-auto">
        <div className="w-3xs shrink-0 border-r border-gray-200 p-3 bg-gray-50">
          <nav className="flex flex-col">
            {FILTER_CATEGORIES.map((category) => {
              const selectedCount = countSelected(
                category.id,
                draft[category.id]
              );
              const isActive = category.id === activeCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-300 cursor-pointer',
                    isActive
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setSearchQuery('');
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate">{category.label}</span>
                    {selectedCount > 0 && (
                      <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-medium leading-none text-blue-800 ring-1 ring-inset ring-blue-200">
                        {selectedCount}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <Icon
                      icon="chevron-right"
                      className="h-4 w-4 shrink-0 text-gray-500"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex min-w-0 flex-1 flex-col mx-3 mt-6">
          {activeCategory.type === 'amountRange' ? (
            <div className="flex flex-col gap-4 px-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">From</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  size="sm"
                  icon="dollar"
                  iconVariant="outline"
                  placeholder="0.00"
                  value={amountRange.from}
                  onChange={(event) =>
                    setRangeField(
                      'amount',
                      RANGE_FROM_INDEX,
                      event.target.value,
                      isAmountValueSet
                    )
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">To</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  size="sm"
                  icon="dollar"
                  iconVariant="outline"
                  placeholder="0.00"
                  value={amountRange.to}
                  onChange={(event) =>
                    setRangeField(
                      'amount',
                      RANGE_TO_INDEX,
                      event.target.value,
                      isAmountValueSet
                    )
                  }
                />
              </label>
            </div>
          ) : activeCategory.type === 'dateRange' ? (
            <div className="flex flex-col gap-4 px-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">From</span>
                <Input
                  type="text"
                  size="sm"
                  inputMode="numeric"
                  placeholder="MM/DD/YYYY"
                  maxLength={10}
                  value={dateRange.from}
                  onChange={(event) =>
                    setRangeField(
                      activeCategory.id,
                      RANGE_FROM_INDEX,
                      formatMmDdYyyyInput(event.target.value),
                      isDateValueSet
                    )
                  }
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">To</span>
                <Input
                  type="text"
                  size="sm"
                  inputMode="numeric"
                  placeholder="MM/DD/YYYY"
                  maxLength={10}
                  value={dateRange.to}
                  onChange={(event) =>
                    setRangeField(
                      activeCategory.id,
                      RANGE_TO_INDEX,
                      formatMmDdYyyyInput(event.target.value),
                      isDateValueSet
                    )
                  }
                />
              </label>
            </div>
          ) : (
            <>
              {activeCategory.searchable && (
                <div className="px-3 mb-3">
                  <div className="mb-6">
                    <Input
                      placeholder={activeCategory.searchPlaceholder}
                      type="text"
                      size="sm"
                      icon="search"
                      value={searchQuery}
                      clearable
                      onClear={() => setSearchQuery('')}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {activeCategory.listTitle ?? activeCategory.label}
                    </div>
                    <Button
                      variant="linkPrimary"
                      size="xs"
                      className="shrink-0"
                      onClick={handleSelectAll}
                    >
                      Select all
                    </Button>
                  </div>
                </div>
              )}

              <div className="max-h-[418px] space-y-3 overflow-y-auto no-scrollbar px-3 pb-6">
                {visibleOptions.map((option, index) => (
                  <CheckBox
                    key={`${option}-${index}`}
                    checked={selectedValues.includes(option)}
                    onChange={() => toggleOption(option)}
                    wrapperClassName="flex w-full items-center cursor-pointer"
                    labelClassName="ml-3 text-sm text-gray-900"
                    label={option}
                  />
                ))}
                {visibleOptions.length === 0 && (
                  <div className="px-2 py-6 text-center text-sm text-gray-500">
                    No options found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasDraftSelection}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!hasDraftSelection}
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

interface DropdownFilterProps {
  value?: FilterSelections;
  onApply?: (filters: FilterSelections) => void;
}

export const AppliedFilterChips = ({
  filters,
  onRemove,
}: {
  filters: FilterSelections;
  onRemove: (categoryId: FilterCategoryId) => void;
}) => {
  const chips = getAppliedFilterChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      {chips.map((chip) => (
        <div
          key={chip.categoryId}
          className="inline-flex max-w-80 items-stretch overflow-hidden rounded-md border text-xs leading-4 font-semibold border-gray-300 bg-white text-gray-700"
        >
          <span className="shrink-0 bg-gray-100 px-2 py-1 text-gray-700">
            {chip.categoryLabel}
          </span>
          <span className="flex min-w-0 items-center gap-1 border-l border-gray-300 px-2 py-1 text-gray-900">
            {chip.showCount && (
              <Badge size="xs" color="gray" rounded className="shrink-0">
                {chip.count}
              </Badge>
            )}
            <span className="truncate">{chip.value}</span>
          </span>
          <button
            type="button"
            aria-label={`Remove ${chip.categoryLabel} filter`}
            className="inline-flex shrink-0 items-center border-l border-gray-300 p-1 text-gray-400 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
            onClick={() => onRemove(chip.categoryId)}
          >
            <Icon icon="x" className="h-4.5 w-4.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  value,
  onApply,
}) => {
  const [internalApplied, setInternalApplied] =
    useState<FilterSelections>(emptySelections());
  const applied = value ?? internalApplied;

  const totalApplied = countActiveCategories(applied);

  const handleApply = (next: FilterSelections) => {
    if (value === undefined) {
      setInternalApplied(next);
    }
    onApply?.(next);
  };

  return (
    <Menu.Root placement="bottom-end">
      <Menu.Trigger asChild>
        <Button size="md" variant="secondary" icon="chevron-down">
          <span className="inline-flex items-center gap-2">
            Filter
            {totalApplied > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium leading-none text-gray-700 ring-1 ring-inset ring-gray-200">
                {totalApplied}
              </span>
            )}
          </span>
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="z-50">
          <Menu.Popup>
            <FilterPanel
              key={JSON.stringify(applied)}
              applied={applied}
              onApply={handleApply}
            />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default DropdownFilter;

/**
 * Reusable table Filter control.
 * Pass page-specific `categories` so options match that table's data.
 */
export {
  DropdownFilter as Filter,
  AppliedFilterChips,
} from '../dropdowns/DropdownFilter';
export { default } from '../dropdowns/DropdownFilter';

export type {
  FilterCategory,
  FilterCategoryId,
  FilterSelections,
  AppliedFilterChip,
} from '../dropdowns/dropdownFilterUtils';

export {
  serializeFilters,
  removeFilterCategory,
  countSelected,
  countActiveCategories,
  emptySelections,
  PAYABLES_FILTER_CATEGORIES,
} from '../dropdowns/dropdownFilterUtils';

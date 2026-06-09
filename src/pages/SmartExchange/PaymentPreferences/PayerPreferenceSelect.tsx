import clsx from 'clsx';
import Select, {
  useSelectContext,
} from '../../../components/common/base/Select';
import Icon from '../../../components/common/base/Icon';
import {
  Tooltip,
  TooltipContent,
  useTooltipContext,
} from '../../../components/common/base/Tooltip';
import type { TIconVariant } from '../../../enums/Icon';

export type PayerPreferenceSelectOption = {
  label: string;
  value: string;
  description?: string;
  descriptionPosition?: 'below' | 'inline';
  triggerDescription?: string;
  icon?: string;
  iconVariant?: TIconVariant;
};

interface PayerPreferenceSelectProps {
  label: string;
  placeholder: string;
  options: PayerPreferenceSelectOption[];
  value: string;
  onChange: (value: string) => void;
  showSelectedDescription?: boolean;
  showIcon?: boolean;
  dropdownClassName?: string;
}

const getTriggerTooltipText = (
  option: PayerPreferenceSelectOption,
  triggerDescription?: string
) =>
  `${option.label}${
    triggerDescription ?? option.triggerDescription ?? ''
  }`;

const getTriggerDescription = (
  option: PayerPreferenceSelectOption,
  showSelectedDescription: boolean
) => {
  if (!showSelectedDescription) return undefined;
  if (option.triggerDescription !== undefined) {
    return option.triggerDescription || undefined;
  }
  if (!option.description) return undefined;
  return option.description.trim().slice(-8);
};

const renderOptionIcon = (
  option: PayerPreferenceSelectOption,
  className?: string
) => {
  if (!option.icon) return null;

  return (
    <Icon
      icon={option.icon}
      variant={option.iconVariant}
      className={className}
    />
  );
};

const PayerPreferenceOption = ({
  option,
  isSelected,
  onSelect,
  showIcon,
}: {
  option: PayerPreferenceSelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
  showIcon: boolean;
}) => {
  const { setOpen } = useSelectContext();

  return (
    <button
      type="button"
      className={clsx(
        'flex w-full cursor-pointer justify-between gap-4 px-4 py-3 text-left',
        option.descriptionPosition === 'inline'
          ? 'items-center'
          : 'items-start',
        isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
      )}
      onClick={() => {
        onSelect(option.value);
        setOpen(false);
      }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {showIcon
          ? renderOptionIcon(option, 'mt-0.5 h-5 w-5 shrink-0 text-gray-500')
          : null}
        <div
          className={clsx(
            'min-w-0',
            option.descriptionPosition === 'inline'
              ? 'flex flex-row items-center gap-2'
              : 'flex flex-col'
          )}
        >
          <span className="truncate text-sm font-medium leading-5 text-gray-900">
            {option.label}
          </span>
          {option.description ? (
            <span
              className={clsx(
                'text-sm leading-5 text-gray-500',
                option.descriptionPosition === 'inline' && 'shrink-0'
              )}
            >
              {option.description}
            </span>
          ) : null}
        </div>
      </div>
      {isSelected ? (
        <Icon icon="check" className="h-5 w-5 shrink-0 text-green-600" />
      ) : null}
    </button>
  );
};

const SelectTriggerContent = ({
  selectedOption,
  placeholder,
  triggerDescription,
  showIcon,
  open,
}: {
  selectedOption?: PayerPreferenceSelectOption;
  placeholder: string;
  triggerDescription?: string;
  showIcon: boolean;
  open: boolean;
}) => (
  <>
    {selectedOption ? (
      <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        {showIcon
          ? renderOptionIcon(selectedOption, 'h-4 w-4 shrink-0 text-gray-400')
          : null}
        <span className="block min-w-0 flex-1 truncate text-sm leading-5">
          <span className="font-medium text-gray-900">
            {selectedOption.label}
          </span>
          {triggerDescription ? (
            <span className="font-medium text-gray-500">
              {triggerDescription}
            </span>
          ) : null}
        </span>
      </span>
    ) : (
      <span className="text-gray-400">{placeholder}</span>
    )}
    <Icon
      icon="chevron-down"
      className={clsx(
        'h-4 w-4 shrink-0 text-gray-400 transition-transform',
        open && 'rotate-180'
      )}
    />
  </>
);

const SelectTriggerWithTooltip = ({
  label,
  placeholder,
  selectedOption,
  triggerDescription,
  showIcon,
}: {
  label: string;
  placeholder: string;
  selectedOption: PayerPreferenceSelectOption;
  triggerDescription?: string;
  showIcon: boolean;
}) => {
  const { refs, getReferenceProps, open, setOpen } = useSelectContext();
  const { refs: tooltipRefs, getReferenceProps: getTooltipReferenceProps } =
    useTooltipContext();

  const setReference = (node: HTMLButtonElement | null) => {
    refs.setReference(node);
    tooltipRefs.setReference(node);
  };

  return (
    <button
      type="button"
      ref={setReference}
      aria-label={label}
      className={clsx(
        'flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-1.5 text-left text-sm leading-5 shadow-sm transition-colors',
        open ? 'border-blue-600 ring ring-blue-600' : 'border-gray-300'
      )}
      {...getReferenceProps(
        getTooltipReferenceProps({
          onClick: () => setOpen(!open),
        })
      )}
    >
      <SelectTriggerContent
        selectedOption={selectedOption}
        placeholder={placeholder}
        triggerDescription={triggerDescription}
        showIcon={showIcon}
        open={open}
      />
    </button>
  );
};

const PayerPreferenceSelectTrigger = ({
  label,
  placeholder,
  selectedOption,
  triggerDescription,
  showIcon,
}: {
  label: string;
  placeholder: string;
  selectedOption?: PayerPreferenceSelectOption;
  triggerDescription?: string;
  showIcon: boolean;
}) => {
  const { open } = useSelectContext();
  const tooltipText = selectedOption
    ? getTriggerTooltipText(selectedOption, triggerDescription)
    : '';

  if (selectedOption && !open) {
    return (
      <Tooltip trigger="hover" placement="top">
        <SelectTriggerWithTooltip
          label={label}
          placeholder={placeholder}
          selectedOption={selectedOption}
          triggerDescription={triggerDescription}
          showIcon={showIcon}
        />
        <TooltipContent className="z-[60] whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-sm font-medium text-white shadow-lg">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Select.Trigger
      aria-label={label}
      className={clsx(
        'flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-1.5 text-left text-sm leading-5 shadow-sm transition-colors',
        open ? 'border-blue-600 ring ring-blue-600' : 'border-gray-300'
      )}
    >
      <SelectTriggerContent
        selectedOption={selectedOption}
        placeholder={placeholder}
        triggerDescription={triggerDescription}
        showIcon={showIcon}
        open={open}
      />
    </Select.Trigger>
  );
};

const PayerPreferenceSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  showSelectedDescription = false,
  showIcon = true,
  dropdownClassName,
}: PayerPreferenceSelectProps) => {
  const selectedOption = options.find((option) => option.value === value);
  const triggerDescription = selectedOption
    ? getTriggerDescription(selectedOption, showSelectedDescription)
    : undefined;

  return (
    <Select.Root
      placement="bottom-start"
      matchTriggerWidth={!dropdownClassName}
    >
      <PayerPreferenceSelectTrigger
        label={label}
        placeholder={placeholder}
        selectedOption={selectedOption}
        triggerDescription={triggerDescription}
        showIcon={showIcon}
      />

      <Select.Portal>
        <Select.Positioner className="z-50">
          <Select.Popup
            className={clsx('rounded-md bg-white shadow-lg', dropdownClassName)}
          >
            {options.map((option) => (
              <PayerPreferenceOption
                key={option.value}
                option={option}
                isSelected={value === option.value}
                onSelect={onChange}
                showIcon={showIcon}
              />
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

export default PayerPreferenceSelect;

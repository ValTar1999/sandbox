import clsx from 'clsx';
import Icon from '../components/common/base/Icon';
import { useSelectContext } from '../components/common/base/Select';
import Button from '../components/common/base/Button';
import {
  advancedPeriodOptions,
  roleOptions,
  timeframeOptions,
} from './userModalSharedData';

type RoleDropdownContentProps = {
  onSelectRole: (roleId: string) => void;
  selectedRoleId: string;
  showCheckIcon?: boolean;
  onInfoClick?: (roleId: string) => void;
};

export const RoleDropdownContent = ({
  onSelectRole,
  selectedRoleId,
  showCheckIcon = false,
  onInfoClick,
}: RoleDropdownContentProps) => {
  const { setOpen } = useSelectContext();

  return (
    <div className="w-full">
      {roleOptions.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => {
            onSelectRole(role.id);
            setOpen(false);
          }}
          className={clsx(
            'w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200',
            selectedRoleId === role.id && 'bg-gray-100'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm leading-5">
              <span className="font-medium text-gray-900">{role.name}</span>
              <span className="text-gray-500">{role.application}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon="information-circle"
                iconClass="text-gray-400 w-4.5 h-4.5"
                variant="linkSecondary"
                size="xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onInfoClick?.(role.id);
                  setOpen(false);
                }}
              />
              {showCheckIcon && selectedRoleId === role.id && (
                <Icon icon="check" className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        </button>
      ))}
      <button
        type="button"
        className="w-full px-4 py-3 text-blue-600 font-medium hover:bg-gray-50 cursor-pointer transition-colors duration-200 inline-flex items-center justify-center gap-2"
      >
        <Icon icon="plus" className="w-5 h-5 text-blue-500" />
        Create New Role
      </button>
    </div>
  );
};

type TimeframeDropdownContentProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const TimeframeDropdownContent = ({
  selectedId,
  onSelect,
}: TimeframeDropdownContentProps) => {
  const { setOpen } = useSelectContext();
  return (
    <>
      {timeframeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => {
            onSelect(option.id);
            setOpen(false);
          }}
          className={clsx(
            'w-full px-3 py-2 text-sm leading-5 text-left hover:bg-gray-50 cursor-pointer transition-colors duration-200',
            selectedId === option.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </>
  );
};

type AdvancedPeriodDropdownContentProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const AdvancedPeriodDropdownContent = ({
  selectedId,
  onSelect,
}: AdvancedPeriodDropdownContentProps) => {
  const { setOpen } = useSelectContext();
  return (
    <>
      {advancedPeriodOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => {
            onSelect(option.id);
            setOpen(false);
          }}
          className={clsx(
            'w-full px-3 py-2 text-sm leading-5 text-left hover:bg-gray-50 cursor-pointer transition-colors duration-200',
            selectedId === option.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </>
  );
};

import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  type SetStateAction,
} from 'react';
import clsx from 'clsx';
import Input from '../../components/common/base/Input';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import Icon from '../../components/common/base/Icon';
import LayoutModal from '../../components/common/modal/LayoutModal';
import Modal from '../../components/common/modal/Modal';
import WrapModal from '../../components/common/modal/WrapModal';
import Select, { useSelectContext } from '../../components/common/base/Select';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../components/common/base/Tooltip';
import {
  AdvancedPeriodDropdownContent,
  TimeframeDropdownContent,
} from '../../modals/userModalSharedComponents';
import {
  advancedLimitMethods,
  advancedPeriodOptions,
  type AdvancedMethodFieldErrors,
  formatAmountValue,
  type LimitsMode,
  permissionSections as createRolePermissionSections,
  type LimitsSummary,
  roleOptions,
  timeframeOptions,
} from '../../modals/userModalSharedData';
import {
  createAdvancedLimitsSummary,
  createEmptyAdvancedMethodErrors,
  createEmptyAdvancedMethodMap,
  getAdvancedLimitsErrors,
  hasAdvancedLimitsErrors,
  validateGlobalLimits,
} from './limitsUtils';

export type CreateRolePayload = {
  presetId?: string;
  roleName: string;
  description: string;
  application: string;
  permissionsBySection: Record<string, string[]>;
  limitsSummaryByType: { ap?: LimitsSummary; ar?: LimitsSummary };
};

type CreateRoleViewProps = {
  onCancel: () => void;
  onCreateRole: (payload: CreateRolePayload) => void;
  existingRoleNames: string[];
  mode?: 'create' | 'view';
  initialData?: CreateRolePayload;
};

type LimitsState = {
  isLimitsModalOpen: boolean;
  limitsType: 'ap' | 'ar';
  limitsMode: LimitsMode;
  limitsSummaryByType: { ap?: LimitsSummary; ar?: LimitsSummary };
  selectedTimeframeId: string;
  timeframeLimit: string;
  perInvoiceLimit: string;
  timeframeLimitError: boolean;
  timeframeSelectError: boolean;
  perInvoiceLimitError: boolean;
  advancedMethodPeriods: Record<string, string>;
  advancedMethodTimeframeLimits: Record<string, string>;
  advancedMethodPerBillLimits: Record<string, string>;
  advancedMethodErrors: Record<string, AdvancedMethodFieldErrors>;
};

type LimitsAction = (state: LimitsState) => LimitsState;

const initialLimitsState: LimitsState = {
  isLimitsModalOpen: false,
  limitsType: 'ap',
  limitsMode: 'global',
  limitsSummaryByType: {},
  selectedTimeframeId: 'weekly',
  timeframeLimit: '100,000.00',
  perInvoiceLimit: '20,000.00',
  timeframeLimitError: false,
  timeframeSelectError: false,
  perInvoiceLimitError: false,
  advancedMethodPeriods: createEmptyAdvancedMethodMap(),
  advancedMethodTimeframeLimits: createEmptyAdvancedMethodMap(),
  advancedMethodPerBillLimits: createEmptyAdvancedMethodMap(),
  advancedMethodErrors: createEmptyAdvancedMethodErrors(),
};

const limitsReducer = (state: LimitsState, action: LimitsAction) =>
  action(state);

const applySetStateAction = <T,>(prev: T, next: SetStateAction<T>) =>
  typeof next === 'function' ? (next as (value: T) => T)(prev) : next;

const PresetDropdownContent = ({
  selectedPresetId,
  onSelectPreset,
}: {
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
}) => {
  const { setOpen } = useSelectContext();

  return (
    <>
      {roleOptions.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => {
            onSelectPreset(preset.id);
            setOpen(false);
          }}
          className={clsx(
            'w-full px-4 py-3 text-left text-sm leading-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer',
            selectedPresetId === preset.id && 'bg-gray-50'
          )}
        >
          {preset.name}
        </button>
      ))}
    </>
  );
};

const CreateRoleView = ({
  onCancel,
  onCreateRole,
  existingRoleNames,
  mode = 'create',
  initialData,
}: CreateRoleViewProps) => {
  const [expandedPermissionSectionId, setExpandedPermissionSectionId] =
    useState('');
  const [roleName, setRoleName] = useState(initialData?.roleName ?? '');
  const [roleDescription, setRoleDescription] = useState(
    initialData?.description ?? ''
  );
  const [selectedPermissionsBySection, setSelectedPermissionsBySection] =
    useState<Record<string, string[]>>(initialData?.permissionsBySection ?? {});
  const [selectedPresetId, setSelectedPresetId] = useState(
    initialData?.presetId ??
      (initialData
        ? (roleOptions.find((option) => option.name === initialData.roleName)
            ?.id ?? '')
        : '')
  );
  const [limitsState, dispatchLimits] = useReducer(
    limitsReducer,
    initialLimitsState
  );
  const {
    isLimitsModalOpen,
    limitsType,
    limitsMode,
    limitsSummaryByType,
    selectedTimeframeId,
    timeframeLimit,
    perInvoiceLimit,
    timeframeLimitError,
    timeframeSelectError,
    perInvoiceLimitError,
    advancedMethodPeriods,
    advancedMethodTimeframeLimits,
    advancedMethodPerBillLimits,
    advancedMethodErrors,
  } = limitsState;
  const setIsLimitsModalOpen = (value: SetStateAction<boolean>) =>
    dispatchLimits((prev) => ({
      ...prev,
      isLimitsModalOpen: applySetStateAction(prev.isLimitsModalOpen, value),
    }));
  const setLimitsType = (value: SetStateAction<'ap' | 'ar'>) =>
    dispatchLimits((prev) => ({
      ...prev,
      limitsType: applySetStateAction(prev.limitsType, value),
    }));
  const setLimitsMode = (value: SetStateAction<LimitsMode>) =>
    dispatchLimits((prev) => ({
      ...prev,
      limitsMode: applySetStateAction(prev.limitsMode, value),
    }));
  const setLimitsSummaryByType = (
    value: SetStateAction<{ ap?: LimitsSummary; ar?: LimitsSummary }>
  ) =>
    dispatchLimits((prev) => ({
      ...prev,
      limitsSummaryByType: applySetStateAction(prev.limitsSummaryByType, value),
    }));
  const setSelectedTimeframeId = (value: SetStateAction<string>) =>
    dispatchLimits((prev) => ({
      ...prev,
      selectedTimeframeId: applySetStateAction(prev.selectedTimeframeId, value),
    }));
  const setTimeframeLimit = (value: SetStateAction<string>) =>
    dispatchLimits((prev) => ({
      ...prev,
      timeframeLimit: applySetStateAction(prev.timeframeLimit, value),
    }));
  const setPerInvoiceLimit = (value: SetStateAction<string>) =>
    dispatchLimits((prev) => ({
      ...prev,
      perInvoiceLimit: applySetStateAction(prev.perInvoiceLimit, value),
    }));
  const setTimeframeLimitError = (value: SetStateAction<boolean>) =>
    dispatchLimits((prev) => ({
      ...prev,
      timeframeLimitError: applySetStateAction(prev.timeframeLimitError, value),
    }));
  const setTimeframeSelectError = (value: SetStateAction<boolean>) =>
    dispatchLimits((prev) => ({
      ...prev,
      timeframeSelectError: applySetStateAction(
        prev.timeframeSelectError,
        value
      ),
    }));
  const setPerInvoiceLimitError = (value: SetStateAction<boolean>) =>
    dispatchLimits((prev) => ({
      ...prev,
      perInvoiceLimitError: applySetStateAction(
        prev.perInvoiceLimitError,
        value
      ),
    }));
  const setAdvancedMethodPeriods = (
    value: SetStateAction<Record<string, string>>
  ) =>
    dispatchLimits((prev) => ({
      ...prev,
      advancedMethodPeriods: applySetStateAction(
        prev.advancedMethodPeriods,
        value
      ),
    }));
  const setAdvancedMethodTimeframeLimits = (
    value: SetStateAction<Record<string, string>>
  ) =>
    dispatchLimits((prev) => ({
      ...prev,
      advancedMethodTimeframeLimits: applySetStateAction(
        prev.advancedMethodTimeframeLimits,
        value
      ),
    }));
  const setAdvancedMethodPerBillLimits = (
    value: SetStateAction<Record<string, string>>
  ) =>
    dispatchLimits((prev) => ({
      ...prev,
      advancedMethodPerBillLimits: applySetStateAction(
        prev.advancedMethodPerBillLimits,
        value
      ),
    }));
  const setAdvancedMethodErrors = (
    value: SetStateAction<Record<string, AdvancedMethodFieldErrors>>
  ) =>
    dispatchLimits((prev) => ({
      ...prev,
      advancedMethodErrors: applySetStateAction(
        prev.advancedMethodErrors,
        value
      ),
    }));

  const selectedTimeframe = useMemo(
    () =>
      timeframeOptions.find((option) => option.id === selectedTimeframeId) ??
      null,
    [selectedTimeframeId]
  );
  const selectedPreset = useMemo(
    () => roleOptions.find((preset) => preset.id === selectedPresetId) ?? null,
    [selectedPresetId]
  );
  const isApOnlyPreset = selectedPresetId === 'ap-only';
  const isArOnlyPreset = selectedPresetId === 'ar-only';
  const requiresApLimits = !isArOnlyPreset;
  const requiresArLimits = !isApOnlyPreset;
  const [roleNameError, setRoleNameError] = useState(false);
  const [roleDescriptionError, setRoleDescriptionError] = useState(false);
  const [roleNameDuplicateError, setRoleNameDuplicateError] = useState(false);
  const [selectedPresetError, setSelectedPresetError] = useState(false);
  const [permissionsError, setPermissionsError] = useState(false);
  const [limitsApError, setLimitsApError] = useState(false);
  const [limitsArError, setLimitsArError] = useState(false);
  const [isRoleCreatedModalOpen, setIsRoleCreatedModalOpen] = useState(false);

  useEffect(() => {
    if (mode !== 'create' || !initialData) return;

    setRoleName(initialData.roleName);
    setRoleDescription(initialData.description);
    setSelectedPermissionsBySection(initialData.permissionsBySection);
    setSelectedPresetId(
      initialData.presetId ??
        roleOptions.find((option) => option.name === initialData.roleName)
          ?.id ??
        ''
    );
    setLimitsSummaryByType(initialData.limitsSummaryByType ?? {});
  }, [initialData, mode]);

  const hasSelectedPermissions = useMemo(
    () =>
      Object.values(selectedPermissionsBySection).some(
        (permissions) => permissions.length > 0
      ),
    [selectedPermissionsBySection]
  );

  const openLimitsModal = (type: 'ap' | 'ar') => {
    setLimitsType(type);
    setLimitsMode(limitsSummaryByType[type]?.mode ?? 'global');
    setIsLimitsModalOpen(true);
  };

  const handleAddLimits = () => {
    if (limitsMode === 'advanced') {
      const nextErrors = getAdvancedLimitsErrors({
        periodsByMethod: advancedMethodPeriods,
        timeframeLimitsByMethod: advancedMethodTimeframeLimits,
        perBillLimitsByMethod: advancedMethodPerBillLimits,
      });

      setAdvancedMethodErrors(nextErrors);

      const hasAdvancedErrors = hasAdvancedLimitsErrors(nextErrors);
      if (hasAdvancedErrors) return;

      setLimitsSummaryByType((prev) => ({
        ...prev,
        [limitsType]: {
          mode: 'advanced',
          summary: createAdvancedLimitsSummary({
            periodsByMethod: advancedMethodPeriods,
            timeframeLimitsByMethod: advancedMethodTimeframeLimits,
            perBillLimitsByMethod: advancedMethodPerBillLimits,
          }),
        },
      }));
      if (limitsType === 'ap') setLimitsApError(false);
      if (limitsType === 'ar') setLimitsArError(false);
      setIsLimitsModalOpen(false);
      return;
    }

    const { hasTimeframeLimit, hasTimeframeSelection, hasPerInvoiceLimit } =
      validateGlobalLimits({
        timeframeLimitValue: timeframeLimit,
        timeframeId: selectedTimeframeId,
        perInvoiceLimitValue: perInvoiceLimit,
      });

    setTimeframeLimitError(!hasTimeframeLimit);
    setTimeframeSelectError(!hasTimeframeSelection);
    setPerInvoiceLimitError(!hasPerInvoiceLimit);

    if (!hasTimeframeLimit || !hasTimeframeSelection || !hasPerInvoiceLimit) {
      return;
    }

    const timeframeLabel =
      selectedTimeframe?.label ?? timeframeOptions[0]?.label ?? 'Weekly';

    setLimitsSummaryByType((prev) => ({
      ...prev,
      [limitsType]: {
        mode: 'global',
        summary: `${timeframeLabel}: $${timeframeLimit}. Bill/Invoice: $${perInvoiceLimit}.`,
      },
    }));
    if (limitsType === 'ap') setLimitsApError(false);
    if (limitsType === 'ar') setLimitsArError(false);
    setIsLimitsModalOpen(false);
  };

  const handleCreateRole = () => {
    const normalizedRoleName = roleName.trim();
    const normalizedDescription = roleDescription.trim();
    const hasSelectedPreset = selectedPresetId.trim().length > 0;
    const isDuplicateRoleName = existingRoleNames.some(
      (name) => name.toLowerCase() === normalizedRoleName.toLowerCase()
    );
    const hasApLimits = Boolean(limitsSummaryByType.ap);
    const hasArLimits = Boolean(limitsSummaryByType.ar);

    setSelectedPresetError(!hasSelectedPreset);
    setRoleNameError(normalizedRoleName.length === 0);
    setRoleDescriptionError(normalizedDescription.length === 0);
    setRoleNameDuplicateError(
      normalizedRoleName.length > 0 && isDuplicateRoleName
    );
    setPermissionsError(!hasSelectedPermissions);
    setLimitsApError(requiresApLimits && !hasApLimits);
    setLimitsArError(requiresArLimits && !hasArLimits);

    if (
      !hasSelectedPreset ||
      normalizedRoleName.length === 0 ||
      normalizedDescription.length === 0 ||
      isDuplicateRoleName ||
      !hasSelectedPermissions ||
      (requiresApLimits && !hasApLimits) ||
      (requiresArLimits && !hasArLimits)
    ) {
      return;
    }

    onCreateRole({
      presetId: selectedPresetId,
      roleName: normalizedRoleName,
      description: normalizedDescription,
      application: selectedPreset?.application ?? 'SMART Hub & DevPortal',
      permissionsBySection: selectedPermissionsBySection,
      limitsSummaryByType,
    });
    setIsRoleCreatedModalOpen(true);
  };

  const limitsTitle =
    limitsType === 'ap'
      ? 'User Approval Limits for Accounts Payable'
      : 'User Approval Limits for Accounts Receivable';

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSelectedPresetError(false);
    if (presetId === 'ap-only') {
      setLimitsArError(false);
    } else if (presetId === 'ar-only') {
      setLimitsApError(false);
    }
  };

  const isViewMode = mode === 'view';
  const resolvedRoleName = initialData?.roleName ?? roleName;
  const resolvedRoleDescription = initialData?.description ?? roleDescription;
  const resolvedPresetName =
    (initialData?.presetId
      ? roleOptions.find((option) => option.id === initialData.presetId)?.name
      : null) ??
    selectedPreset?.name ??
    roleOptions.find((option) => option.name === resolvedRoleName)?.name ??
    resolvedRoleName;
  const resolvedPermissionsBySection =
    initialData?.permissionsBySection ?? selectedPermissionsBySection;
  const resolvedLimitsSummaryByType =
    initialData?.limitsSummaryByType ?? limitsSummaryByType;

  if (isViewMode) {
    return (
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
        <div className="p-6 space-y-[72px]">
          <section>
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-xl leading-8 font-semibold text-gray-900">
                {resolvedPresetName}
              </h3>
            </div>
            <div>
              <div className="pb-5 pt-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Role Information
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Role based on available permissions
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-2">
                  <div className="py-5 text-sm leading-5 font-medium text-gray-900">
                    Role Name
                  </div>
                  <div className="py-5 text-sm leading-5 text-gray-700">
                    {resolvedRoleName}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="pt-5 text-sm leading-5 font-medium text-gray-900">
                    Description
                  </div>
                  <div className="pt-5 text-sm leading-5 text-gray-700">
                    {resolvedRoleDescription}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Permissions
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Permissions for this role.
              </p>
            </div>
            <div className="mt-5">
              {createRolePermissionSections.map((item) => {
                const isExpanded = expandedPermissionSectionId === item.id;
                const permissions = resolvedPermissionsBySection[item.id] ?? [];
                const hasPermissions = permissions.length > 0;

                return (
                  <div
                    key={item.id}
                    className="first:border-t first:border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (!hasPermissions) return;
                        setExpandedPermissionSectionId((prev) =>
                          prev === item.id ? '' : item.id
                        );
                      }}
                      className={clsx(
                        'flex items-center text-left w-full py-3 px-2 border-b border-gray-200',
                        hasPermissions ? 'cursor-pointer' : 'cursor-default',
                        isExpanded && 'bg-gray-50'
                      )}
                    >
                      <Icon
                        icon="chevron-right"
                        className={clsx(
                          'text-gray-500 mr-2 transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                      <span className="text-sm font-medium text-gray-800 pr-4">
                        {item.title}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {item.app}
                      </span>
                    </button>

                    <div
                      className={clsx(
                        'grid transition-all duration-300 ease-in-out',
                        isExpanded
                          ? 'grid-rows-[1fr] opacity-100 mt-6 pb-6 border-b border-gray-200'
                          : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2.5 mx-px">
                          {permissions.map((permission) => (
                            <span
                              key={`${item.id}-${permission}`}
                              className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-sm leading-5"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Approval Limits
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Set limits for this role.
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-5 font-medium text-gray-900">
                    Accounts Payable
                  </p>
                  <p className="text-sm leading-5 text-gray-500">
                    {resolvedLimitsSummaryByType.ap?.summary ??
                      'Set limits for payments initiated by this user.'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="plus"
                  iconDirection="left"
                >
                  Set Limits
                </Button>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-5 font-medium text-gray-900">
                    Accounts Receivable
                  </p>
                  <p className="text-sm leading-5 text-gray-500">
                    {resolvedLimitsSummaryByType.ar?.summary ??
                      'Set limits for payment requests initiated by users.'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="plus"
                  iconDirection="left"
                >
                  Set Limits
                </Button>
              </div>
            </div>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="linkSecondary"
            size="sm"
            icon="arrow-left"
            iconClass="text-gray-500"
            aria-label="Go back"
            onClick={onCancel}
          />
          <h2 className="text-base font-medium text-gray-900">Create Role</h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Select.Root placement="bottom-end">
            <Select.Trigger as="span" className="inline-flex">
              <Button
                variant={selectedPresetError ? 'linkError' : 'linkSecondary'}
                size="md"
                icon="selector"
                iconDirection="right"
                iconClass="text-gray-400"
              >
                {selectedPreset
                  ? `Preset: ${selectedPreset.name}`
                  : 'Select Preset'}
              </Button>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={8} className="z-50">
                <Select.Popup className="w-56 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <PresetDropdownContent
                    selectedPresetId={selectedPresetId}
                    onSelectPreset={handleSelectPreset}
                  />
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="p-6 space-y-[72px]">
        <section>
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Role Information
            </h3>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Create a role based on available permissions and save it to assign
              to your business users.
            </p>
          </div>
          <div className="mt-5 max-w-md space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="create-role-name"
                className="text-sm leading-5 font-medium text-gray-700"
              >
                Role Name
              </label>
              <Input
                id="create-role-name"
                placeholder="Enter role name"
                type="text"
                value={roleName}
                onChange={(event) => {
                  setRoleName(event.target.value);
                  setRoleNameError(false);
                  setRoleNameDuplicateError(false);
                }}
                error={roleNameError || roleNameDuplicateError}
              />
              {(roleNameError || roleNameDuplicateError) && (
                <p className="text-xs leading-4 text-red-500">
                  {roleNameError
                    ? 'Role name is required.'
                    : 'Role with this name already exists.'}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="create-role-description"
                className="text-sm leading-5 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="create-role-description"
                rows={3}
                placeholder="Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi."
                value={roleDescription}
                onChange={(event) => {
                  setRoleDescription(event.target.value);
                  setRoleDescriptionError(false);
                }}
                className={clsx(
                  'transition duration-300 ease-in-out block w-full border border-gray-300 text-base font-normal text-gray-800 placeholder-gray-400 overflow-x-hidden overflow-y-auto focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main rounded-md shadow-sm px-3 py-2 resize-none',
                  roleDescriptionError
                    ? 'border-red-500 placeholder:text-red-300 text-red-900'
                    : 'border-gray-300'
                )}
              />
              {roleDescriptionError && (
                <p className="text-xs leading-4 text-red-500">
                  Description is required.
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Permissions
          </h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Select a set of permissions for this role.
          </p>
          <div className="mt-5">
            {createRolePermissionSections.map((item) => {
              const isExpanded = expandedPermissionSectionId === item.id;
              const selectedPermissions =
                selectedPermissionsBySection[item.id] ?? [];
              const allSelected =
                item.permissions.length > 0 &&
                selectedPermissions.length === item.permissions.length;

              return (
                <div
                  key={item.id}
                  className="first:border-t first:border-gray-200"
                >
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPermissionSectionId((prev) =>
                          prev === item.id ? '' : item.id
                        )
                      }
                      className={clsx(
                        'flex items-center text-left w-full cursor-pointer py-3 px-2 border-b border-gray-200',
                        isExpanded && 'bg-gray-50'
                      )}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.title}`}
                    >
                      <div className="flex items-center pr-6">
                        <Icon
                          icon="chevron-right"
                          className={clsx(
                            'text-gray-500 mr-2 transition-transform duration-200',
                            isExpanded && 'rotate-90'
                          )}
                        />
                        <span className="text-sm font-medium text-gray-800 pr-4">
                          {item.title}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {item.app}
                        </span>
                      </div>
                      <div
                        className="pl-4 border-l border-gray-200 shrink-0"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          variant={allSelected ? 'linkError' : 'linkPrimary'}
                          size="sm"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setSelectedPermissionsBySection((prev) => ({
                              ...prev,
                              [item.id]: allSelected
                                ? []
                                : [...item.permissions],
                            }));
                            setPermissionsError(false);
                          }}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                    </button>
                  </div>

                  <div
                    className={clsx(
                      'grid transition-all duration-300 ease-in-out',
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100 mt-6 pb-6 border-b border-gray-200'
                        : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-2.5 mx-px">
                        {item.permissions.map((permission) => {
                          const isSelected =
                            selectedPermissions.includes(permission);
                          const tooltipText =
                            permission === 'Cancel Scheduled Invoice'
                              ? 'Allows the user to cancel a previously scheduled invoice'
                              : permission;

                          return (
                            <Tooltip
                              key={`${item.id}-${permission}`}
                              trigger="hover"
                              placement="top"
                            >
                              <TooltipTrigger as="span">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPermissionsError(false);
                                    setSelectedPermissionsBySection((prev) => {
                                      const current = prev[item.id] ?? [];
                                      const exists =
                                        current.includes(permission);
                                      return {
                                        ...prev,
                                        [item.id]: exists
                                          ? current.filter(
                                              (p) => p !== permission
                                            )
                                          : [...current, permission],
                                      };
                                    });
                                  }}
                                  className="inline-flex"
                                >
                                  <Badge
                                    size="sm"
                                    color={isSelected ? 'blue' : 'gray'}
                                    rounded
                                    icon={isSelected ? 'x' : 'plus'}
                                    iconDirection="left"
                                    iconClickable
                                  >
                                    {permission}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-lg px-2.5 py-1 text-sm leading-5 bg-gray-900 text-white shadow-lg">
                                {tooltipText}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {permissionsError && (
            <p className="mt-3 text-xs leading-4 text-red-500">
              Select at least one permission before creating a role.
            </p>
          )}
        </section>

        <section>
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Approval Limits
            </h3>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Set limits for this role.
            </p>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm leading-5 font-medium text-gray-900">
                    Accounts Payable
                  </p>
                  {limitsSummaryByType.ap && (
                    <Badge size="sm" color="gray" rounded>
                      {limitsSummaryByType.ap.mode === 'global'
                        ? 'Global Limits'
                        : 'Advanced Limits'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-5 text-gray-500">
                  {limitsSummaryByType.ap?.summary ??
                    'Set limits for payments initiated by users.'}
                </p>
                {limitsApError && (
                  <p className="text-xs leading-4 text-red-500">
                    Accounts Payable limits are required.
                  </p>
                )}
              </div>
              <Button
                variant={limitsSummaryByType.ap ? 'linkPrimary' : 'secondary'}
                size="sm"
                icon={limitsSummaryByType.ap ? undefined : 'plus'}
                iconDirection="left"
                onClick={() => openLimitsModal('ap')}
                disabled={!requiresApLimits}
              >
                {requiresApLimits
                  ? limitsSummaryByType.ap
                    ? 'Update'
                    : 'Set Limits'
                  : 'Not Required'}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm leading-5 font-medium text-gray-900">
                    Accounts Receivable
                  </p>
                  {limitsSummaryByType.ar && (
                    <Badge size="sm" color="gray" rounded>
                      {limitsSummaryByType.ar.mode === 'global'
                        ? 'Global Limits'
                        : 'Advanced Limits'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-5 text-gray-500">
                  {limitsSummaryByType.ar?.summary ??
                    'Set limits for payment requests initiated by users.'}
                </p>
                {limitsArError && (
                  <p className="text-xs leading-4 text-red-500">
                    Accounts Receivable limits are required.
                  </p>
                )}
              </div>
              <Button
                variant={limitsSummaryByType.ar ? 'linkPrimary' : 'secondary'}
                size="sm"
                icon={limitsSummaryByType.ar ? undefined : 'plus'}
                iconDirection="left"
                onClick={() => openLimitsModal('ar')}
                disabled={!requiresArLimits}
              >
                {requiresArLimits
                  ? limitsSummaryByType.ar
                    ? 'Update'
                    : 'Set Limits'
                  : 'Not Required'}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <Button variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" onClick={handleCreateRole}>
          Create
        </Button>
      </div>

      {isRoleCreatedModalOpen && (
        <LayoutModal>
          <Modal
            className="w-128"
            title="Role Created"
            titleCenter
            description={`[${roleName.trim()}] role has been created. You can now assign it to your users.`}
            icon={
              <Icon icon="check-circle" className="h-11 w-11 text-green-500" />
            }
            onClose={() => {
              setIsRoleCreatedModalOpen(false);
              onCancel();
            }}
          >
            <Button
              size="xl"
              className="w-full"
              onClick={() => {
                setIsRoleCreatedModalOpen(false);
                onCancel();
              }}
            >
              Done
            </Button>
          </Modal>
        </LayoutModal>
      )}

      {isLimitsModalOpen && (
        <LayoutModal>
          <WrapModal
            className="w-full max-w-[980px]"
            onClose={() => setIsLimitsModalOpen(false)}
            noHeader
            footer={
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsLimitsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddLimits}>
                  Add
                </Button>
              </div>
            }
          >
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2.5">
              <span className="text-ldg leading-6 font-medium text-gray-900">
                {limitsTitle}
              </span>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="flex items-center gap-6 justify-between pb-6 w-full border-b border-gray-200">
                <span className="text-lg leading-6 font-medium text-gray-900">
                  {limitsMode === 'global'
                    ? 'Global Limits'
                    : 'Advanced Limits'}
                </span>
                <Button
                  variant="linkPrimary"
                  size="sm"
                  icon="chevron-right"
                  iconDirection="right"
                  iconClass="w-3.5 h-3.5"
                  onClick={() =>
                    setLimitsMode((prev) =>
                      prev === 'global' ? 'advanced' : 'global'
                    )
                  }
                >
                  {limitsMode === 'global'
                    ? 'Switch to Advanced Limits'
                    : 'Switch to Global Limits'}
                </Button>
              </div>

              {limitsMode === 'global' ? (
                <div className="space-y-6 mt-6">
                  <div>
                    <div className="text-base leading-6 font-medium text-gray-900">
                      Timeframe Limits
                    </div>
                    <p className="text-sm leading-5 text-gray-500 mt-0.5">
                      Approval will be required above the set limit within the
                      selected timeframe.
                    </p>
                    <div className="mt-4">
                      <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                        Limit
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-44">
                          <span
                            className={clsx(
                              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                              timeframeLimitError && 'text-red-500'
                            )}
                          >
                            $
                          </span>
                          <Input
                            value={timeframeLimit}
                            onChange={(event) => {
                              setTimeframeLimit(
                                formatAmountValue(event.target.value)
                              );
                              setTimeframeLimitError(false);
                            }}
                            placeholder="0.00"
                            className="w-full"
                            inputClass="pl-7"
                            error={timeframeLimitError}
                          />
                        </div>
                        <Select.Root placement="bottom-start">
                          <Select.Trigger
                            className={clsx(
                              'w-44 h-10 shadow-sm border rounded-md px-3 text-sm text-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
                              timeframeSelectError
                                ? 'border-red-500 ring-1 ring-red-500'
                                : 'border-gray-300'
                            )}
                          >
                            <span
                              className={
                                selectedTimeframe
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                              }
                            >
                              {selectedTimeframe?.label ?? 'Select period'}
                            </span>
                            <Icon
                              icon="selector"
                              className="w-4 h-4 text-gray-400"
                            />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Positioner sideOffset={2} className="z-50">
                              <Select.Popup className="min-w-44 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
                                <TimeframeDropdownContent
                                  selectedId={selectedTimeframeId}
                                  onSelect={(id) => {
                                    setSelectedTimeframeId(id);
                                    setTimeframeSelectError(false);
                                  }}
                                />
                              </Select.Popup>
                            </Select.Positioner>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-base leading-6 font-medium text-gray-900">
                      Per Bill/Invoices
                    </div>
                    <p className="text-sm leading-5 text-gray-500 mt-0.5">
                      Approval will be required if the invoice amount will be
                      higher than the set amount.
                    </p>
                    <div className="mt-4">
                      <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                        Limit
                      </label>
                      <div className="relative w-40">
                        <span
                          className={clsx(
                            'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                            perInvoiceLimitError && 'text-red-500'
                          )}
                        >
                          $
                        </span>
                        <Input
                          value={perInvoiceLimit}
                          onChange={(event) => {
                            setPerInvoiceLimit(
                              formatAmountValue(event.target.value)
                            );
                            setPerInvoiceLimitError(false);
                          }}
                          className="w-full"
                          inputClass="pl-7"
                          error={perInvoiceLimitError}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-gray-50 p-3 text-xs leading-4 text-gray-500 flex w-full items-center gap-3">
                    <Icon
                      icon="information-circle"
                      className="w-4 h-4 text-gray-400"
                    />
                    If left empty, no limits apply
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pt-4 pb-6">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      By Method of Payment{' '}
                      <span className="text-gray-500 font-normal">
                        (per month)
                      </span>
                    </div>
                    <p className="text-xs leading-4 text-gray-500 mt-0.5">
                      Approval will be required above the set limit for a
                      selected method of payment.
                    </p>
                  </div>

                  <div>
                    <div className="flex space-x-6 items-center py-3 border-b border-gray-200">
                      <span className="w-full max-w-[200px]" />
                      <span className="w-full max-w-[304px] text-xs leading-4 font-medium text-gray-500 uppercase">
                        Timeframe / Limits
                      </span>
                      <span className="w-[147px] text-xs leading-4 font-medium text-gray-500 uppercase">
                        Per Bill/Invoice
                      </span>
                    </div>
                    {advancedLimitMethods.map((method) => (
                      <div
                        key={method}
                        className="flex space-x-6 items-center py-4"
                      >
                        <span className="text-sm font-medium leading-5 text-gray-700 w-full max-w-[200px]">
                          {method}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="relative w-full max-w-[147px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <Input
                              placeholder="0.00"
                              value={advancedMethodTimeframeLimits[method]}
                              className="w-full"
                              onChange={(event) => {
                                setAdvancedMethodTimeframeLimits((prev) => ({
                                  ...prev,
                                  [method]: formatAmountValue(
                                    event.target.value
                                  ),
                                }));
                                setAdvancedMethodErrors((prev) => ({
                                  ...prev,
                                  [method]: {
                                    ...prev[method],
                                    timeframeLimit: false,
                                  },
                                }));
                              }}
                              inputClass="pl-8"
                              size="sm"
                              error={
                                advancedMethodErrors[method]?.timeframeLimit
                              }
                            />
                          </div>
                          <Select.Root placement="bottom-start">
                            <Select.Trigger
                              className={clsx(
                                'w-[147px] shadow-sm h-8 border rounded-md px-2 text-sm text-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
                                advancedMethodErrors[method]?.timeframePeriod
                                  ? 'border-red-500 ring-1 ring-red-500'
                                  : 'border-gray-300'
                              )}
                            >
                              <span
                                className={
                                  advancedMethodPeriods[method]
                                    ? 'text-gray-700'
                                    : 'text-gray-400'
                                }
                              >
                                {advancedPeriodOptions.find(
                                  (option) =>
                                    option.id === advancedMethodPeriods[method]
                                )?.label ?? 'Monthly'}
                              </span>
                              <Icon
                                icon="selector"
                                className="w-4 h-4 text-gray-400"
                              />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Positioner
                                sideOffset={2}
                                className="z-50"
                              >
                                <Select.Popup className="min-w-[147px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
                                  <AdvancedPeriodDropdownContent
                                    selectedId={advancedMethodPeriods[method]}
                                    onSelect={(id) => {
                                      setAdvancedMethodPeriods((prev) => ({
                                        ...prev,
                                        [method]: id,
                                      }));
                                      setAdvancedMethodErrors((prev) => ({
                                        ...prev,
                                        [method]: {
                                          ...prev[method],
                                          timeframePeriod: false,
                                        },
                                      }));
                                    }}
                                  />
                                </Select.Popup>
                              </Select.Positioner>
                            </Select.Portal>
                          </Select.Root>
                        </div>
                        <div className="relative w-[147px]">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            $
                          </span>
                          <Input
                            placeholder="0.00"
                            value={advancedMethodPerBillLimits[method]}
                            className="w-full"
                            onChange={(event) => {
                              setAdvancedMethodPerBillLimits((prev) => ({
                                ...prev,
                                [method]: formatAmountValue(event.target.value),
                              }));
                              setAdvancedMethodErrors((prev) => ({
                                ...prev,
                                [method]: {
                                  ...prev[method],
                                  perBillInvoice: false,
                                },
                              }));
                            }}
                            inputClass="pl-8"
                            size="sm"
                            error={advancedMethodErrors[method]?.perBillInvoice}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md bg-gray-50 p-3 text-xs leading-4 text-gray-500 flex w-full items-center gap-3">
                    <Icon
                      icon="information-circle"
                      className="w-4 h-4 text-gray-400"
                    />
                    If left empty, no limits apply
                  </div>
                </div>
              )}
            </div>
          </WrapModal>
        </LayoutModal>
      )}
    </div>
  );
};

export default CreateRoleView;

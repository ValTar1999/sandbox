import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import WrapModal from '../components/common/modal/WrapModal';
import Input from '../components/common/base/Input';
import Button from '../components/common/base/Button';
import Badge from '../components/common/base/Badge';
import Icon from '../components/common/base/Icon';
import { Avatar } from '../components/common/base/Avatar';
import Select from '../components/common/base/Select';
import RemoveUserModal from './RemoveUserModal';
import RemoveProfilePhotoModal from './RemoveProfilePhotoModal';
import {
  AdvancedPeriodDropdownContent,
  RoleDropdownContent,
  TimeframeDropdownContent,
} from './userModalSharedComponents';
import {
  advancedLimitMethods,
  advancedPeriodOptions,
  type AdvancedMethodFieldErrors,
  formatAmountValue,
  type LimitsMode,
  type LimitsSummary,
  permissionSections,
  roleOptions,
  selectedRoleDescription,
  timeframeOptions,
} from './userModalSharedData';
import type { UserRow } from '../pages/UserManagment/data';

type EditUserModalProps = {
  open: boolean;
  user: UserRow | null;
  onClose: () => void;
  onRemoveUser: (user: UserRow) => void;
  onSaveUser: (
    userId: string,
    payload: {
      name: string;
      email: string;
      role: string;
      avatarUrl?: string;
    }
  ) => void;
  initialLimits?: {
    ap?: LimitsSummary;
    ar?: LimitsSummary;
  };
  onSaveLimits: (
    userId: string,
    limits: {
      ap?: LimitsSummary;
      ar?: LimitsSummary;
    }
  ) => void;
};

const EditUserModal = ({
  open,
  user,
  onClose,
  onRemoveUser,
  onSaveUser,
  initialLimits,
  onSaveLimits,
}: EditUserModalProps) => {
  const parsedName = useMemo(() => {
    if (!user || user.name === '-')
      return { firstName: 'Chelsea', lastName: 'Hagon' };
    const [firstName = '', ...rest] = user.name.split(' ');
    return { firstName, lastName: rest.join(' ') };
  }, [user]);

  const [firstName, setFirstName] = useState(parsedName.firstName);
  const [lastName, setLastName] = useState(parsedName.lastName);
  const [email, setEmail] = useState(
    user?.email ?? 'chelsea.hagon@bigkahunaburger.com'
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('full-access');
  const [view, setView] = useState<'edit' | 'permissions' | 'limits'>('edit');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [isRemovePhotoModalOpen, setIsRemovePhotoModalOpen] = useState(false);
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null);
  const [limitsType, setLimitsType] = useState<'ap' | 'ar'>('ap');
  const [limitsMode, setLimitsMode] = useState<LimitsMode>('global');
  const [limitsSummaryByType, setLimitsSummaryByType] = useState<{
    ap?: LimitsSummary;
    ar?: LimitsSummary;
  }>({});
  const [selectedTimeframeId, setSelectedTimeframeId] = useState('weekly');
  const [timeframeLimit, setTimeframeLimit] = useState('100,000.00');
  const [perInvoiceLimit, setPerInvoiceLimit] = useState('20,000.00');
  const [timeframeLimitError, setTimeframeLimitError] = useState(false);
  const [timeframeSelectError, setTimeframeSelectError] = useState(false);
  const [perInvoiceLimitError, setPerInvoiceLimitError] = useState(false);
  const [openPermissionSectionIds, setOpenPermissionSectionIds] = useState<
    string[]
  >(permissionSections.map((section) => section.id));
  const [advancedMethodPeriods, setAdvancedMethodPeriods] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
  );
  const [advancedMethodTimeframeLimits, setAdvancedMethodTimeframeLimits] =
    useState<Record<string, string>>(() =>
      Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
    );
  const [advancedMethodPerBillLimits, setAdvancedMethodPerBillLimits] =
    useState<Record<string, string>>(() =>
      Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
    );
  const [advancedMethodErrors, setAdvancedMethodErrors] = useState<
    Record<string, AdvancedMethodFieldErrors>
  >(() =>
    Object.fromEntries(
      advancedLimitMethods.map((method) => [
        method,
        {
          timeframeLimit: false,
          timeframePeriod: false,
          perBillInvoice: false,
        },
      ])
    )
  );
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const roleIdByName = useMemo(
    () => Object.fromEntries(roleOptions.map((role) => [role.name, role.id])),
    []
  );

  const selectedRole = useMemo(
    () =>
      roleOptions.find((role) => role.id === selectedRoleId) ?? roleOptions[0],
    [selectedRoleId]
  );
  const selectedTimeframe = useMemo(
    () =>
      timeframeOptions.find((option) => option.id === selectedTimeframeId) ??
      null,
    [selectedTimeframeId]
  );

  useEffect(() => {
    if (!open || !user) return;
    setFirstName(parsedName.firstName);
    setLastName(parsedName.lastName);
    setEmail(user.email);
    setSelectedRoleId(roleIdByName[user.role] ?? 'full-access');
    setLimitsSummaryByType(initialLimits ?? {});
    setProfilePhotoUrl(user.avatarUrl ?? '');
    setIsRemovePhotoModalOpen(false);
    setIsRemoveUserModalOpen(false);
    setIsChangeRoleModalOpen(false);
    setPendingRoleId(null);
    setView('edit');
  }, [
    open,
    user,
    parsedName.firstName,
    parsedName.lastName,
    roleIdByName,
    initialLimits,
  ]);

  useEffect(() => {
    return () => {
      if (profilePhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
  }, [profilePhotoUrl]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfilePhotoUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemovePhoto = () => {
    setProfilePhotoUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return '';
    });
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const togglePermissionSection = (sectionId: string) => {
    setOpenPermissionSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAddLimits = () => {
    if (limitsMode === 'advanced') {
      const nextErrors = Object.fromEntries(
        advancedLimitMethods.map((method) => {
          const timeframeLimitValue =
            advancedMethodTimeframeLimits[method] ?? '';
          const timeframePeriodValue = advancedMethodPeriods[method] ?? '';
          const perBillInvoiceValue = advancedMethodPerBillLimits[method] ?? '';
          const methodIsTouched =
            timeframeLimitValue.trim().length > 0 ||
            timeframePeriodValue.trim().length > 0 ||
            perBillInvoiceValue.trim().length > 0;

          if (!methodIsTouched) {
            return [
              method,
              {
                timeframeLimit: false,
                timeframePeriod: false,
                perBillInvoice: false,
              },
            ];
          }

          return [
            method,
            {
              timeframeLimit: timeframeLimitValue.trim().length === 0,
              timeframePeriod: timeframePeriodValue.trim().length === 0,
              perBillInvoice: perBillInvoiceValue.trim().length === 0,
            },
          ];
        })
      ) as Record<string, AdvancedMethodFieldErrors>;
      setAdvancedMethodErrors(nextErrors);

      const hasAdvancedErrors = Object.values(nextErrors).some(
        (error) =>
          error.timeframeLimit || error.timeframePeriod || error.perBillInvoice
      );
      if (hasAdvancedErrors) return;

      setLimitsSummaryByType((prev) => ({
        ...prev,
        [limitsType]: {
          mode: 'advanced',
          summary: `${advancedLimitMethods[0]} - ${
            advancedPeriodOptions.find(
              (option) =>
                option.id === advancedMethodPeriods[advancedLimitMethods[0]]
            )?.label ?? 'Monthly'
          }: $${advancedMethodTimeframeLimits[advancedLimitMethods[0]]}. Bill/Invoice: $${
            advancedMethodPerBillLimits[advancedLimitMethods[0]]
          }. ...`,
        },
      }));
      setView('edit');
      return;
    }

    const hasTimeframeLimit = timeframeLimit.trim().length > 0;
    const hasTimeframeSelection = selectedTimeframeId.trim().length > 0;
    const hasPerInvoiceLimit = perInvoiceLimit.trim().length > 0;
    setTimeframeLimitError(!hasTimeframeLimit);
    setTimeframeSelectError(!hasTimeframeSelection);
    setPerInvoiceLimitError(!hasPerInvoiceLimit);
    if (!hasTimeframeLimit || !hasTimeframeSelection || !hasPerInvoiceLimit)
      return;

    const timeframeLabel =
      selectedTimeframe?.label ?? timeframeOptions[0]?.label ?? 'Weekly';
    setLimitsSummaryByType((prev) => ({
      ...prev,
      [limitsType]: {
        mode: 'global',
        summary: `${timeframeLabel}: $${timeframeLimit}. Bill/Invoice: $${perInvoiceLimit}.`,
      },
    }));
    setView('edit');
  };

  const limitsTitle =
    limitsType === 'ap'
      ? 'User Approval Limits for Accounts Payable'
      : 'User Approval Limits for Accounts Receivable';
  const showAccountsPayableLimits = selectedRoleId !== 'ar-only';
  const showAccountsReceivableLimits = selectedRoleId !== 'ap-only';
  const pendingRole = pendingRoleId
    ? (roleOptions.find((role) => role.id === pendingRoleId) ?? null)
    : null;

  if (!user) return null;

  return (
    <>
      <LayoutModal open={open}>
        <WrapModal
          className="w-full max-w-[980px]"
          onClose={onClose}
          noHeader={view === 'permissions' || view === 'limits'}
          header={view === 'edit' ? <div>Edit Profile</div> : undefined}
          footer={
            view === 'edit' ? (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="linkSecondary"
                  size="sm"
                  className="!p-0 !text-red-500 hover:!text-red-600"
                  onClick={() => setIsRemoveUserModalOpen(true)}
                >
                  Remove User
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="md" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    onClick={() => {
                      if (!user) return;
                      const fullName = `${firstName} ${lastName}`.trim();
                      onSaveUser(user.id, {
                        name: fullName || '-',
                        email: email.trim(),
                        role: selectedRole.name,
                        avatarUrl: profilePhotoUrl || undefined,
                      });
                      onSaveLimits(user.id, limitsSummaryByType);
                      onClose();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : view === 'limits' ? (
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setView('edit')}
                >
                  Go back to edit
                </Button>
                <Button size="sm" onClick={handleAddLimits}>
                  Add
                </Button>
              </div>
            ) : undefined
          }
        >
          {view === 'permissions' ? (
            <>
              <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2.5">
                <Button
                  variant="linkSecondary"
                  size="xs"
                  icon="chevron-left"
                  iconClass="w-4 h-4 text-gray-500"
                  onClick={() => setView('edit')}
                  aria-label="Back"
                />
                <span className="text-ldg leading-6 font-medium text-gray-900">
                  {selectedRole?.name ?? 'Full Access'}
                </span>
              </div>

              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {permissionSections.map((section) => (
                  <div
                    key={section.id}
                    className="divide-y divide-gray-200 border-b border-gray-200 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => togglePermissionSection(section.id)}
                      className="w-full px-2 py-4 bg-gray-50 flex border-b border-gray-200 items-center gap-2 text-left cursor-pointer"
                    >
                      <Icon
                        icon="chevron-up"
                        className={clsx(
                          'w-3 h-3 text-gray-500 transition-transform duration-200',
                          !openPermissionSectionIds.includes(section.id) &&
                            '-rotate-180'
                        )}
                      />
                      <div className="flex items-center gap-4">
                        <span className="text-sm leading-5 font-medium text-gray-800">
                          {section.title}
                        </span>
                        <span className="text-xs leading-4 font-medium text-gray-500">
                          {section.app}
                        </span>
                      </div>
                    </button>
                    <div
                      className={clsx(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        openPermissionSectionIds.includes(section.id)
                          ? 'max-h-80 opacity-100'
                          : 'max-h-0 opacity-0'
                      )}
                    >
                      <div className="py-6 flex flex-wrap gap-2.5">
                        {section.permissions.map((permission) => (
                          <Badge
                            key={permission}
                            size="sm"
                            color="gray"
                            rounded
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : view === 'limits' ? (
            <>
              <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2.5">
                <Button
                  variant="linkSecondary"
                  size="xs"
                  icon="chevron-left"
                  iconClass="w-4 h-4 text-gray-500"
                  onClick={() => setView('edit')}
                  aria-label="Back"
                />
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
                          <Select.Root
                            placement="bottom-start"
                            matchTriggerWidth={false}
                          >
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
                              <Select.Positioner
                                sideOffset={2}
                                className="z-50"
                              >
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
            </>
          ) : (
            <div className="grid grid-cols-2 min-h-[430px]">
              <div className="p-6 border-r border-gray-200">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      icon="mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm leading-5 font-medium text-gray-700">
                        Phone Number
                      </label>
                      <span className="text-sm leading-5 text-gray-500">
                        Optional
                      </span>
                    </div>
                    <Input
                      icon="phone"
                      placeholder=""
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm leading-5 font-medium text-gray-700">
                        Profile Photo
                      </label>
                      <span className="text-xs leading-4 font-medium text-gray-500">
                        Optional
                      </span>
                    </div>
                    <div className="text-xs leading-4 text-gray-500">
                      The Profile Photo must be square, and at least 512 pixels
                      wide and tall.
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar
                        size="xl"
                        fullName={`${firstName} ${lastName}`.trim() || undefined}
                        imageSrc={profilePhotoUrl || undefined}
                      />
                      <div className="flex flex-col justify-start gap-2">
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => photoInputRef.current?.click()}
                        >
                          Change Photo
                        </Button>
                        <div>
                          <Button
                            variant="linkSecondary"
                            size="xs"
                            className="!p-0"
                            onClick={() => setIsRemovePhotoModalOpen(true)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div
                    className={clsx(
                      selectedRole ? 'bg-gray-50 rounded-b-lg' : ''
                    )}
                  >
                    <Select.Root placement="bottom-start">
                      <Select.Trigger className="w-full h-10 shadow-sm border border-gray-300 rounded-md px-3 text-left flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main">
                        <span className="text-gray-900">
                          {selectedRole.name}
                        </span>
                        <Icon
                          icon="selector"
                          className="w-5 h-5 text-gray-400"
                        />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner sideOffset={0} className="z-50">
                          <Select.Popup className="rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
                            <RoleDropdownContent
                              onSelectRole={setSelectedRoleId}
                              selectedRoleId={selectedRoleId}
                              showCheckIcon
                              onInfoClick={(roleId) => {
                                if (roleId === selectedRoleId) return;
                                setPendingRoleId(roleId);
                                setIsChangeRoleModalOpen(true);
                              }}
                            />
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                    <div className="p-4 flex flex-col space-y-3 items-start">
                      <p className="text-sm leading-5 text-gray-500">
                        {selectedRole.description ?? selectedRoleDescription}
                      </p>
                      <Button
                        variant="linkPrimary"
                        size="sm"
                        icon="arrow-right"
                        iconDirection="right"
                        iconClass="!w-3 !h-3"
                        className="-ml-2 -mb-2"
                        onClick={() => setView('permissions')}
                      >
                        View all role permissions
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base leading-6 font-medium text-gray-900">
                      User Approval Limits
                    </span>
                    <Icon
                      icon="information-circle"
                      className="w-4.5 h-4.5 text-gray-400"
                    />
                  </div>
                  <div className="space-y-4">
                    {showAccountsPayableLimits && (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm leading-5 font-medium text-gray-700">
                              Accounts Payable
                            </div>
                            {limitsSummaryByType.ap && (
                              <Badge size="sm" color="gray" rounded>
                                {limitsSummaryByType.ap.mode === 'global'
                                  ? 'Global Limits'
                                  : 'Advanced Limits'}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm leading-5 text-gray-500">
                            {limitsSummaryByType.ap?.summary ??
                              'Set limits for payments initiated by this user.'}
                          </div>
                        </div>
                        {limitsSummaryByType.ap ? (
                          <Button
                            variant="linkPrimary"
                            size="sm"
                            onClick={() => {
                              setLimitsType('ap');
                              setLimitsMode(
                                limitsSummaryByType.ap?.mode ?? 'global'
                              );
                              setView('limits');
                            }}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon="plus"
                            iconDirection="left"
                            onClick={() => {
                              setLimitsType('ap');
                              setLimitsMode('global');
                              setView('limits');
                            }}
                          >
                            Set Limits
                          </Button>
                        )}
                      </div>
                    )}
                    {showAccountsReceivableLimits && (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm leading-5 font-medium text-gray-700">
                              Accounts Receivable
                            </div>
                            {limitsSummaryByType.ar && (
                              <Badge size="sm" color="gray" rounded>
                                {limitsSummaryByType.ar.mode === 'global'
                                  ? 'Global Limits'
                                  : 'Advanced Limits'}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm leading-5 text-gray-500">
                            {limitsSummaryByType.ar?.summary ??
                              'Set limits for payment requests initiated by this user.'}
                          </div>
                        </div>
                        {limitsSummaryByType.ar ? (
                          <Button
                            variant="linkPrimary"
                            size="sm"
                            onClick={() => {
                              setLimitsType('ar');
                              setLimitsMode(
                                limitsSummaryByType.ar?.mode ?? 'global'
                              );
                              setView('limits');
                            }}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon="plus"
                            iconDirection="left"
                            onClick={() => {
                              setLimitsType('ar');
                              setLimitsMode('global');
                              setView('limits');
                            }}
                          >
                            Set Limits
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </WrapModal>
      </LayoutModal>
      <RemoveProfilePhotoModal
        open={isRemovePhotoModalOpen}
        onClose={() => setIsRemovePhotoModalOpen(false)}
        onConfirm={() => {
          handleRemovePhoto();
          setIsRemovePhotoModalOpen(false);
        }}
      />
      <RemoveUserModal
        user={isRemoveUserModalOpen ? user : null}
        onClose={() => setIsRemoveUserModalOpen(false)}
        onConfirm={() => {
          if (!user) return;
          onRemoveUser(user);
          setIsRemoveUserModalOpen(false);
        }}
      />
      {pendingRole && (
        <LayoutModal open={isChangeRoleModalOpen}>
          <Modal
            className="w-128"
            title="Are you sure you want to change role?"
            titleCenter
            description={`You are about to change the role from <b>[${selectedRole.name}]</b> to <b>[${pendingRole.name}]</b>`}
            icon={
              <Icon icon="exclamation" className="h-11 w-11 text-yellow-500" />
            }
            onClose={() => {
              setIsChangeRoleModalOpen(false);
              setPendingRoleId(null);
            }}
          >
            <div className="w-full grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setIsChangeRoleModalOpen(false);
                  setPendingRoleId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  if (pendingRoleId) {
                    setSelectedRoleId(pendingRoleId);
                  }
                  setIsChangeRoleModalOpen(false);
                  setPendingRoleId(null);
                }}
              >
                Yes, change role
              </Button>
            </div>
          </Modal>
        </LayoutModal>
      )}
    </>
  );
};

export default EditUserModal;

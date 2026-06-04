import { useMemo, useState } from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import WrapModal from '../components/common/modal/WrapModal';
import Input from '../components/common/base/Input';
import Button from '../components/common/base/Button';
import Badge from '../components/common/base/Badge';
import Icon from '../components/common/base/Icon';
import Select from '../components/common/base/Select';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../components/common/base/Tooltip';
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

type AddNewUserModalProps = {
  open: boolean;
  onClose: () => void;
  onInviteUser?: (payload: {
    name: string;
    email: string;
    role: string;
    limitsSummaryByType: {
      ap?: LimitsSummary;
      ar?: LimitsSummary;
    };
  }) => void;
};

const AddNewUserModal = ({
  open,
  onClose,
  onInviteUser,
}: AddNewUserModalProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [view, setView] = useState<
    'invite' | 'permissions' | 'limits' | 'success'
  >('invite');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
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
  const [limitsRequiredError, setLimitsRequiredError] = useState(false);
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

  const selectedRole = useMemo(
    () => roleOptions.find((role) => role.id === selectedRoleId) ?? null,
    [selectedRoleId]
  );
  const selectedTimeframe = useMemo(
    () =>
      timeframeOptions.find((option) => option.id === selectedTimeframeId) ??
      null,
    [selectedTimeframeId]
  );

  const handleClose = () => {
    setSelectedRoleId('');
    setView('invite');
    setInviteEmail('');
    setInviteFirstName('');
    setInviteLastName('');
    setInviteMessage('');
    setLimitsType('ap');
    setLimitsMode('global');
    setSelectedTimeframeId('weekly');
    setTimeframeLimit('100,000.00');
    setPerInvoiceLimit('20,000.00');
    setTimeframeLimitError(false);
    setTimeframeSelectError(false);
    setPerInvoiceLimitError(false);
    setLimitsRequiredError(false);
    setLimitsSummaryByType({});
    setOpenPermissionSectionIds(
      permissionSections.map((section) => section.id)
    );
    setAdvancedMethodPeriods(
      Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
    );
    setAdvancedMethodTimeframeLimits(
      Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
    );
    setAdvancedMethodPerBillLimits(
      Object.fromEntries(advancedLimitMethods.map((method) => [method, '']))
    );
    setAdvancedMethodErrors(
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
    onClose();
  };

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
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

          const hasTimeframeLimit = timeframeLimitValue.trim().length > 0;
          const hasTimeframePeriod = timeframePeriodValue.trim().length > 0;
          const hasPerBillInvoice = perBillInvoiceValue.trim().length > 0;

          return [
            method,
            {
              timeframeLimit: !hasTimeframeLimit,
              timeframePeriod: !hasTimeframePeriod,
              perBillInvoice: !hasPerBillInvoice,
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
      setLimitsRequiredError(false);
      setView('invite');
      return;
    }

    const hasTimeframeLimit = timeframeLimit.trim().length > 0;
    const hasTimeframeSelection = selectedTimeframeId.trim().length > 0;
    const hasPerInvoiceLimit = perInvoiceLimit.trim().length > 0;

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
    setLimitsRequiredError(false);
    setView('invite');
  };

  const requiredLimitsTypes: Array<'ap' | 'ar'> =
    selectedRoleId === 'ar-only'
      ? ['ar']
      : selectedRoleId === 'ap-only'
        ? ['ap']
        : selectedRoleId === 'full-access' ||
            selectedRoleId === 'view-only' ||
            selectedRoleId === 'technical'
          ? ['ap', 'ar']
          : ['ap'];

  const handleSendInvite = () => {
    if (!selectedRole) return;
    const hasRequiredLimits = requiredLimitsTypes.every((type) =>
      Boolean(limitsSummaryByType[type])
    );
    if (!hasRequiredLimits) {
      setLimitsRequiredError(true);
      return;
    }

    const fullName = `${inviteFirstName} ${inviteLastName}`.trim();
    onInviteUser?.({
      name: fullName || '-',
      email: inviteEmail.trim(),
      role: selectedRole.name,
      limitsSummaryByType,
    });
    setView('success');
  };

  const limitsTitle =
    limitsType === 'ap'
      ? 'User Approval Limits for Accounts Payable'
      : 'User Approval Limits for Accounts Receivable';
  const showAccountsPayableLimits = selectedRoleId !== 'ar-only';
  const showAccountsReceivableLimits = selectedRoleId !== 'ap-only';
  const isAccountsPayableRequired = requiredLimitsTypes.includes('ap');
  const isAccountsReceivableRequired = requiredLimitsTypes.includes('ar');

  if (view === 'success') {
    return (
      <LayoutModal open={open}>
        <Modal
          className="w-128"
          title="Invitation Sent"
          titleCenter
          description={`Invitation to <b>[${inviteEmail}]</b> was successfully sent. The user was added to your business user list.`}
          icon={
            <Icon icon="check-circle" className="h-11 w-11 text-green-500" />
          }
          onClose={handleClose}
        >
          <Button size="xl" className="w-full" onClick={handleClose}>
            Done
          </Button>
        </Modal>
      </LayoutModal>
    );
  }

  return (
    <LayoutModal open={open}>
      <WrapModal
        className="w-full max-w-[980px]"
        onClose={handleClose}
        noHeader={view === 'permissions' || view === 'limits'}
        header={view === 'invite' ? <div>Invite Team Member</div> : undefined}
        footer={
          view === 'invite' ? (
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" size="lg" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={handleSendInvite}
                disabled={
                  !selectedRole ||
                  !inviteEmail.trim() ||
                  !inviteFirstName.trim() ||
                  !inviteLastName.trim()
                }
              >
                Send Invite
              </Button>
            </div>
          ) : view === 'limits' ? (
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setView('invite')}
              >
                Go back to invite
              </Button>
              <Button size="lg" onClick={handleAddLimits}>
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
                onClick={() => setView('invite')}
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
                        <Badge key={permission} size="sm" color="gray" rounded>
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
                onClick={() => setView('invite')}
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

                  <div className="">
                    <div className="flex space-x-6 items-center py-3 border-b border-gray-200 mb-2.5">
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
                        className="flex space-x-6 items-center py-1.5"
                      >
                        <span className="text-sm font-medium leading-5 text-gray-700 w-full max-w-[200px]">
                          {method}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="relative w-full max-w-[147px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M10.9999 2C10.9999 1.44772 10.5522 1 9.99988 1C9.44759 1 8.99988 1.44772 8.99988 2V3.07498C6.65825 3.43371 4.99988 5.03858 4.99988 7C4.99988 8.96142 6.65825 10.5663 8.99988 10.925V14.9249C8.28519 14.8122 7.77152 14.5905 7.42483 14.3873C7.17579 14.2413 6.79177 13.8893 6.79177 13.8893C6.45923 13.4578 5.8407 13.3714 5.40227 13.6982C4.95945 14.0283 4.86879 14.6558 5.19884 15.0986C5.19884 15.0986 5.43609 15.3705 5.53528 15.4636C5.73371 15.6498 6.02272 15.8837 6.41344 16.1127C7.02974 16.474 7.88157 16.8126 8.99988 16.9433V18C8.99988 18.5523 9.44759 19 9.99988 19C10.5522 19 10.9999 18.5523 10.9999 18V16.9411C12.1388 16.8009 13.0588 16.4132 13.7409 15.8135C14.6201 15.0405 14.9999 14.0047 14.9999 13C14.9999 12.0588 14.7218 11.007 13.8511 10.2029C13.1686 9.57251 12.2186 9.18454 10.9999 9.05167V5.10673C11.5005 5.22046 11.8712 5.40776 12.1327 5.58205C12.3429 5.72223 12.5402 5.88371 12.6684 6.05562C13 6.5 13.5992 6.63563 14.0546 6.33205C14.5141 6.0257 14.6383 5.40483 14.3319 4.9453C14.2809 4.86873 14.1203 4.67298 14.0316 4.579C13.8543 4.39127 13.5943 4.15277 13.2421 3.91795C12.7031 3.55861 11.9621 3.21778 10.9999 3.07298V2ZM8.99988 5.10182C7.58473 5.41216 6.99988 6.36373 6.99988 7C6.99988 7.63627 7.58473 8.58784 8.99988 8.89818V5.10182ZM10.9999 11.0673V14.9203C11.6836 14.8011 12.1339 14.5634 12.4203 14.3115C12.8207 13.9595 12.9999 13.4953 12.9999 13C12.9999 12.4412 12.8416 11.993 12.4942 11.6721C12.2319 11.4299 11.7783 11.1828 10.9999 11.0673Z"
                                  fill="#9CA3AF"
                                />
                              </svg>
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
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M10.9999 2C10.9999 1.44772 10.5522 1 9.99988 1C9.44759 1 8.99988 1.44772 8.99988 2V3.07498C6.65825 3.43371 4.99988 5.03858 4.99988 7C4.99988 8.96142 6.65825 10.5663 8.99988 10.925V14.9249C8.28519 14.8122 7.77152 14.5905 7.42483 14.3873C7.17579 14.2413 6.79177 13.8893 6.79177 13.8893C6.45923 13.4578 5.8407 13.3714 5.40227 13.6982C4.95945 14.0283 4.86879 14.6558 5.19884 15.0986C5.19884 15.0986 5.43609 15.3705 5.53528 15.4636C5.73371 15.6498 6.02272 15.8837 6.41344 16.1127C7.02974 16.474 7.88157 16.8126 8.99988 16.9433V18C8.99988 18.5523 9.44759 19 9.99988 19C10.5522 19 10.9999 18.5523 10.9999 18V16.9411C12.1388 16.8009 13.0588 16.4132 13.7409 15.8135C14.6201 15.0405 14.9999 14.0047 14.9999 13C14.9999 12.0588 14.7218 11.007 13.8511 10.2029C13.1686 9.57251 12.2186 9.18454 10.9999 9.05167V5.10673C11.5005 5.22046 11.8712 5.40776 12.1327 5.58205C12.3429 5.72223 12.5402 5.88371 12.6684 6.05562C13 6.5 13.5992 6.63563 14.0546 6.33205C14.5141 6.0257 14.6383 5.40483 14.3319 4.9453C14.2809 4.86873 14.1203 4.67298 14.0316 4.579C13.8543 4.39127 13.5943 4.15277 13.2421 3.91795C12.7031 3.55861 11.9621 3.21778 10.9999 3.07298V2ZM8.99988 5.10182C7.58473 5.41216 6.99988 6.36373 6.99988 7C6.99988 7.63627 7.58473 8.58784 8.99988 8.89818V5.10182ZM10.9999 11.0673V14.9203C11.6836 14.8011 12.1339 14.5634 12.4203 14.3115C12.8207 13.9595 12.9999 13.4953 12.9999 13C12.9999 12.4412 12.8416 11.993 12.4942 11.6721C12.2319 11.4299 11.7783 11.1828 10.9999 11.0673Z"
                                fill="#9CA3AF"
                              />
                            </svg>
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

                  <div className="rounded-md bg-gray-50 p-3 mt-2.5 text-xs leading-4 text-gray-500 flex w-full items-center gap-3">
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
          <div className="grid grid-cols-2 min-h-[358px]">
            <div className="p-6 border-r border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    placeholder="e.g. john.smith@abcompany.com"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                  />
                </div>
                <div className="border-t border-gray-200" />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      placeholder="e.g. John"
                      value={inviteFirstName}
                      onChange={(event) =>
                        setInviteFirstName(event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      placeholder="e.g. Smith"
                      value={inviteLastName}
                      onChange={(event) =>
                        setInviteLastName(event.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Add a Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Hi, please help me with setting up the company profile for SMART Hub."
                    value={inviteMessage}
                    onChange={(event) => setInviteMessage(event.target.value)}
                    className="w-full shadow-sm border border-gray-300 rounded-md px-3 py-2 text-base leading-6 text-gray-900 placeholder-gray-400 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main resize-none transition duration-300"
                  />
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
                    <Select.Trigger
                      className={clsx(
                        'w-full h-10 shadow-sm border border-gray-300 rounded-md px-3 text-left flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main'
                      )}
                    >
                      <span
                        className={
                          selectedRole ? 'text-gray-900' : 'text-gray-400'
                        }
                      >
                        {selectedRole ? selectedRole.name : 'Select role'}
                      </span>
                      <Icon icon="selector" className="w-5 h-5 text-gray-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner sideOffset={0} className="z-50">
                        <Select.Popup className="rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
                          <RoleDropdownContent
                            onSelectRole={handleSelectRole}
                            selectedRoleId={selectedRoleId}
                            showCheckIcon
                          />
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                  {selectedRole && (
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
                        onClick={() => {
                          setView('permissions');
                        }}
                      >
                        View all role permissions
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {selectedRole && (
                <div className="flex flex-col">
                  <span className="bg-gray-200 w-full h-px my-6"></span>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-6 font-medium text-gray-900">
                        User Approval Limits
                      </span>
                      <Tooltip trigger="hover" placement="top">
                        <TooltipTrigger
                          as="span"
                          className="inline-flex cursor-help"
                        >
                          <Icon
                            icon="information-circle"
                            className="w-4.5 h-4.5 text-gray-400"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg px-3 py-2 text-sm leading-5 bg-gray-900 text-white shadow-lg max-w-[280px]">
                          Set both AP and AR limits for Full Access, View Only,
                          and Technical roles.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {showAccountsPayableLimits && (
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex flex-col space-y-1">
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
                          {limitsRequiredError &&
                            isAccountsPayableRequired &&
                            !limitsSummaryByType.ap && (
                              <div className="text-xs leading-4 text-red-500">
                                Accounts Payable limits are required.
                              </div>
                            )}
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
                              setLimitsRequiredError(false);
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
                        <div className="flex flex-col space-y-1">
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
                          {limitsRequiredError &&
                            isAccountsReceivableRequired &&
                            !limitsSummaryByType.ar && (
                              <div className="text-xs leading-4 text-red-500">
                                Accounts Receivable limits are required.
                              </div>
                            )}
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
                              setLimitsRequiredError(false);
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
              )}
            </div>
          </div>
        )}
      </WrapModal>
    </LayoutModal>
  );
};

export default AddNewUserModal;

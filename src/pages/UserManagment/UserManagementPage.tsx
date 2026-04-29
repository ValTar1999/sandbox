import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import clsx from 'clsx';
import Box from '../../components/layout/Box';
import Input from '../../components/common/base/Input';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import Icon from '../../components/common/base/Icon';
import Menu from '../../components/common/base/Menu';
import LayoutModal from '../../components/common/modal/LayoutModal';
import WrapModal from '../../components/common/modal/WrapModal';
import Select from '../../components/common/base/Select';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../components/common/base/Tooltip';
import RowsPerPageSelect from '../../components/common/base/RowsPerPageSelect';
import { Avatar } from '../../components/common/base/Avatar';
import AddNewUserModal from '../../modals/AddNewUserModal';
import EditUserModal from '../../modals/EditUserModal';
import RemoveUserModal from '../../modals/RemoveUserModal';
import {
  advancedLimitMethods,
  advancedPeriodOptions,
  type AdvancedMethodFieldErrors,
  type LimitsSummary,
  formatAmountValue,
  permissionSections as createRolePermissionSections,
  roleOptions,
  timeframeOptions,
} from '../../modals/userModalSharedData';
import {
  usersData,
  rolesData,
  statusConfig,
  type UserRow,
  type RoleRow,
} from './data';
import CreateRoleView, { type CreateRolePayload } from './CreateRoleView';
import {
  createAdvancedLimitsSummary,
  createEmptyAdvancedMethodErrors,
  createEmptyAdvancedMethodMap,
  getAdvancedLimitsErrors,
  hasAdvancedLimitsErrors,
  parseGlobalLimitsSummary,
  validateGlobalLimits,
} from './limitsUtils';

type TabType = 'users' | 'roles';
type RolesViewMode = 'list' | 'create' | 'view';
type LimitsTargetType = 'ap' | 'ar';
const ROLE_DESCRIPTION_MAX_LENGTH = 120;

const truncateRoleDescription = (value: string) => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length <= ROLE_DESCRIPTION_MAX_LENGTH) return normalized;
  return `${normalized.slice(0, ROLE_DESCRIPTION_MAX_LENGTH).trimEnd()}...`;
};

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [rolesViewMode, setRolesViewMode] = useState<RolesViewMode>('list');
  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState<UserRow[]>(usersData);
  const [roles, setRoles] = useState<RoleRow[]>(rolesData);
  const [userLimitsById, setUserLimitsById] = useState<
    Record<string, { ap?: LimitsSummary; ar?: LimitsSummary }>
  >({});
  const [rolePayloadById, setRolePayloadById] = useState<
    Record<string, CreateRolePayload>
  >({});
  const [roleToView, setRoleToView] = useState<RoleRow | null>(null);
  const [createRoleInitialData, setCreateRoleInitialData] =
    useState<CreateRolePayload>();
  const [limitsRoleTarget, setLimitsRoleTarget] = useState<RoleRow | null>(
    null
  );
  const [limitsTargetType, setLimitsTargetType] =
    useState<LimitsTargetType>('ap');
  const [isRoleLimitsModalOpen, setIsRoleLimitsModalOpen] = useState(false);
  const [roleLimitsMode, setRoleLimitsMode] = useState<'global' | 'advanced'>(
    'global'
  );
  const [roleLimitsTimeframeId, setRoleLimitsTimeframeId] = useState('weekly');
  const [roleLimitsTimeframeLimit, setRoleLimitsTimeframeLimit] = useState('');
  const [roleLimitsPerInvoiceLimit, setRoleLimitsPerInvoiceLimit] =
    useState('');
  const [roleLimitsTimeframeError, setRoleLimitsTimeframeError] =
    useState(false);
  const [roleLimitsSelectError, setRoleLimitsSelectError] = useState(false);
  const [roleLimitsPerInvoiceError, setRoleLimitsPerInvoiceError] =
    useState(false);
  const [roleAdvancedMethodPeriods, setRoleAdvancedMethodPeriods] = useState<
    Record<string, string>
  >(createEmptyAdvancedMethodMap);
  const [
    roleAdvancedMethodTimeframeLimits,
    setRoleAdvancedMethodTimeframeLimits,
  ] = useState<Record<string, string>>(createEmptyAdvancedMethodMap);
  const [roleAdvancedMethodPerBillLimits, setRoleAdvancedMethodPerBillLimits] =
    useState<Record<string, string>>(createEmptyAdvancedMethodMap);
  const [roleAdvancedMethodErrors, setRoleAdvancedMethodErrors] = useState<
    Record<string, AdvancedMethodFieldErrors>
  >(createEmptyAdvancedMethodErrors);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);

  const normalizedSearchQuery = useMemo(
    () => searchValue.trim().toLowerCase(),
    [searchValue]
  );

  const filteredUsers = useMemo(() => {
    if (!normalizedSearchQuery) return users;

    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(normalizedSearchQuery)
    );
  }, [normalizedSearchQuery, users]);

  const filteredRoles = useMemo(() => {
    if (!normalizedSearchQuery) return roles;

    return roles.filter((role) =>
      `${role.roleName} ${role.application} ${role.description}`
        .toLowerCase()
        .includes(normalizedSearchQuery)
    );
  }, [normalizedSearchQuery, roles]);

  const currentRows = useMemo(
    () => (activeTab === 'users' ? filteredUsers : filteredRoles),
    [activeTab, filteredUsers, filteredRoles]
  );
  const totalRows = currentRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const paginatedRows = useMemo(
    () => currentRows.slice(startIndex, startIndex + rowsPerPage),
    [currentRows, rowsPerPage, startIndex]
  );
  const startResult = totalRows === 0 ? 0 : startIndex + 1;
  const endResult = Math.min(startIndex + rowsPerPage, totalRows);
  const existingRoleNames = useMemo(
    () => roles.map((role) => role.roleName),
    [roles]
  );

  const handleTabClick = useCallback((tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'roles') {
      setRolesViewMode('list');
    }
    setSearchValue('');
    setCurrentPage(1);
  }, []);

  const handleRowsChange = useCallback((value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleAddUser = useCallback(() => {
    setIsAddUserModalOpen(true);
  }, []);

  const handleGoToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleGoToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleGoToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleGoToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const handleDeleteClick = useCallback((user: UserRow) => {
    setUserToDelete(user);
  }, []);

  const handleEditClick = useCallback((user: UserRow) => {
    setUserToEdit(user);
  }, []);

  const getRolePayload = useCallback(
    (role: RoleRow): CreateRolePayload => {
      const existing = rolePayloadById[role.id];
      if (existing) return existing;

      const matchingRoleOption = roleOptions.find(
        (option) => option.name === role.roleName
      );
      const fullPermissionsBySection = Object.fromEntries(
        createRolePermissionSections.map((section) => [
          section.id,
          section.permissions,
        ])
      ) as Record<string, string[]>;

      return {
        presetId: matchingRoleOption?.id,
        roleName: role.roleName,
        description:
          matchingRoleOption?.description ??
          role.description.replace(/\.\.\.$/, '.'),
        application: role.application,
        permissionsBySection: fullPermissionsBySection,
        limitsSummaryByType: {},
      };
    },
    [rolePayloadById]
  );

  const selectedRolePayload = useMemo(() => {
    if (!roleToView) return undefined;
    return getRolePayload(roleToView);
  }, [getRolePayload, roleToView]);

  const selectedRoleLimitsTimeframe = useMemo(
    () =>
      timeframeOptions.find((option) => option.id === roleLimitsTimeframeId) ??
      null,
    [roleLimitsTimeframeId]
  );

  const openRoleLimitsModal = useCallback(
    (role: RoleRow, type: LimitsTargetType) => {
      const payload = getRolePayload(role);
      const existingSummary = payload.limitsSummaryByType[type]?.summary ?? '';
      const { timeframeLabel, timeframeLimit, perInvoiceLimit } =
        parseGlobalLimitsSummary(existingSummary);
      const timeframeId =
        timeframeOptions.find((option) => option.label === timeframeLabel)
          ?.id ?? 'weekly';

      setLimitsRoleTarget(role);
      setLimitsTargetType(type);
      setRoleLimitsMode(payload.limitsSummaryByType[type]?.mode ?? 'global');
      setRoleLimitsTimeframeId(timeframeId);
      setRoleLimitsTimeframeLimit(timeframeLimit);
      setRoleLimitsPerInvoiceLimit(perInvoiceLimit);
      setRoleAdvancedMethodPeriods(createEmptyAdvancedMethodMap());
      setRoleAdvancedMethodTimeframeLimits(createEmptyAdvancedMethodMap());
      setRoleAdvancedMethodPerBillLimits(createEmptyAdvancedMethodMap());
      setRoleAdvancedMethodErrors(createEmptyAdvancedMethodErrors());
      setRoleLimitsTimeframeError(false);
      setRoleLimitsSelectError(false);
      setRoleLimitsPerInvoiceError(false);
      setIsRoleLimitsModalOpen(true);
    },
    [getRolePayload]
  );

  const handleApplyRoleLimits = useCallback(() => {
    if (!limitsRoleTarget) return;

    if (roleLimitsMode === 'advanced') {
      const nextErrors = getAdvancedLimitsErrors({
        periodsByMethod: roleAdvancedMethodPeriods,
        timeframeLimitsByMethod: roleAdvancedMethodTimeframeLimits,
        perBillLimitsByMethod: roleAdvancedMethodPerBillLimits,
      });

      setRoleAdvancedMethodErrors(nextErrors);
      const hasAdvancedErrors = hasAdvancedLimitsErrors(nextErrors);
      if (hasAdvancedErrors) return;

      const summary = createAdvancedLimitsSummary({
        periodsByMethod: roleAdvancedMethodPeriods,
        timeframeLimitsByMethod: roleAdvancedMethodTimeframeLimits,
        perBillLimitsByMethod: roleAdvancedMethodPerBillLimits,
      });

      const basePayload = getRolePayload(limitsRoleTarget);
      const nextPayload: CreateRolePayload = {
        ...basePayload,
        limitsSummaryByType: {
          ...basePayload.limitsSummaryByType,
          [limitsTargetType]: {
            mode: 'advanced',
            summary,
          },
        },
      };

      setRolePayloadById((prev) => ({
        ...prev,
        [limitsRoleTarget.id]: nextPayload,
      }));
      setIsRoleLimitsModalOpen(false);
      return;
    }

    const { hasTimeframeLimit, hasTimeframeSelection, hasPerInvoiceLimit } =
      validateGlobalLimits({
        timeframeLimitValue: roleLimitsTimeframeLimit,
        timeframeId: roleLimitsTimeframeId,
        perInvoiceLimitValue: roleLimitsPerInvoiceLimit,
      });

    setRoleLimitsTimeframeError(!hasTimeframeLimit);
    setRoleLimitsSelectError(!hasTimeframeSelection);
    setRoleLimitsPerInvoiceError(!hasPerInvoiceLimit);

    if (!hasTimeframeLimit || !hasTimeframeSelection || !hasPerInvoiceLimit) {
      return;
    }

    const timeframeLabel =
      selectedRoleLimitsTimeframe?.label ??
      timeframeOptions[0]?.label ??
      'Weekly';

    const basePayload = getRolePayload(limitsRoleTarget);
    const nextPayload: CreateRolePayload = {
      ...basePayload,
      limitsSummaryByType: {
        ...basePayload.limitsSummaryByType,
        [limitsTargetType]: {
          mode: 'global',
          summary: `${timeframeLabel}: $${roleLimitsTimeframeLimit}. Bill/Invoice: $${roleLimitsPerInvoiceLimit}.`,
        },
      },
    };

    setRolePayloadById((prev) => ({
      ...prev,
      [limitsRoleTarget.id]: nextPayload,
    }));
    setIsRoleLimitsModalOpen(false);
  }, [
    getRolePayload,
    limitsRoleTarget,
    limitsTargetType,
    roleAdvancedMethodPerBillLimits,
    roleAdvancedMethodPeriods,
    roleAdvancedMethodTimeframeLimits,
    roleLimitsMode,
    roleLimitsPerInvoiceLimit,
    roleLimitsTimeframeId,
    roleLimitsTimeframeLimit,
    selectedRoleLimitsTimeframe,
  ]);

  const isRoleDetailsView = activeTab === 'roles' && rolesViewMode === 'view';
  const isCreateRoleView = activeTab === 'roles' && rolesViewMode === 'create';
  const isRoleFormVisible = isCreateRoleView || isRoleDetailsView;

  return (
    <div className="max-w-9xl mx-auto space-y-6">
      <div className="w-full rounded-[10px] shadow-sm bg-white p-4 flex items-center gap-6">
        <button
          type="button"
          onClick={() => handleTabClick('users')}
          className={clsx(
            'inline-flex items-center gap-3 bg rounded-md px-3 py-2 text-base font-medium transition-colors duration-300 cursor-pointer',
            activeTab === 'users'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 bg-white'
          )}
        >
          <Icon
            icon="users"
            variant="outline"
            className={clsx(
              'w-6 h-6',
              activeTab === 'users' ? 'text-blue-600' : 'text-gray-400'
            )}
          />
          <span>Users</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('roles')}
          className={clsx(
            'inline-flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-300 cursor-pointer',
            activeTab === 'roles'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 bg-white'
          )}
        >
          <Icon
            icon="adjustments-horizontal"
            variant="outline"
            className={clsx(
              'w-6 h-6',
              activeTab === 'roles' ? 'text-blue-600' : 'text-gray-400'
            )}
          />
          <span>Roles</span>
        </button>
      </div>

      {isRoleFormVisible ? (
        <CreateRoleView
          onCancel={() => setRolesViewMode('list')}
          existingRoleNames={existingRoleNames}
          mode={isRoleDetailsView ? 'view' : 'create'}
          initialData={
            isRoleDetailsView ? selectedRolePayload : createRoleInitialData
          }
          onCreateRole={(payload) => {
            const { roleName, description, application } = payload;
            const newRoleId = `r-${Date.now()}`;
            setRoles((prev) => [
              {
                id: newRoleId,
                roleName,
                description: truncateRoleDescription(description),
                application,
              },
              ...prev,
            ]);
            setRolePayloadById((prev) => ({
              ...prev,
              [newRoleId]: payload,
            }));
            setCreateRoleInitialData(undefined);
            setSearchValue('');
            setCurrentPage(1);
          }}
        />
      ) : (
        <Box
          className="max-w-9xl mx-auto"
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <span className="text-lg leading-6 text-gray-900 font-medium">
                  {activeTab === 'users' ? 'Users' : 'Roles'}
                </span>
                <div className="text-sm text-gray-500 flex items-center gap-0.5">
                  <span>{totalRows}</span>
                  <span>{activeTab === 'users' ? 'Users' : 'Roles'}</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-end gap-3">
                <Input
                  placeholder="Search"
                  type="text"
                  className="w-80"
                  icon="search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                {activeTab === 'users' ? (
                  <Button
                    size="lg"
                    variant="primary"
                    icon="user-add"
                    iconDirection="left"
                    onClick={handleAddUser}
                  >
                    Add New User
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="primary"
                    icon="user-add"
                    iconDirection="left"
                    onClick={() => {
                      setCreateRoleInitialData(undefined);
                      setRolesViewMode('create');
                    }}
                  >
                    Create Role
                  </Button>
                )}
              </div>
            </div>
          }
          footer={
            <div className="w-full flex items-center justify-end gap-3 text-sm text-gray-700">
              <RowsPerPageSelect
                value={rowsPerPage}
                onChange={handleRowsChange}
                options={[10, 25, 50]}
              />
              <div>
                Showing{' '}
                <b className="font-semibold">
                  {startResult} - {endResult}
                </b>{' '}
                of <b className="font-semibold">{totalRows}</b> results
              </div>
              <div className="grid grid-flow-col gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  icon="chevron-double-left"
                  onClick={handleGoToFirstPage}
                  disabled={safeCurrentPage === 1}
                  aria-label="Go to first page"
                />
                <Button
                  variant="secondary"
                  size="md"
                  icon="chevron-left"
                  onClick={handleGoToPreviousPage}
                  disabled={safeCurrentPage === 1}
                  aria-label="Go to previous page"
                />
                <Button
                  variant="secondary"
                  size="md"
                  icon="chevron-right"
                  onClick={handleGoToNextPage}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Go to next page"
                />
                <Button
                  variant="secondary"
                  size="md"
                  icon="chevron-double-right"
                  onClick={handleGoToLastPage}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Go to last page"
                />
              </div>
            </div>
          }
        >
          {activeTab === 'users' ? (
            <UsersTable
              users={paginatedRows as UserRow[]}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onInviteClick={handleAddUser}
            />
          ) : (
            <RolesTable
              roles={paginatedRows as RoleRow[]}
              onViewClick={(role) => {
                setRoleToView(role);
                setRolesViewMode('view');
              }}
              onDuplicateClick={(role) => {
                setCreateRoleInitialData(getRolePayload(role));
                setRolesViewMode('create');
              }}
              onSetLimitsClick={(role, type) => openRoleLimitsModal(role, type)}
            />
          )}
        </Box>
      )}
      <AddNewUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onInviteUser={({ name, email, role, limitsSummaryByType }) => {
          const newUserId = `u-${Date.now()}`;
          setUsers((prev) => [
            {
              id: newUserId,
              name,
              email,
              role,
              status: 'invitationSent',
            },
            ...prev,
          ]);
          setUserLimitsById((prev) => ({
            ...prev,
            [newUserId]: limitsSummaryByType,
          }));
          setSearchValue('');
          setCurrentPage(1);
        }}
      />
      <EditUserModal
        open={Boolean(userToEdit)}
        user={userToEdit}
        initialLimits={userToEdit ? userLimitsById[userToEdit.id] : undefined}
        onClose={() => setUserToEdit(null)}
        onSaveUser={(userId, payload) => {
          setUsers((prev) =>
            prev.map((row) =>
              row.id === userId
                ? {
                    ...row,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    avatarUrl: payload.avatarUrl,
                  }
                : row
            )
          );
          setUserToEdit((prev) =>
            prev && prev.id === userId
              ? {
                  ...prev,
                  name: payload.name,
                  email: payload.email,
                  role: payload.role,
                  avatarUrl: payload.avatarUrl,
                }
              : prev
          );
        }}
        onSaveLimits={(userId, limits) => {
          setUserLimitsById((prev) => ({ ...prev, [userId]: limits }));
        }}
        onRemoveUser={(user) => {
          setUsers((prev) => prev.filter((row) => row.id !== user.id));
          setUserLimitsById((prev) => {
            const next = { ...prev };
            delete next[user.id];
            return next;
          });
          setUserToEdit(null);
        }}
      />
      <RemoveUserModal
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (!userToDelete) return;
          const deletedUserId = userToDelete.id;
          setUsers((prev) => prev.filter((user) => user.id !== deletedUserId));
          setUserLimitsById((prev) => {
            const next = { ...prev };
            delete next[deletedUserId];
            return next;
          });
          setUserToDelete(null);
        }}
      />
      {isRoleLimitsModalOpen && (
        <LayoutModal>
          <WrapModal
            className="w-full max-w-[980px]"
            onClose={() => setIsRoleLimitsModalOpen(false)}
            noHeader
            footer={
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsRoleLimitsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApplyRoleLimits}>
                  Add
                </Button>
              </div>
            }
          >
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2.5">
              <span className="text-ldg leading-6 font-medium text-gray-900">
                {limitsTargetType === 'ap'
                  ? 'User Approval Limits for Accounts Payable'
                  : 'User Approval Limits for Accounts Receivable'}
              </span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="flex items-center gap-6 justify-between pb-6 w-full border-b border-gray-200">
                <span className="text-lg leading-6 font-medium text-gray-900">
                  {roleLimitsMode === 'global'
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
                    setRoleLimitsMode((prev) =>
                      prev === 'global' ? 'advanced' : 'global'
                    )
                  }
                >
                  {roleLimitsMode === 'global'
                    ? 'Switch to Advanced Limits'
                    : 'Switch to Global Limits'}
                </Button>
              </div>
              {roleLimitsMode === 'global' ? (
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
                              roleLimitsTimeframeError && 'text-red-500'
                            )}
                          >
                            $
                          </span>
                          <Input
                            value={roleLimitsTimeframeLimit}
                            onChange={(event) => {
                              setRoleLimitsTimeframeLimit(
                                formatAmountValue(event.target.value)
                              );
                              setRoleLimitsTimeframeError(false);
                            }}
                            placeholder="0.00"
                            className="w-full"
                            inputClass="pl-7"
                            error={roleLimitsTimeframeError}
                          />
                        </div>
                        <Select.Root placement="bottom-start">
                          <Select.Trigger
                            className={clsx(
                              'w-44 h-10 shadow-sm border rounded-md px-3 text-sm text-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
                              roleLimitsSelectError
                                ? 'border-red-500 ring-1 ring-red-500'
                                : 'border-gray-300'
                            )}
                          >
                            <span
                              className={
                                selectedRoleLimitsTimeframe
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                              }
                            >
                              {selectedRoleLimitsTimeframe?.label ??
                                'Select period'}
                            </span>
                            <Icon
                              icon="selector"
                              className="w-4 h-4 text-gray-400"
                            />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Positioner sideOffset={2} className="z-50">
                              <Select.Popup className="min-w-44 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
                                {timeframeOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                      setRoleLimitsTimeframeId(option.id);
                                      setRoleLimitsSelectError(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm leading-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                  >
                                    {option.label}
                                  </button>
                                ))}
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
                            roleLimitsPerInvoiceError && 'text-red-500'
                          )}
                        >
                          $
                        </span>
                        <Input
                          value={roleLimitsPerInvoiceLimit}
                          onChange={(event) => {
                            setRoleLimitsPerInvoiceLimit(
                              formatAmountValue(event.target.value)
                            );
                            setRoleLimitsPerInvoiceError(false);
                          }}
                          className="w-full"
                          inputClass="pl-7"
                          error={roleLimitsPerInvoiceError}
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
                <div className="mt-6">
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
                              value={roleAdvancedMethodTimeframeLimits[method]}
                              className="w-full"
                              onChange={(event) => {
                                setRoleAdvancedMethodTimeframeLimits(
                                  (prev) => ({
                                    ...prev,
                                    [method]: formatAmountValue(
                                      event.target.value
                                    ),
                                  })
                                );
                                setRoleAdvancedMethodErrors((prev) => ({
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
                                roleAdvancedMethodErrors[method]?.timeframeLimit
                              }
                            />
                          </div>
                          <Select.Root placement="bottom-start">
                            <Select.Trigger
                              className={clsx(
                                'w-[147px] shadow-sm h-8 border rounded-md px-2 text-sm text-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
                                roleAdvancedMethodErrors[method]
                                  ?.timeframePeriod
                                  ? 'border-red-500 ring-1 ring-red-500'
                                  : 'border-gray-300'
                              )}
                            >
                              <span
                                className={
                                  roleAdvancedMethodPeriods[method]
                                    ? 'text-gray-700'
                                    : 'text-gray-400'
                                }
                              >
                                {advancedPeriodOptions.find(
                                  (option) =>
                                    option.id ===
                                    roleAdvancedMethodPeriods[method]
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
                                  {advancedPeriodOptions.map((option) => (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() => {
                                        setRoleAdvancedMethodPeriods(
                                          (prev) => ({
                                            ...prev,
                                            [method]: option.id,
                                          })
                                        );
                                        setRoleAdvancedMethodErrors((prev) => ({
                                          ...prev,
                                          [method]: {
                                            ...prev[method],
                                            timeframePeriod: false,
                                          },
                                        }));
                                      }}
                                      className="w-full px-4 py-3 text-left text-sm leading-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
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
                            value={roleAdvancedMethodPerBillLimits[method]}
                            className="w-full"
                            onChange={(event) => {
                              setRoleAdvancedMethodPerBillLimits((prev) => ({
                                ...prev,
                                [method]: formatAmountValue(event.target.value),
                              }));
                              setRoleAdvancedMethodErrors((prev) => ({
                                ...prev,
                                [method]: {
                                  ...prev[method],
                                  perBillInvoice: false,
                                },
                              }));
                            }}
                            inputClass="pl-8"
                            size="sm"
                            error={
                              roleAdvancedMethodErrors[method]?.perBillInvoice
                            }
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

const UsersTable = memo(
  ({
    users,
    onDeleteClick,
    onEditClick,
    onInviteClick,
  }: {
    users: UserRow[];
    onDeleteClick: (user: UserRow) => void;
    onEditClick: (user: UserRow) => void;
    onInviteClick: () => void;
  }) => (
    <div className="overflow-x-auto w-full px-6">
      <table className="table-fixed w-full min-w-full">
        <colgroup>
          <col className="w-[calc((100%-102px-9rem)/2)]" />
          <col className="w-[calc((100%-102px-9rem)/2)]" />
          <col className="w-36" />
          <col className="w-[102px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className="py-4 text-left">
              <button type="button" className="inline-flex items-center gap-1">
                <span className="uppercase text-xs text-gray-500 font-medium">
                  Member
                </span>
                <Icon icon="selector" className="w-4 h-4 text-gray-400" />
              </button>
            </th>
            <th className="p-4 text-left">
              <button type="button" className="inline-flex items-center gap-1">
                <span className="uppercase text-xs text-gray-500 font-medium">
                  Role
                </span>
                <Icon icon="selector" className="w-4 h-4 text-gray-400" />
              </button>
            </th>
            <th className="w-36 max-w-36 p-4 text-left">
              <span className="uppercase text-xs text-gray-500 font-medium">
                Status
              </span>
            </th>
            <th className="w-[102px] max-w-[102px] p-4" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const status = statusConfig[user.status];
            const isOwner = user.roleHint === '(Owner)';
            const isRequiresAction = user.status === 'requiresAction';
            const showEdit = isOwner || !isRequiresAction;
            const showDelete = isRequiresAction || !isOwner;

            return (
              <tr
                key={user.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      size="md"
                      fullName={user.name === '-' ? undefined : user.name}
                      imageSrc={user.avatarUrl}
                    />
                    <div>
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {user.name}{' '}
                        {user.isCurrentUser && (
                          <span className="text-gray-500 text-xs leading-4 font-normal">
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="text-sm leading-5 text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-900 leading-5 font-medium flex items-center gap-1">
                    {user.role === 'Send Invitation' ? (
                      <Button
                        variant="linkPrimary"
                        size="sm"
                        icon="arrow-right"
                        iconDirection="right"
                        className="-ml-2"
                        onClick={onInviteClick}
                      >
                        {user.role}
                      </Button>
                    ) : (
                      <>
                        {user.role}{' '}
                        {user.roleHint && (
                          <span className="text-gray-500 text-xs leading-4 font-normal">
                            {user.roleHint}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="w-36 max-w-36 p-4 align-middle">
                  <div className="flex items-center justify-start">
                    <Badge
                      color={status.color}
                      size="sm"
                      rounded
                      icon={status.icon}
                      iconDirection="left"
                    >
                      {status.label}
                    </Badge>
                  </div>
                </td>
                <td className="w-[102px] max-w-[102px] p-4 align-middle text-right">
                  <div className="inline-flex items-center border border-gray-300 rounded-md">
                    {showEdit && (
                      <Tooltip trigger="hover" placement="top-end">
                        <TooltipTrigger
                          as="span"
                          className="inline-flex cursor-default"
                        >
                          <Button
                            icon="pencil"
                            variant="linkSecondary"
                            size="sm"
                            iconClass="text-gray-500 w-4.5 h-4.5"
                            aria-label="Edit profile"
                            onClick={() => onEditClick(user)}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg px-2.5 py-1 text-sm leading-5 bg-gray-900 text-white shadow-lg">
                          Edit Profile
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {showEdit && showDelete && (
                      <div className="bg-gray-300 w-px h-7" aria-hidden />
                    )}
                    {showDelete && (
                      <Tooltip trigger="hover" placement="top-end">
                        <TooltipTrigger
                          as="span"
                          className="inline-flex cursor-default"
                        >
                          <Button
                            icon="trash"
                            variant="linkSecondary"
                            size="sm"
                            iconClass="text-gray-500 w-4.5 h-4.5"
                            aria-label="Delete user"
                            onClick={() => onDeleteClick(user)}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg px-2.5 py-1 text-sm leading-5 bg-gray-900 text-white shadow-lg">
                          Delete User
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
);

const RolesTable = memo(
  ({
    roles,
    onViewClick,
    onDuplicateClick,
    onSetLimitsClick,
  }: {
    roles: RoleRow[];
    onViewClick: (role: RoleRow) => void;
    onDuplicateClick: (role: RoleRow) => void;
    onSetLimitsClick: (role: RoleRow, type: LimitsTargetType) => void;
  }) => (
    <div className="overflow-x-auto w-full px-6">
      <table className="table-fixed w-full min-w-full">
        <colgroup>
          <col className="w-[calc((100%-102px)/3)]" />
          <col className="w-[calc((100%-102px)/3)]" />
          <col className="w-[calc((100%-102px)/3)]" />
          <col className="w-[102px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className="py-4 text-left">
              <button type="button" className="inline-flex items-center gap-1">
                <span className="text-xs font-medium uppercase leading-4 text-gray-500">
                  Role Name
                </span>
                <Icon icon="selector" className="w-5 h-5 text-gray-400" />
              </button>
            </th>
            <th className="p-4 text-left">
              <span className="text-xs font-medium uppercase leading-4 text-gray-500">
                Application
              </span>
            </th>
            <th className="p-4 text-left">
              <span className="text-xs font-medium uppercase leading-4 text-gray-500">
                Description
              </span>
            </th>
            <th className="w-[102px] max-w-[102px] p-4" />
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="py-4 text-sm leading-5 font-medium text-gray-900">
                {role.roleName}
              </td>
              <td className="p-4 text-sm leading-5 text-gray-500">
                {role.application}
              </td>
              <td className="p-4 text-sm leading-5 text-gray-900 line-clamp-2 text-ellipsis overflow-hidden">
                {role.description}
              </td>
              <td className="w-[102px] max-w-[102px] py-4">
                <div className="flex justify-end">
                  <Menu.Root placement="bottom-end">
                    <Menu.Trigger asChild>
                      <Button
                        variant="secondary"
                        size="md"
                        icon="dots-vertical"
                        iconVariant="outline"
                        iconClass="w-4.5 h-4.5 text-gray-500"
                        aria-label="Role actions"
                      />
                    </Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner>
                        <Menu.Popup className="min-w-60 rounded-md overflow-hidden bg-white shadow-lg z-50 divide-y divide-gray-200 border border-gray-200">
                          <Menu.Item
                            className="px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                            onClick={() => onViewClick(role)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            className="px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                            onClick={() => onDuplicateClick(role)}
                          >
                            Duplicate
                          </Menu.Item>
                          <Menu.Item
                            className="px-4 py-3 text-sm leading-5 font-medium text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                            onClick={() => onSetLimitsClick(role, 'ap')}
                          >
                            Set Approval Limits for AP
                          </Menu.Item>
                          <Menu.Item
                            className="px-4 py-3 text-sm leading-5 font-medium  text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                            onClick={() => onSetLimitsClick(role, 'ar')}
                          >
                            Set Approval Limits for AR
                          </Menu.Item>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
);

export default UserManagementPage;

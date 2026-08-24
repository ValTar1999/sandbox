export type RoleOption = {
  id: string;
  name: string;
  application: string;
  description?: string;
};

export type PermissionSection = {
  id: string;
  title: string;
  app: string;
  permissions: string[];
};

export type LimitsMode = 'global' | 'advanced';

export type GlobalLimitsValues = {
  timeframeId: string;
  timeframeLimit: string;
  perInvoiceLimit: string;
};

export type AdvancedLimitsValues = {
  periodsByMethod: Record<string, string>;
  timeframeLimitsByMethod: Record<string, string>;
  perBillLimitsByMethod: Record<string, string>;
};

/**
 * `summary` is the human readable line shown in the UI. It is lossy for the
 * advanced mode (only the first method survives), so the raw values are kept
 * alongside it to make the edit round-trip non-destructive.
 */
export type LimitsSummary = {
  mode: LimitsMode;
  summary: string;
  global?: GlobalLimitsValues;
  advanced?: AdvancedLimitsValues;
};

export type AdvancedMethodFieldErrors = {
  timeframeLimit: boolean;
  timeframePeriod: boolean;
  perBillInvoice: boolean;
};

export type TimeframeOption = {
  id: string;
  label: string;
};

export const roleOptions: RoleOption[] = [
  {
    id: 'full-access',
    name: 'Full Access',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business Owner can manage users and create Business-specific roles',
  },
  {
    id: 'view-only',
    name: 'View Only',
    application: 'SMART Hub & DevPortal',
  },
  { id: 'ap-only', name: 'AP Only', application: 'SMART Hub & DevPortal' },
  { id: 'ar-only', name: 'AR Only', application: 'SMART Hub & DevPortal' },
  { id: 'technical', name: 'Technical', application: 'SMART Hub & DevPortal' },
];

export const selectedRoleDescription =
  'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business Owner can manage users and create Business-specific roles';

export const permissionSections: PermissionSection[] = [
  {
    id: 'accounts-payable',
    title: 'Accounts Payable',
    app: 'SMART Hub',
    permissions: [
      'View Bill Details',
      'View Bills List',
      'Pay Bill',
      'View Vendors Details',
      'Cancel Scheduled Payment',
      'Change Bill Method of Payment',
      "Change Vendor's Email on Vendor's Details Page",
      'View Vendors List Page',
      "Change Vendor's default Method of Payment",
      'Edit Vendor’s Email on the Bill Level',
      'Send Network Invitation to Vendor',
      'Re-send Network Invitation to Vendor',
    ],
  },
  {
    id: 'accounts-receivable',
    title: 'Accounts Receivable',
    app: 'SMART Hub',
    permissions: [
      'View Invoices List',
      'View Invoice Details',
      'Initiate Collection on Invoice',
      'Cancel Scheduled Invoice',
      'Re-Run Invoice',
      'View Customers List',
      'View Customer Profile',
      'Invite Customer to the Network',
      'Send a Nudge Link Request to the Customer',
      'Re-Send a Nudge Link Request to the Customer',
      'Accept Link Request from Customer',
      'Reject Link Request from Customer',
      'Delete Link with Customer',
    ],
  },
  {
    id: 'user-management',
    title: 'User Management',
    app: 'SMART Hub & DevPortal',
    permissions: [
      'View Generic Users List',
      'View Hidden Users List',
      'View Generic User Details',
      'View Hidden User Details',
      'Assign a Role to the User from Generic or Business List',
      'Assign a Role to a User from Hidden TC User Role List',
      'View Generic and Business List of the Roles',
      'View Hidden List of the Roles',
      'Edit Generic User',
      'Delete Generic User',
      'Delete Hidden User',
      'Create new Role for a Business',
      'Create new Generic Role',
      'Delete a Role for a Business',
      'Delete Generic Role',
      'Create User',
      'Modify a Role for a Business',
      'Send Invitation (Re-send Invitation)',
      'Modify Generic Role',
    ],
  },
];

const permissionsFromSections = (sectionIds: string[]) =>
  Object.fromEntries(
    permissionSections.map((section) => [
      section.id,
      sectionIds.includes(section.id) ? section.permissions : [],
    ])
  );

/**
 * Which permissions each seeded role preset grants. Roles that have never been
 * opened in the create/edit form have no stored payload, so this is the only
 * source of truth for what they are allowed to do.
 */
export const permissionsByPreset: Record<string, Record<string, string[]>> = {
  'full-access': permissionsFromSections(
    permissionSections.map((section) => section.id)
  ),
  'view-only': Object.fromEntries(
    permissionSections.map((section) => [
      section.id,
      section.permissions.filter((permission) => permission.startsWith('View')),
    ])
  ),
  'ap-only': permissionsFromSections(['accounts-payable']),
  'ar-only': permissionsFromSections(['accounts-receivable']),
  technical: permissionsFromSections(['user-management']),
};

export const getPermissionsForPreset = (
  presetId?: string
): Record<string, string[]> =>
  (presetId && permissionsByPreset[presetId]) || {};

export const timeframeOptions: TimeframeOption[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
];

export const advancedLimitMethods = [
  'ACH',
  'Wire',
  'RTP',
  'Check',
  'Cross-border - A2A',
  'Push Debit',
  'P Card - VC out of Hub',
];

export const advancedPeriodOptions: TimeframeOption[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
];

export const formatAmountValue = (value: string) => {
  const sanitized = value.replace(/[^0-9.]/g, '');
  if (!sanitized) return '';
  const [rawInteger, ...rawDecimalParts] = sanitized.split('.');
  const integerPart = rawInteger.replace(/^0+(?=\d)/, '') || '0';
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (rawDecimalParts.length === 0) return formattedInteger;
  const decimalPart = rawDecimalParts.join('').slice(0, 2);
  return `${formattedInteger}.${decimalPart}`;
};

import type { TColors } from '../../enums/Badge';

export type UserStatus = 'active' | 'invitationSent' | 'requiresAction';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  roleHint?: string;
  status: UserStatus;
  isCurrentUser?: boolean;
  avatarBgClass?: string;
};

export type RoleRow = {
  id: string;
  roleName: string;
  application: string;
  description: string;
};

export const usersData: UserRow[] = [
  {
    id: 'u-1',
    name: 'Jane Cooper',
    email: 'jane.cooper@bigkahunaburger.com',
    role: 'Administrator',
    roleHint: '(Owner)',
    status: 'active',
    isCurrentUser: true,
  },
  {
    id: 'u-2',
    name: 'Emma Dorsey',
    email: 'emma.dorsey@bigkahunaburger.com',
    role: 'View Only',
    status: 'active',
  },
  {
    id: 'u-3',
    name: 'Shawn Graham',
    email: 'shawn.graham@bigkahunaburger.com',
    role: 'Full Access',
    status: 'invitationSent',
  },
  {
    id: 'u-4',
    name: '-',
    email: 'chelsea.hagon@bigkahunaburger.com',
    role: 'View Only',
    status: 'invitationSent',
  },
  {
    id: 'u-5',
    name: '-',
    email: 'jacob.jones@bigkahunaburger.com',
    role: 'Send Invitation',
    status: 'requiresAction',
  },
  {
    id: 'u-6',
    name: '-',
    email: 'savannah.nguyen@bigkahunaburger.com',
    role: 'Send Invitation',
    status: 'requiresAction',
  },
  {
    id: 'u-7',
    name: '-',
    email: 'emil.schaefer@bigkahunaburger.com',
    role: 'Send Invitation',
    status: 'requiresAction',
  },
];

export const rolesData: RoleRow[] = [
  {
    id: 'r-1',
    roleName: 'Full Access',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business...',
  },
  {
    id: 'r-2',
    roleName: 'View Only',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business...',
  },
  {
    id: 'r-3',
    roleName: 'AP Only',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business...',
  },
  {
    id: 'r-4',
    roleName: 'AR Only',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business...',
  },
  {
    id: 'r-5',
    roleName: 'Technical',
    application: 'SMART Hub & DevPortal',
    description:
      'This role has full view and action capabilities for both Account Payables and Account Receivables. Additionally, the Business...',
  },
];

export const statusConfig: Record<
  UserStatus,
  { label: string; color: TColors; icon: string }
> = {
  active: {
    label: 'Active',
    color: 'green',
    icon: 'check-circle',
  },
  invitationSent: {
    label: 'Invitation Sent',
    color: 'blue',
    icon: 'in-progress',
  },
  requiresAction: {
    label: 'Requires Action',
    color: 'yellow',
    icon: 'exclamation',
  },
};

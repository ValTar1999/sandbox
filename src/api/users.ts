import { api } from './client';
import type { RoleRow, UserRow } from '../pages/UserManagment/data';
import type { CreateRolePayload } from '../pages/UserManagment/CreateRoleView';
import type { LimitsSummary } from '../modals/userModalSharedData';

export type UserLimits = { ap?: LimitsSummary; ar?: LimitsSummary };

export type UsersResponse = {
  rows: UserRow[];
  limitsById: Record<string, UserLimits>;
};

export type RolesResponse = {
  rows: RoleRow[];
  payloadById: Record<string, CreateRolePayload>;
};

export const fetchUsers = () => api.get<UsersResponse>('/users');

export const createUser = (body: {
  name: string;
  email: string;
  role: string;
  limitsSummaryByType: UserLimits;
}) => api.post<UserRow>('/users', body);

export const updateUser = (
  id: string,
  body: {
    name?: string;
    email?: string;
    role?: string;
    avatarUrl?: string;
    limitsSummaryByType?: UserLimits;
  }
) => api.patch<UserRow>(`/users/${id}`, body);

export const deleteUser = (id: string) => api.delete<void>(`/users/${id}`);

export const fetchRoles = () => api.get<RolesResponse>('/roles');

export const createRole = (payload: CreateRolePayload) =>
  api.post<RoleRow>('/roles', payload);

export const updateRole = (id: string, payload: CreateRolePayload) =>
  api.patch<CreateRolePayload>(`/roles/${id}`, { payload });

export type ProfileRecord = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarImageSrc?: string;
};

export const fetchProfile = () => api.get<ProfileRecord>('/profile');

export const saveProfile = (body: ProfileRecord) =>
  api.put<ProfileRecord>('/profile', body);

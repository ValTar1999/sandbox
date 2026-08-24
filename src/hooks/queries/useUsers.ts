import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import {
  createRole,
  createUser,
  deleteUser,
  fetchProfile,
  fetchRoles,
  fetchUsers,
  saveProfile,
  updateRole,
  updateUser,
  type UserLimits,
} from '../../api/users';
import type { CreateRolePayload } from '../../pages/UserManagment/CreateRoleView';

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
  });

export const useRoles = () =>
  useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: fetchRoles,
  });

const useInvalidateUsers = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
};

const useInvalidateRoles = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
};

export const useCreateUser = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: createUser,
    onSuccess: invalidate,
  });
};

export const useUpdateUser = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
      avatarUrl?: string;
      limitsSummaryByType?: UserLimits;
    }) => updateUser(id, body),
    onSuccess: invalidate,
  });
};

export const useDeleteUser = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidate,
  });
};

export const useCreateRole = () => {
  const invalidate = useInvalidateRoles();

  return useMutation({
    mutationFn: createRole,
    onSuccess: invalidate,
  });
};

export const useUpdateRole = () => {
  const invalidate = useInvalidateRoles();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: invalidate,
  });
};

export const useProfile = () =>
  useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
  });

export const useSaveProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProfile,
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.profile, saved);
    },
  });
};

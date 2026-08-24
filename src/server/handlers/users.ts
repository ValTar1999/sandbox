import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { LOADING_DURATION_MS } from '../../constants/animations';
import { getDb, updateDb, type UserLimits, type ProfileRecord } from '../db';
import type { RoleRow, UserRow } from '../../pages/UserManagment/data';
import type { CreateRolePayload } from '../../pages/UserManagment/CreateRoleView';

const ROLE_DESCRIPTION_MAX_LENGTH = 120;

const truncateRoleDescription = (value: string) => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length <= ROLE_DESCRIPTION_MAX_LENGTH) return normalized;
  return `${normalized.slice(0, ROLE_DESCRIPTION_MAX_LENGTH).trimEnd()}...`;
};

const badRequest = (message: string, fieldErrors?: Record<string, string>) =>
  HttpResponse.json({ message, fieldErrors }, { status: 400 });

const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUser = (
  body: { name?: string; email?: string; role?: string },
  users: UserRow[],
  ignoreId?: string
) => {
  const fieldErrors: Record<string, string> = {};

  if (!body.name?.trim()) fieldErrors.name = 'Name is required.';
  if (!body.email?.trim()) {
    fieldErrors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(body.email.trim())) {
    fieldErrors.email = 'Enter a valid email address.';
  } else if (
    users.some(
      (user) =>
        user.id !== ignoreId &&
        user.email.toLowerCase() === body.email?.trim().toLowerCase()
    )
  ) {
    fieldErrors.email = 'A user with this email already exists.';
  }
  if (!body.role?.trim()) fieldErrors.role = 'Role is required.';

  return fieldErrors;
};

export const usersHandlers = [
  http.get(apiUrl('/users'), async () => {
    await delay(LOADING_DURATION_MS);

    const db = getDb();
    return HttpResponse.json({
      rows: db.users,
      limitsById: db.userLimitsById,
    });
  }),

  http.post(apiUrl('/users'), async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
      limitsSummaryByType?: UserLimits;
    };

    await delay(LOADING_DURATION_MS);

    const fieldErrors = validateUser(body, getDb().users);
    if (Object.keys(fieldErrors).length > 0) {
      return badRequest('Could not send the invitation.', fieldErrors);
    }

    const created = updateDb((db) => {
      const user: UserRow = {
        id: `u-${Date.now()}`,
        name: body.name as string,
        email: (body.email as string).trim(),
        role: body.role as string,
        status: 'invitationSent',
      };

      db.users.unshift(user);
      db.userLimitsById[user.id] = body.limitsSummaryByType ?? {};
      return user;
    });

    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(apiUrl('/users/:id'), async ({ params, request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
      avatarUrl?: string;
      limitsSummaryByType?: UserLimits;
    };

    await delay(LOADING_DURATION_MS);

    const existing = getDb().users.find((user) => user.id === params.id);
    if (!existing) return notFound('User not found');

    // A limits-only update skips the profile validation.
    const isProfileUpdate =
      body.name !== undefined ||
      body.email !== undefined ||
      body.role !== undefined;

    if (isProfileUpdate) {
      const fieldErrors = validateUser(
        {
          name: body.name ?? existing.name,
          email: body.email ?? existing.email,
          role: body.role ?? existing.role,
        },
        getDb().users,
        existing.id
      );
      if (Object.keys(fieldErrors).length > 0) {
        return badRequest('Could not save the user.', fieldErrors);
      }
    }

    const updated = updateDb((db) => {
      const user = db.users.find((item) => item.id === params.id) as UserRow;

      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email.trim();
      if (body.role !== undefined) user.role = body.role;
      if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;
      if (body.limitsSummaryByType !== undefined) {
        db.userLimitsById[user.id] = body.limitsSummaryByType;
      }

      return user;
    });

    return HttpResponse.json(updated);
  }),

  http.delete(apiUrl('/users/:id'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const exists = getDb().users.some((user) => user.id === params.id);
    if (!exists) return notFound('User not found');

    updateDb((db) => {
      db.users = db.users.filter((user) => user.id !== params.id);
      delete db.userLimitsById[params.id as string];
    });

    return new HttpResponse(null, { status: 204 });
  }),

  http.get(apiUrl('/roles'), async () => {
    await delay(LOADING_DURATION_MS);

    const db = getDb();
    return HttpResponse.json({
      rows: db.roles,
      payloadById: db.rolePayloadById,
    });
  }),

  http.post(apiUrl('/roles'), async ({ request }) => {
    const body = (await request.json()) as CreateRolePayload;

    await delay(LOADING_DURATION_MS);

    const fieldErrors: Record<string, string> = {};
    if (!body.roleName?.trim()) {
      fieldErrors.roleName = 'Role name is required.';
    } else if (
      getDb().roles.some(
        (role) =>
          role.roleName.toLowerCase() === body.roleName.trim().toLowerCase()
      )
    ) {
      fieldErrors.roleName = 'This role name is already taken.';
    }
    if (!body.application?.trim()) {
      fieldErrors.application = 'Application is required.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return badRequest('Could not create the role.', fieldErrors);
    }

    const created = updateDb((db) => {
      const role: RoleRow = {
        id: `r-${Date.now()}`,
        roleName: body.roleName.trim(),
        description: truncateRoleDescription(body.description ?? ''),
        application: body.application,
      };

      db.roles.unshift(role);
      db.rolePayloadById[role.id] = body;
      return role;
    });

    return HttpResponse.json(created, { status: 201 });
  }),

  /**
   * Seeded roles have no stored payload — the client derives it from the role
   * presets — so an update sends the whole payload and the server just stores
   * it, rather than trying to reconstruct the preset mapping here.
   */
  http.patch(apiUrl('/roles/:id'), async ({ params, request }) => {
    const body = (await request.json()) as { payload?: CreateRolePayload };

    await delay(LOADING_DURATION_MS);

    const role = getDb().roles.find((item) => item.id === params.id);
    if (!role) return notFound('Role not found');
    if (!body.payload) return badRequest('Role details are required.');

    const updated = updateDb((db) => {
      db.rolePayloadById[role.id] = body.payload as CreateRolePayload;

      const target = db.roles.find((item) => item.id === role.id) as RoleRow;
      target.description = truncateRoleDescription(
        body.payload?.description ?? target.description
      );

      return db.rolePayloadById[role.id];
    });

    return HttpResponse.json(updated);
  }),

  http.get(apiUrl('/profile'), async () => {
    await delay(LOADING_DURATION_MS);
    return HttpResponse.json(getDb().profile);
  }),

  http.put(apiUrl('/profile'), async ({ request }) => {
    const body = (await request.json()) as Partial<ProfileRecord>;

    await delay(LOADING_DURATION_MS);

    const saved = updateDb((db) => {
      db.profile = {
        email: body.email ?? db.profile.email,
        firstName: body.firstName ?? db.profile.firstName,
        lastName: body.lastName ?? db.profile.lastName,
        phoneNumber: body.phoneNumber ?? db.profile.phoneNumber,
        avatarImageSrc:
          body.avatarImageSrc === undefined
            ? db.profile.avatarImageSrc
            : body.avatarImageSrc || undefined,
      };
      return db.profile;
    });

    return HttpResponse.json(saved);
  }),
];

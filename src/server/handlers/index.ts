import type { RequestHandler } from 'msw';
import { devHandlers } from './dev';
import { payablesHandlers } from './payables';
import { receivablesHandlers } from './receivables';
import { smartExchangeHandlers } from './smartExchange';
import { usersHandlers } from './users';
import { vendorsHandlers } from './vendors';

export const handlers: RequestHandler[] = [
  ...smartExchangeHandlers,
  ...payablesHandlers,
  ...receivablesHandlers,
  ...vendorsHandlers,
  ...usersHandlers,
  ...devHandlers,
];

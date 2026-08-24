import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { resetDb } from '../db';

export const devHandlers = [
  http.post(apiUrl('/dev/reset'), async () => {
    await delay(200);
    resetDb();
    return HttpResponse.json({ ok: true });
  }),
];

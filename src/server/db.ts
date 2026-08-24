import { smartExchangePayments } from '../pages/SmartExchange/data';
import type { SmartExchangePayment } from '../pages/SmartExchange/data';
import { payments as payablesSeed } from '../pages/BillsPayables/data';
import type { Payment } from '../pages/BillsPayables/data';
import { receivables as receivablesSeed } from '../pages/InvoicesReceivables/data';
import type { Receivable } from '../pages/InvoicesReceivables/data';
import { vendors as vendorsSeed } from '../pages/Vendors/data';
import type { Vendor } from '../pages/Vendors/data';
import { usersData, rolesData } from '../pages/UserManagment/data';
import type { UserRow, RoleRow } from '../pages/UserManagment/data';
import {
  defaultGlobalPaymentPreferences,
  payerCards as payerCardsSeed,
} from '../pages/SmartExchange/PaymentPreferences/data';
import type {
  GlobalPaymentPreferences,
  PayerCard,
  PayerSpecificPreferenceRow,
} from '../pages/SmartExchange/PaymentPreferences/data';
import type { LimitsSummary } from '../modals/userModalSharedData';
import type { CreateRolePayload } from '../pages/UserManagment/CreateRoleView';

const STORAGE_KEY = 'smart-hub-mock-db';
const SCHEMA_VERSION = 3;

export type UserLimits = { ap?: LimitsSummary; ar?: LimitsSummary };

export type GetPaidSubmission = {
  paymentId: string;
  method: string;
  bankAccount: string;
  signedBy: string | null;
  acceptedAttachments: string[];
  submittedAt: string;
};

export type DisputeRecord = {
  paymentId: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

export type ProfileRecord = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarImageSrc?: string;
};

export type CardProcessingState = {
  enabled: boolean;
  signedBy: string;
  confirmedAt: string;
};

export type MockDb = {
  version: number;
  smartExchangePayments: SmartExchangePayment[];
  payables: Payment[];
  receivables: Receivable[];
  vendors: Vendor[];
  payerCards: PayerCard[];
  users: UserRow[];
  roles: RoleRow[];
  userLimitsById: Record<string, UserLimits>;
  rolePayloadById: Record<string, CreateRolePayload>;
  paymentPreferences: {
    global: GlobalPaymentPreferences;
    payerRows: PayerSpecificPreferenceRow[];
    cardProcessing: CardProcessingState;
  };
  profile: ProfileRecord;
  getPaidSubmissions: Record<string, GetPaidSubmission>;
  disputes: Record<string, DisputeRecord>;
};

const createSeed = (): MockDb =>
  structuredClone({
    version: SCHEMA_VERSION,
    smartExchangePayments,
    payables: payablesSeed,
    receivables: receivablesSeed,
    vendors: vendorsSeed,
    payerCards: payerCardsSeed,
    users: usersData,
    roles: rolesData,
    userLimitsById: {},
    rolePayloadById: {},
    paymentPreferences: {
      global: defaultGlobalPaymentPreferences,
      payerRows: [],
      cardProcessing: {
        enabled: false,
        signedBy: '',
        confirmedAt: '',
      },
    },
    profile: {
      email: 'jane.cooper@bigkahunaburger.com',
      firstName: 'Jane',
      lastName: 'Cooper',
      phoneNumber: '+1 56 978 483',
    },
    getPaidSubmissions: {},
    disputes: {},
  });

function load(): MockDb {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();

    const parsed = JSON.parse(raw) as MockDb;
    // A schema bump invalidates whatever the browser kept from an older build.
    if (parsed.version !== SCHEMA_VERSION) return createSeed();

    return parsed;
  } catch {
    return createSeed();
  }
}

let db: MockDb = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.warn('[mock backend] could not persist state', error);
  }
}

export const getDb = () => db;

export const updateDb = <T>(mutate: (draft: MockDb) => T): T => {
  const result = mutate(db);
  persist();
  return result;
};

export const resetDb = () => {
  db = createSeed();
  persist();
};

/**
 * `?reset=1` on boot and `window.resetMockBackend()` from the console are the
 * two ways back to the seeded demo state.
 */
export const installDbDevTools = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('reset') === '1') {
    resetDb();
    params.delete('reset');
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
  }

  (window as Window & { resetMockBackend?: () => void }).resetMockBackend =
    () => {
      resetDb();
      window.location.reload();
    };
};

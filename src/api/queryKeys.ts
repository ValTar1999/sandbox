export type ListParams = {
  tab?: string;
  search?: string;
  page?: number;
  perPage?: number;
};

export const queryKeys = {
  smartExchange: {
    all: ['smart-exchange'] as const,
    list: (params: ListParams) => ['smart-exchange', 'list', params] as const,
    detail: (id: string | undefined) =>
      ['smart-exchange', 'detail', id] as const,
  },
  payables: {
    all: ['payables'] as const,
    list: (params: ListParams) => ['payables', 'list', params] as const,
    detail: (id: string | undefined) => ['payables', 'detail', id] as const,
  },
  receivables: {
    all: ['receivables'] as const,
    list: (params: ListParams) => ['receivables', 'list', params] as const,
    detail: (id: string | undefined) => ['receivables', 'detail', id] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    list: () => ['vendors', 'list'] as const,
  },
  payerCards: {
    all: ['payer-cards'] as const,
    list: () => ['payer-cards', 'list'] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => ['users', 'list'] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: () => ['roles', 'list'] as const,
  },
  paymentPreferences: ['payment-preferences'] as const,
  profile: ['profile'] as const,
};

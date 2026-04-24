import {
  advancedLimitMethods,
  advancedPeriodOptions,
  type AdvancedMethodFieldErrors,
} from '../../modals/userModalSharedData';

export const createEmptyAdvancedMethodMap = () =>
  Object.fromEntries(
    advancedLimitMethods.map((method) => [method, ''])
  ) as Record<string, string>;

export const createEmptyAdvancedMethodErrors = () =>
  Object.fromEntries(
    advancedLimitMethods.map((method) => [
      method,
      {
        timeframeLimit: false,
        timeframePeriod: false,
        perBillInvoice: false,
      },
    ])
  ) as Record<string, AdvancedMethodFieldErrors>;

export const getAdvancedLimitsErrors = ({
  periodsByMethod,
  timeframeLimitsByMethod,
  perBillLimitsByMethod,
}: {
  periodsByMethod: Record<string, string>;
  timeframeLimitsByMethod: Record<string, string>;
  perBillLimitsByMethod: Record<string, string>;
}) =>
  Object.fromEntries(
    advancedLimitMethods.map((method) => {
      const timeframeLimitValue = timeframeLimitsByMethod[method] ?? '';
      const timeframePeriodValue = periodsByMethod[method] ?? '';
      const perBillInvoiceValue = perBillLimitsByMethod[method] ?? '';
      const methodIsTouched =
        timeframeLimitValue.trim().length > 0 ||
        timeframePeriodValue.trim().length > 0 ||
        perBillInvoiceValue.trim().length > 0;

      if (!methodIsTouched) {
        return [
          method,
          {
            timeframeLimit: false,
            timeframePeriod: false,
            perBillInvoice: false,
          },
        ];
      }

      return [
        method,
        {
          timeframeLimit: timeframeLimitValue.trim().length === 0,
          timeframePeriod: timeframePeriodValue.trim().length === 0,
          perBillInvoice: perBillInvoiceValue.trim().length === 0,
        },
      ];
    })
  ) as Record<string, AdvancedMethodFieldErrors>;

export const hasAdvancedLimitsErrors = (
  errorsByMethod: Record<string, AdvancedMethodFieldErrors>
) =>
  Object.values(errorsByMethod).some(
    (error) =>
      error.timeframeLimit || error.timeframePeriod || error.perBillInvoice
  );

export const createAdvancedLimitsSummary = ({
  periodsByMethod,
  timeframeLimitsByMethod,
  perBillLimitsByMethod,
}: {
  periodsByMethod: Record<string, string>;
  timeframeLimitsByMethod: Record<string, string>;
  perBillLimitsByMethod: Record<string, string>;
}) => {
  const firstMethod = advancedLimitMethods[0];
  const firstMethodPeriodId = periodsByMethod[firstMethod];
  const periodLabel =
    advancedPeriodOptions.find((option) => option.id === firstMethodPeriodId)
      ?.label ?? 'Monthly';

  return `${firstMethod} - ${periodLabel}: $${timeframeLimitsByMethod[firstMethod]}. Bill/Invoice: $${perBillLimitsByMethod[firstMethod]}. ...`;
};

export const validateGlobalLimits = ({
  timeframeLimitValue,
  timeframeId,
  perInvoiceLimitValue,
}: {
  timeframeLimitValue: string;
  timeframeId: string;
  perInvoiceLimitValue: string;
}) => ({
  hasTimeframeLimit: timeframeLimitValue.trim().length > 0,
  hasTimeframeSelection: timeframeId.trim().length > 0,
  hasPerInvoiceLimit: perInvoiceLimitValue.trim().length > 0,
});

export const parseGlobalLimitsSummary = (summary: string) => {
  const parsed = summary.match(
    /^(.+?): \$([^.]*)\. Bill\/Invoice: \$([^.]*)\.$/
  );
  return {
    timeframeLabel: parsed?.[1]?.trim() ?? '',
    timeframeLimit: parsed?.[2] ?? '',
    perInvoiceLimit: parsed?.[3] ?? '',
  };
};

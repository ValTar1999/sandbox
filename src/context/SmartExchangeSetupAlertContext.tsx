import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { SmartExchangeSetupAlertContext } from './smartExchangeSetupAlert';
import {
  usePaymentPreferences,
  useSavePaymentPreferences,
} from '../hooks/queries/usePaymentPreferences';

export const SmartExchangeSetupAlertProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data } = usePaymentPreferences();
  const savePreferences = useSavePaymentPreferences();
  const [setupAlertVisible, setSetupAlertVisible] = useState(false);
  const cardProcessingEnabled = data?.cardProcessing?.enabled ?? false;

  const showSetupAlert = useCallback(() => setSetupAlertVisible(true), []);
  const hideSetupAlert = useCallback(() => setSetupAlertVisible(false), []);
  const enableCardProcessing = useCallback(
    (details?: { signedBy?: string; confirmedAt?: string }) => {
      savePreferences.mutate({
        cardProcessing: {
          enabled: true,
          ...(details?.signedBy ? { signedBy: details.signedBy } : {}),
          ...(details?.confirmedAt ? { confirmedAt: details.confirmedAt } : {}),
        },
      });
      setSetupAlertVisible(false);
    },
    [savePreferences]
  );
  const disableCardProcessing = useCallback(() => {
    savePreferences.mutate({
      cardProcessing: { enabled: false, signedBy: '', confirmedAt: '' },
    });
    setSetupAlertVisible(false);
  }, [savePreferences]);

  const value = useMemo(
    () => ({
      setupAlertVisible,
      showSetupAlert,
      hideSetupAlert,
      cardProcessingEnabled,
      enableCardProcessing,
      disableCardProcessing,
    }),
    [
      setupAlertVisible,
      showSetupAlert,
      hideSetupAlert,
      cardProcessingEnabled,
      enableCardProcessing,
      disableCardProcessing,
    ]
  );

  return (
    <SmartExchangeSetupAlertContext.Provider value={value}>
      {children}
    </SmartExchangeSetupAlertContext.Provider>
  );
};

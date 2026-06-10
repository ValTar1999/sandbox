import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { SmartExchangeSetupAlertContext } from './smartExchangeSetupAlert';

export const SmartExchangeSetupAlertProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [setupAlertVisible, setSetupAlertVisible] = useState(false);
  const [cardProcessingEnabled, setCardProcessingEnabled] = useState(false);

  const showSetupAlert = useCallback(() => setSetupAlertVisible(true), []);
  const hideSetupAlert = useCallback(() => setSetupAlertVisible(false), []);
  const enableCardProcessing = useCallback(() => {
    setCardProcessingEnabled(true);
    setSetupAlertVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      setupAlertVisible,
      showSetupAlert,
      hideSetupAlert,
      cardProcessingEnabled,
      enableCardProcessing,
    }),
    [
      setupAlertVisible,
      showSetupAlert,
      hideSetupAlert,
      cardProcessingEnabled,
      enableCardProcessing,
    ]
  );

  return (
    <SmartExchangeSetupAlertContext.Provider value={value}>
      {children}
    </SmartExchangeSetupAlertContext.Provider>
  );
};

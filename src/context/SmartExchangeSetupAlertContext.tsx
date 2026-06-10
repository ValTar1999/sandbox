import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface SmartExchangeSetupAlertContextValue {
  setupAlertVisible: boolean;
  showSetupAlert: () => void;
  hideSetupAlert: () => void;
  cardProcessingEnabled: boolean;
  enableCardProcessing: () => void;
}

const SmartExchangeSetupAlertContext =
  createContext<SmartExchangeSetupAlertContextValue | null>(null);

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

export const useSmartExchangeSetupAlert = () => {
  const ctx = useContext(SmartExchangeSetupAlertContext);
  if (!ctx) {
    throw new Error(
      'useSmartExchangeSetupAlert must be used within SmartExchangeSetupAlertProvider'
    );
  }
  return ctx;
};

import { createContext, useContext } from 'react';

export interface SmartExchangeSetupAlertContextValue {
  setupAlertVisible: boolean;
  showSetupAlert: () => void;
  hideSetupAlert: () => void;
  cardProcessingEnabled: boolean;
  enableCardProcessing: () => void;
}

export const SmartExchangeSetupAlertContext =
  createContext<SmartExchangeSetupAlertContextValue | null>(null);

export const useSmartExchangeSetupAlert = () => {
  const ctx = useContext(SmartExchangeSetupAlertContext);
  if (!ctx) {
    throw new Error(
      'useSmartExchangeSetupAlert must be used within SmartExchangeSetupAlertProvider'
    );
  }
  return ctx;
};

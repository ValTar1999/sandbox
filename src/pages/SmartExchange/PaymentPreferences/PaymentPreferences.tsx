import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Box from '../../../components/layout/Box';
import Button from '../../../components/common/base/Button';
import BankAccountVerificationModal from '../../../modals/BankAccountVerificationModal';
import SmartExchangeOptInModal from '../../../modals/SmartExchangeOptInModal';
import { useDraftState } from '../../../hooks/useDraftState';
import { useSmartExchangeSetupAlert } from '../../../context/smartExchangeSetupAlert';
import PaymentMethodsTab from './PaymentMethodsTab';
import GlobalPreferencesTab from './GlobalPreferencesTab';
import AdvancedSettingsTab from './AdvancedSettingsTab';
import {
  createEmptyPayerPreferenceRow,
  defaultGlobalPaymentPreferences,
  paymentPreferencesTabs,
  type PayerSpecificPreferenceRow,
  type PaymentPreferencesTab,
} from './data';

const PreferencesFooterActions = ({
  hasChanges,
  onCancel,
  onSave,
}: {
  hasChanges: boolean;
  onCancel: () => void;
  onSave: () => void;
}) => (
  <div className="flex w-full justify-end gap-4">
    <Button
      variant="secondary"
      size="md"
      onClick={onCancel}
      disabled={!hasChanges}
    >
      Cancel
    </Button>
    <Button size="md" onClick={onSave} disabled={!hasChanges}>
      Save
    </Button>
  </div>
);

const PaymentPreferences = () => {
  const { state } = useLocation();
  const [activeTab, setActiveTab] =
    useState<PaymentPreferencesTab>('payment-methods');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [optInModalOpen, setOptInModalOpen] = useState(false);
  const initialAutomaticCardProcessingVariant =
    (state as { automaticCardProcessing?: string } | null)
      ?.automaticCardProcessing === 'opt-in'
      ? 'opt-in'
      : 'pending-signature';
  const [automaticCardProcessingVariant, setAutomaticCardProcessingVariant] =
    useState<'pending-signature' | 'opt-in'>(
      initialAutomaticCardProcessingVariant
    );
  const { setupAlertVisible, cardProcessingEnabled, enableCardProcessing } =
    useSmartExchangeSetupAlert();
  const {
    draft: globalPreferences,
    setDraft: setGlobalPreferences,
    hasChanges: hasGlobalPreferencesChanges,
    cancel: handleCancelGlobalPreferences,
    save: handleSaveGlobalPreferences,
  } = useDraftState(defaultGlobalPaymentPreferences);
  const [isAdvancedCustomizing, setIsAdvancedCustomizing] = useState(false);
  const {
    saved: savedPayerPreferenceRows,
    draft: payerPreferenceRows,
    setDraft: setPayerPreferenceRows,
    hasChanges: hasAdvancedSettingsChanges,
    cancel: handleCancelAdvancedSettings,
    save: handleSaveAdvancedSettings,
  } = useDraftState<PayerSpecificPreferenceRow[]>([]);

  useEffect(() => {
    setAutomaticCardProcessingVariant(initialAutomaticCardProcessingVariant);
  }, [initialAutomaticCardProcessingVariant]);

  useEffect(() => {
    if (activeTab !== 'advanced-settings') return;
    if (
      savedPayerPreferenceRows.length > 0 &&
      payerPreferenceRows.length === 0
    ) {
      setPayerPreferenceRows(savedPayerPreferenceRows);
      setIsAdvancedCustomizing(true);
    }
  }, [
    activeTab,
    payerPreferenceRows.length,
    savedPayerPreferenceRows,
    setPayerPreferenceRows,
  ]);

  const handleGlobalPreferenceChange = (
    slot: keyof typeof globalPreferences,
    value: string
  ) => {
    setGlobalPreferences((prev) => ({ ...prev, [slot]: value }));
  };

  const showAdvancedSettingsFooter =
    activeTab === 'advanced-settings' &&
    (isAdvancedCustomizing || savedPayerPreferenceRows.length > 0);

  const handleStartAdvancedCustomize = () => {
    setIsAdvancedCustomizing(true);
    setPayerPreferenceRows((currentRows) =>
      currentRows.length > 0 ? currentRows : [createEmptyPayerPreferenceRow()]
    );
  };

  const handleCancelAdvancedSettingsWithReset = () => {
    handleCancelAdvancedSettings();
    if (savedPayerPreferenceRows.length === 0) {
      setIsAdvancedCustomizing(false);
    }
  };

  const handleSaveAdvancedSettingsWithState = () => {
    handleSaveAdvancedSettings();
    setIsAdvancedCustomizing(true);
  };

  const footer =
    activeTab === 'global-preferences' ? (
      <PreferencesFooterActions
        hasChanges={hasGlobalPreferencesChanges}
        onCancel={handleCancelGlobalPreferences}
        onSave={handleSaveGlobalPreferences}
      />
    ) : showAdvancedSettingsFooter ? (
      <PreferencesFooterActions
        hasChanges={hasAdvancedSettingsChanges}
        onCancel={handleCancelAdvancedSettingsWithReset}
        onSave={handleSaveAdvancedSettingsWithState}
      />
    ) : undefined;

  return (
    <>
      <Box className="max-w-7xl mx-auto" footer={footer}>
        <div>
          <h1 className="text-2xl font-semibold leading-8 text-gray-900 px-6 pt-6">
            Payment Preferences
          </h1>
          <nav
            className="mt-3 flex gap-6 border-b border-gray-200 px-6"
            aria-label="Payment preferences sections"
          >
            {paymentPreferencesTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'px-1 py-2.5 text-sm font-medium leading-5 transition-colors border-b-2 cursor-pointer',
                    isActive
                      ? 'border-smart-main text-smart-main'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'payment-methods' ? (
          <div className="grid grid-cols-[500px_1fr] gap-14 p-6 w-full">
            <aside>
              <h2 className="text-sm font-semibold text-gray-900 leading-5">
                Payers&apos; Cards
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Accept payment by card, no bank account details required.
              </p>
            </aside>

            <div className="">
              <PaymentMethodsTab
                onVerifyNow={() => setVerificationModalOpen(true)}
                onOptIn={() => setOptInModalOpen(true)}
                variant={
                  cardProcessingEnabled
                    ? 'enabled'
                    : setupAlertVisible
                      ? 'action-required'
                      : automaticCardProcessingVariant
                }
              />
            </div>
          </div>
        ) : activeTab === 'global-preferences' ? (
          <div className="grid grid-cols-2 gap-14 px-6 pb-6 pt-9 w-full">
            <aside>
              <h2 className="text-xl font-semibold text-gray-900 leading-8">
                Set Default Payment Methods
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Set the order of payment preferences. If the primary method is
                not supported by the payer, we will automatically default to the
                next choice.
              </p>
              <p className="mt-6 text-sm leading-5 text-gray-500">
                Payer specific payment preferences can be set within{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('advanced-settings')}
                  className="font-medium text-blue-600 underline transition-colors hover:text-blue-700 cursor-pointer"
                >
                  Advanced Settings
                </button>
                .
              </p>
            </aside>

            <GlobalPreferencesTab
              preferences={globalPreferences}
              onChange={handleGlobalPreferenceChange}
            />
          </div>
        ) : activeTab === 'advanced-settings' ? (
          <AdvancedSettingsTab
            rows={payerPreferenceRows}
            savedRows={savedPayerPreferenceRows}
            isCustomizing={isAdvancedCustomizing}
            onStartCustomize={handleStartAdvancedCustomize}
            onRowsChange={setPayerPreferenceRows}
            onCancelCustomize={() => {
              setPayerPreferenceRows([]);
              setIsAdvancedCustomizing(false);
            }}
          />
        ) : null}
      </Box>

      <BankAccountVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        onVerified={enableCardProcessing}
      />
      <SmartExchangeOptInModal
        open={optInModalOpen}
        onClose={() => setOptInModalOpen(false)}
        onDelegatedPending={() =>
          setAutomaticCardProcessingVariant('pending-signature')
        }
      />
    </>
  );
};

export default PaymentPreferences;

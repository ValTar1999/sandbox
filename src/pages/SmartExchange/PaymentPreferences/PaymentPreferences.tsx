import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Box from '../../../components/layout/Box';
import BankAccountVerificationModal from '../../../modals/BankAccountVerificationModal';
import SmartExchangeOptInModal from '../../../modals/SmartExchangeOptInModal';
import PaymentMethodsTab from './PaymentMethodsTab';
import { paymentPreferencesTabs, type PaymentPreferencesTab } from './data';

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

  useEffect(() => {
    setAutomaticCardProcessingVariant(initialAutomaticCardProcessingVariant);
  }, [initialAutomaticCardProcessingVariant]);

  return (
    <>
      <Box className="max-w-9xl mx-auto">
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
                variant={automaticCardProcessingVariant}
              />
            </div>
          </div>
        ) : (
          <div className="px-6 py-8">
            <p className="text-sm text-gray-500">
              {activeTab === 'global-preferences'
                ? 'Global Preferences'
                : 'Advanced Settings'}
            </p>
          </div>
        )}
      </Box>

      <BankAccountVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
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

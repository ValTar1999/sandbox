import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Breadcrumb from '../layout/Breadcrumb';
import { DropdownUser } from '../common/dropdowns/DropdownUser';
import Button from '../common/base/Button';
import Alert from '../common/base/Alert';
import BankAccountVerificationModal from '../../modals/BankAccountVerificationModal';
import SmartExchangeLearnMoreModal from '../../modals/SmartExchangeLearnMoreModal';
import SmartExchangeOptInLearnMoreModal from '../../modals/SmartExchangeOptInLearnMoreModal';
import SmartExchangeOptInModal from '../../modals/SmartExchangeOptInModal';

interface HeaderProps {
  userName?: string;
  companyName?: string;
}

const SMART_EXCHANGE_PATH_PREFIX = '/smart-exchange';
const SHOW_SMART_EXCHANGE_SETUP_ALERT = false;

const Header: FC<HeaderProps> = ({
  userName = 'Johnny Anderson',
  companyName = 'Big Kahuna Burger',
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSmartExchangePath = pathname.startsWith(SMART_EXCHANGE_PATH_PREFIX);
  const showSmartExchangeSetupAlert =
    isSmartExchangePath && SHOW_SMART_EXCHANGE_SETUP_ALERT;
  const showSmartExchangeOptInAlert = isSmartExchangePath;
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);
  const [learnMoreModalMode, setLearnMoreModalMode] = useState<
    'deposit-verification' | 'process-payment'
  >('deposit-verification');
  const [optInLearnMoreModalOpen, setOptInLearnMoreModalOpen] = useState(false);
  const [optInModalOpen, setOptInModalOpen] = useState(false);

  const headerClasses = clsx('bg-white px-6 border-b border-gray-200');

  const titleClasses = clsx(
    'text-2xl font-semibold text-gray-900',
    'pt-6 pb-4'
  );

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center">
        <h1 className={titleClasses}>Hello, {userName}</h1>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="lg">
            {companyName}
          </Button>
          <DropdownUser />
        </div>
      </div>
      {showSmartExchangeSetupAlert && (
        <div className="pb-4">
          <Alert
            variant="yellow"
            title="Action Required"
            description="To complete Automatic Card Processing set-up, please confirm the small deposit amount."
            actions={
              <>
                <Button
                  variant="secondary"
                  size="xs"
                  icon="arrow-narrow-right"
                  iconVariant="solid"
                  iconDirection="right"
                  iconClass="!w-3.5 !h-3.5"
                  onClick={() => setVerificationModalOpen(true)}
                >
                  Verify now
                </Button>
                <Button
                  variant="linkSecondary"
                  size="xs"
                  onClick={() => {
                    setLearnMoreModalMode('deposit-verification');
                    setLearnMoreModalOpen(true);
                  }}
                >
                  Learn more
                </Button>
              </>
            }
          />
        </div>
      )}

      {showSmartExchangeOptInAlert && (
        <div className="pb-4">
          <Alert
            variant="blue"
            icon="credit-card-sparkle"
            iconVariant="outline"
            title="Interested in Automated Card Processing?"
            description="Your business may be eligible for Automated Card Processing. Select Opt in to get started."
            actions={
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOptInModalOpen(true)}
                >
                  Opt in
                </Button>
                <Button
                  variant="linkSecondary"
                  size="sm"
                  onClick={() => setOptInLearnMoreModalOpen(true)}
                >
                  Learn more
                </Button>
              </>
            }
          />
        </div>
      )}
      <Breadcrumb />

      <SmartExchangeLearnMoreModal
        open={learnMoreModalOpen}
        mode={learnMoreModalMode}
        onClose={() => setLearnMoreModalOpen(false)}
        onGoToPayments={() => {
          setLearnMoreModalOpen(false);
          navigate('/smart-exchange');
        }}
        onVerifyNow={() => {
          setLearnMoreModalOpen(false);
          setVerificationModalOpen(true);
        }}
      />

      <SmartExchangeOptInLearnMoreModal
        open={optInLearnMoreModalOpen}
        onClose={() => setOptInLearnMoreModalOpen(false)}
      />

      <SmartExchangeOptInModal
        open={optInModalOpen}
        onClose={() => setOptInModalOpen(false)}
        onCloseButton={() => {
          setOptInModalOpen(false);
          navigate('/smart-exchange/payment-preferences', {
            state: { automaticCardProcessing: 'opt-in' },
          });
        }}
        onConfirmed={() => {
          setLearnMoreModalMode('process-payment');
          setLearnMoreModalOpen(true);
        }}
        signerName={userName}
      />

      <BankAccountVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
    </header>
  );
};

export default Header;

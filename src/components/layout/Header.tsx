import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Breadcrumb from '../layout/Breadcrumb';
import { DropdownUser } from '../common/dropdowns/DropdownUser';
import Button from '../common/base/Button';
import Alert from '../common/base/Alert';
import BankAccountVerificationModal from '../../modals/BankAccountVerificationModal';
import SmartExchangeLearnMoreModal from '../../modals/SmartExchangeLearnMoreModal';

interface HeaderProps {
  userName?: string;
  companyName?: string;
}

const SMART_EXCHANGE_PATH_PREFIX = '/smart-exchange';

const Header: FC<HeaderProps> = ({
  userName = 'Johnny Anderson',
  companyName = 'Big Kahuna Burger',
}) => {
  const { pathname } = useLocation();
  const showSmartExchangeAlert = pathname.startsWith(
    SMART_EXCHANGE_PATH_PREFIX
  );
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false);

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
      {showSmartExchangeAlert &&  (
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
                  onClick={() => setLearnMoreModalOpen(true)}
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
        onClose={() => setLearnMoreModalOpen(false)}
        onVerifyNow={() => {
          setLearnMoreModalOpen(false);
          setVerificationModalOpen(true);
        }}
      />

      <BankAccountVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
    </header>
  );
};

export default Header;

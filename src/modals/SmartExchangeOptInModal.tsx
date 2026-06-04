import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import LayoutModal from '../components/common/modal/LayoutModal';
import Button from '../components/common/base/Button';
import Input from '../components/common/base/Input';
import CheckBox from '../components/common/base/CheckBox';
import Icon from '../components/common/base/Icon';
import Badge from '../components/common/base/Badge';
import ContentSeImg from '../assets/image/Content-SE-img-2.svg';

type OptInStep =
  | 'intro'
  | 'review'
  | 'agreement'
  | 'complete'
  | 'delegated-complete'
  | 'delegated-pending';
type AuthorizationChoice = 'authorized' | 'send';
const MODAL_EXIT_MS = 280;

const HOW_IT_WORKS_STEPS = [
  'Continue processing payments manually until set up is complete.',
  "We'll confirm eligibility and initiate one small (micro) deposit into the account the business currently uses to settle card payments (typically deposited in 2-3 business days).",
  'Verify the micro deposit and set up is complete (Opt-out is available).',
];

const AGREEMENT_CONFIRMED_AT = '4/6/2026, 11:53:17 AM';

export type AutomaticCardProcessingConfirmation = {
  signedBy: string;
  confirmedAt: string;
};

export type AutomaticCardProcessingDelegation = {
  delegatedTo: string;
  email: string;
  sentAt: string;
};

interface SmartExchangeOptInModalProps {
  open: boolean;
  onClose: () => void;
  onCloseButton?: () => void;
  onConfirmed?: (details: AutomaticCardProcessingConfirmation) => void;
  onDelegatedPending?: (details: AutomaticCardProcessingDelegation) => void;
  signerName?: string;
}

const ModalShell = ({
  open,
  children,
  footer,
  onClose,
  onCloseButton,
}: {
  open: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  onCloseButton?: () => void;
}) => (
  <LayoutModal open={open}>
    <div className="m-auto grid h-[min(752px,calc(100dvh-6rem))] w-full max-w-[800px] grid-cols-[256px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] gap-2 overflow-hidden rounded-3xl bg-white p-2">
      <div className="min-h-0 overflow-hidden rounded-2xl">
        <img
          src={ContentSeImg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
        <Button
          icon="x"
          size="xl"
          variant="linkSecondary"
          className="absolute right-2 top-2 z-10"
          onClick={onCloseButton ?? onClose}
          aria-label="Close"
        />
        <div className="min-h-0 flex-1 basis-0 overflow-y-auto overscroll-contain px-9 pb-4 pt-9 pr-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 px-9 pb-9 pt-4">{footer}</div>
        ) : null}
      </div>
    </div>
  </LayoutModal>
);

const FooterActions = ({
  primaryLabel,
  primaryDisabled,
  onPrimary,
  onRemindLater,
}: {
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  onRemindLater: () => void;
}) => (
  <div className="flex items-center justify-between">
    <Button size="lg" disabled={primaryDisabled} onClick={onPrimary}>
      {primaryLabel}
    </Button>
    <Button variant="linkSecondary" size="lg" onClick={onRemindLater}>
      Remind me later
    </Button>
  </div>
);

const AgreementSummary = ({
  agreementOpened,
  onReview,
}: {
  agreementOpened: boolean;
  onReview: () => void;
}) => {
  if (agreementOpened) {
    return (
      <div className="mt-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <Icon
            icon="check-circle"
            variant="solid"
            className="h-5 w-5 text-green-500"
          />
          <span className="text-sm font-semibold text-gray-900 leading-5">
            Agreement was opened
          </span>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-gray-700 underline leading-5 cursor-pointer"
          onClick={onReview}
        >
          Review again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <Icon
          icon="globe-alt"
          variant="outline"
          className="mt-0.5 h-5 w-5 text-gray-500"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900 leading-5">
            Visa AR Manager Participation Agreement
          </div>
          <button
            type="button"
            className="mt-1 text-sm font-medium text-blue-600 underline cursor-pointer leading-5"
            onClick={onReview}
          >
            Review agreement
          </button>
        </div>
      </div>
    </div>
  );
};

const AgreementViewer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <LayoutModal open={open}>
    <div className="m-auto flex h-[86vh] w-full max-w-[980px] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          Visa AR Manager Participation Agreement
        </h2>
        <Button
          icon="x"
          size="lg"
          variant="linkSecondary"
          onClick={onClose}
          aria-label="Close agreement"
        />
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mx-auto min-h-full max-w-[860px] rounded border border-gray-200 bg-white p-16 text-gray-900 shadow-sm">
          <div className="mb-8 text-right text-6xl font-semibold italic text-blue-900">
            VISA
          </div>
          <h3 className="text-center text-lg font-medium">
            Visa AR Manager – Online Participation Agreement
          </h3>
          <p className="mt-6 text-xs leading-5">
            PLEASE READ THIS ONLINE PARTICIPATION AGREEMENT. THIS ONLINE
            PARTICIPATION AGREEMENT CONTAINS THE TERMS AND CONDITIONS FOR VISA
            AR MANAGER SERVICES. BY CLICKING ACCEPT OR ACCESSING OR USING THE
            SERVICES, YOU ACKNOWLEDGE THAT YOUR COMPANY HAS REVIEWED AND AGREED
            TO THIS AGREEMENT.
          </p>
          <p className="mt-6 text-xs leading-5">
            This Visa AR Manager Online Participation Agreement is entered into
            by and between Visa U.S.A. Inc. and the undersigned company. Visa
            and Company may each be referred to as a Party and collectively as
            the Parties.
          </p>
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-xs leading-5">
            <li>
              <span className="font-semibold underline">
                Services and Fees.
              </span>{' '}
              Visa AR Manager is a payment processing service that automates the
              retrieval and delivery of Visa-branded virtual card account
              details for Company&apos;s participating customers.
            </li>
            <li>
              <span className="font-semibold underline">
                Term and Termination.
              </span>{' '}
              This Agreement commences on the Effective Date and remains in
              effect until terminated by either Party in accordance with the
              terms of this Agreement.
            </li>
            <li>
              Company will comply with all applicable laws and operational
              requirements related to use of the Services.
            </li>
          </ol>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-200 px-6 py-4">
        <Button variant="secondary" size="lg" onClick={onClose}>
          Close Agreement
        </Button>
      </div>
    </div>
  </LayoutModal>
);

const PendingAgreementStepper = ({
  delegatedName,
}: {
  delegatedName: string;
}) => {
  const steps = [
    {
      id: 1,
      title: 'Pending Agreement Signature',
      subtitle: `Sent - ${AGREEMENT_CONFIRMED_AT}`,
      description:
        'will receive an email with a secure link to review and acknowledge the Visa AR Manager Participation Agreement.',
      state: 'current',
    },
    {
      id: 2,
      title: 'Process Any Card Payment',
      state: 'pending',
    },
    {
      id: 3,
      title: 'Verify Your Bank Account (Penny Test)',
      state: 'pending',
    },
    {
      id: 4,
      title: 'Automatic Card Processing Activated',
      state: 'pending',
    },
  ] as const;

  return (
    <ol className="mt-6 space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = step.state === 'current';

        return (
          <li key={step.id} className="flex gap-3">
            <div className="flex w-5 shrink-0 flex-col items-center">
              <span
                className={clsx(
                  'relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-medium leading-4',
                  isCurrent
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                )}
              >
                {step.id}
              </span>
              {!isLast && (
                <span
                  className={clsx(
                    'w-[1.5px] flex-1 min-h-6',
                    isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                  )}
                  aria-hidden
                />
              )}
            </div>

            <div className={clsx('min-w-0 flex-1', !isLast && 'pb-4')}>
              <div className="text-sm font-semibold leading-5 text-gray-900">
                {step.title}
              </div>
              {'subtitle' in step && step.subtitle && (
                <p className="mt-1 text-sm leading-5 text-gray-700">
                  {step.subtitle}
                </p>
              )}
              {'description' in step && step.description && (
                <p className="mt-2 text-sm leading-5 text-gray-700">
                  {step.id === 1 && (
                    <>
                      <span className="font-medium text-gray-900">
                        {delegatedName}
                      </span>{' '}
                    </>
                  )}
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const SmartExchangeOptInModal: React.FC<SmartExchangeOptInModalProps> = ({
  open,
  onClose,
  onCloseButton,
  onConfirmed,
  onDelegatedPending,
  signerName = 'Johnny Anderson',
}) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [step, setStep] = useState<OptInStep>('intro');
  const [agreementOpened, setAgreementOpened] = useState(false);
  const [authorizationChoice, setAuthorizationChoice] =
    useState<AuthorizationChoice | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [delegatedFirstName, setDelegatedFirstName] = useState('');
  const [delegatedLastName, setDelegatedLastName] = useState('');
  const [delegatedEmail, setDelegatedEmail] = useState('');
  const [delegatedNote, setDelegatedNote] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, MODAL_EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open && !shouldRender) {
      setStep('intro');
      setAgreementOpened(false);
      setAuthorizationChoice(null);
      setFirstName('');
      setLastName('');
      setDelegatedFirstName('');
      setDelegatedLastName('');
      setDelegatedEmail('');
      setDelegatedNote('');
      setIsConfirming(false);
    }
  }, [open, shouldRender]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCloseButton = useCallback(() => {
    if (onCloseButton) {
      onCloseButton();
      return;
    }
    onClose();
  }, [onClose, onCloseButton]);

  const canConfirmAcceptance =
    authorizationChoice === 'authorized' &&
    firstName.trim() !== '' &&
    lastName.trim() !== '';

  const canSendSigningRequest =
    authorizationChoice === 'send' &&
    delegatedFirstName.trim() !== '' &&
    delegatedLastName.trim() !== '' &&
    delegatedEmail.trim() !== '';

  const handleConfirmAcceptance = () => {
    if (!canConfirmAcceptance) return;

    setIsConfirming(true);
    window.setTimeout(() => {
      setIsConfirming(false);
      setStep('complete');
    }, 900);
  };

  const handleSendSigningRequest = () => {
    if (!canSendSigningRequest) return;

    setIsConfirming(true);
    window.setTimeout(() => {
      setIsConfirming(false);
      setStep('delegated-complete');
    }, 900);
  };

  const signedBy = useMemo(() => {
    if (firstName.trim() || lastName.trim()) {
      return `${firstName.trim()} ${lastName.trim()}`.trim();
    }
    return signerName;
  }, [firstName, lastName, signerName]);

  const delegatedName = useMemo(
    () => `${delegatedFirstName.trim()} ${delegatedLastName.trim()}`.trim(),
    [delegatedFirstName, delegatedLastName]
  );

  const handleFinalConfirm = () => {
    onClose();
    onConfirmed?.({
      signedBy,
      confirmedAt: AGREEMENT_CONFIRMED_AT,
    });
  };

  const handleDelegatedPendingConfirm = () => {
    onClose();
    onDelegatedPending?.({
      delegatedTo: delegatedName,
      email: delegatedEmail,
      sentAt: AGREEMENT_CONFIRMED_AT,
    });
  };

  if (!shouldRender) return null;

  if (step === 'agreement') {
    return (
      <AgreementViewer
        open={open}
        onClose={() => {
          setAgreementOpened(true);
          setStep('review');
        }}
      />
    );
  }

  if (step === 'intro') {
    return (
      <ModalShell
        open={open}
        onClose={handleClose}
        onCloseButton={handleCloseButton}
        footer={
          <FooterActions
            primaryLabel="Next"
            onPrimary={() => setStep('review')}
            onRemindLater={handleClose}
          />
        }
      >
        <h2 className="max-w-lg text-3xl font-semibold leading-9 text-gray-900">
          Enable Automatic Card Processing
        </h2>

        <p className="mt-8 max-w-lg text-lg leading-6 text-gray-900">
          Say goodbye to manual card processing. Once enrolled, VISA will
          securely transmit your transactions to the business&apos;s existing
          merchant processor. No more manual work.
        </p>

        <div className="mt-8">
          <h3 className="text-sm font-semibold leading-5 text-gray-900">
            How it works:
          </h3>

          <ol className="mt-4 space-y-4">
            {HOW_IT_WORKS_STEPS.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-medium leading-4 text-gray-800">
                  {index + 1}
                </span>
                <p className="text-sm leading-5 text-gray-900">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </ModalShell>
    );
  }

  if (step === 'complete') {
    return (
      <ModalShell
        open={open}
        onClose={handleClose}
        onCloseButton={handleCloseButton}
        footer={
          <FooterActions
            primaryLabel="Confirm"
            onPrimary={handleFinalConfirm}
            onRemindLater={handleClose}
          />
        }
      >
        <h2 className="text-2xl font-semibold leading-8 text-gray-900">
          Review & Sign Agreement
        </h2>
        <p className="mt-3 text-sm leading-5 text-gray-600">
          Signing the attached agreement allows your company to participate in
          automated card processing through the Visa network.
        </p>

        <div className="mt-9 overflow-hidden rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 p-4 text-sm font-semibold text-gray-900 leading-5">
            Acknowledgement Complete
          </div>
          <dl className="grid grid-cols-2 gap-y-2 p-4 text-sm leading-5">
            <dt className="font-medium text-gray-900">Status</dt>
            <dd>
              <Badge size="sm" color="green" rounded>
                Completed
              </Badge>
            </dd>
            <dt className="font-medium text-gray-900">Signed by</dt>
            <dd className="text-gray-600">{signedBy}</dd>
            <dt className="font-medium text-gray-900">Confirmed at</dt>
            <dd className="text-gray-600">{AGREEMENT_CONFIRMED_AT}</dd>
          </dl>
        </div>
      </ModalShell>
    );
  }

  if (step === 'delegated-complete') {
    return (
      <ModalShell
        open={open}
        onClose={handleClose}
        onCloseButton={handleCloseButton}
        footer={
          <FooterActions
            primaryLabel="Confirm"
            onPrimary={handleDelegatedPendingConfirm}
            onRemindLater={handleClose}
          />
        }
      >
        <h2 className="text-2xl font-semibold leading-8 text-gray-900">
          Review & Sign Agreement
        </h2>
        <p className="mt-3 text-sm leading-5 text-gray-600">
          Signing the attached agreement allows your company to participate in
          automated card processing through the Visa network.
        </p>

        <div className="mt-9 overflow-hidden rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 p-4 text-sm font-semibold leading-5 text-gray-900">
            Waiting for acknowledgement
          </div>
          <dl className="grid grid-cols-[150px_1fr] gap-x-6 gap-y-3 p-4 text-sm leading-5">
            <dt className="font-medium text-gray-900">Status</dt>
            <dd>
              <Badge size="sm" color="blue" rounded>
                In Process
              </Badge>
            </dd>
            <dt className="font-medium text-gray-900">Delegated to</dt>
            <dd className="text-gray-600">{delegatedName}</dd>
            <dt className="font-medium text-gray-900">Email</dt>
            <dd className="break-words text-gray-600">{delegatedEmail}</dd>
            <dt className="font-medium text-gray-900">Send at</dt>
            <dd className="text-gray-600">{AGREEMENT_CONFIRMED_AT}</dd>
          </dl>
          <div className="border-t border-gray-200 p-4 text-sm leading-5 text-gray-700">
            <span className="font-medium text-gray-900">{delegatedName}</span>{' '}
            will receive an email with a secure link to review and acknowledge
            the Visa AR Manager Participation Agreement.
          </div>
        </div>
      </ModalShell>
    );
  }

  if (step === 'delegated-pending') {
    return (
      <ModalShell
        open={open}
        onClose={handleClose}
        onCloseButton={handleCloseButton}
      >
        <h2 className="text-3xl font-semibold leading-9 text-gray-900">
          To enable automatic card processing, complete the steps below.
        </h2>
        <PendingAgreementStepper delegatedName={delegatedName} />
      </ModalShell>
    );
  }

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      onCloseButton={handleCloseButton}
      footer={
        <FooterActions
          primaryLabel="Confirm"
          primaryDisabled
          onPrimary={() => undefined}
          onRemindLater={handleClose}
        />
      }
    >
      <h2 className="text-2xl font-semibold leading-8 text-gray-900">
        Review & Sign Agreement
      </h2>
      <p className="mt-3 text-sm leading-5 text-gray-600">
        Signing the attached agreement allows your company to participate in
        automated card processing through the Visa network.
      </p>

      <AgreementSummary
        agreementOpened={agreementOpened}
        onReview={() => setStep('agreement')}
      />

      {agreementOpened && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-900 leading-5">
            Are you authorized to sign?
          </h3>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <label
              className={clsx(
                'flex cursor-pointer items-center gap-3 p-4',
                authorizationChoice === 'authorized' && 'bg-gray-50'
              )}
            >
              <CheckBox
                type="radio"
                name="authorization-choice"
                checked={authorizationChoice === 'authorized'}
                onChange={() => setAuthorizationChoice('authorized')}
              />
              <span className="text-sm font-medium text-gray-900 leading-5">
                Yes, I am authorized to sign
              </span>
            </label>

            {authorizationChoice === 'authorized' && (
              <div className="space-y-4 border-t border-gray-200 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900 leading-5">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900 leading-5">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-xs leading-4 text-gray-700">
                  Please confirm acceptance of the VISA AR Manager Participation
                  Agreement.
                </div>
                <Button
                  size="md"
                  disabled={!canConfirmAcceptance}
                  onClick={handleConfirmAcceptance}
                >
                  Confirm Acceptance
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <label
              className={clsx(
                'flex cursor-pointer items-center gap-3 p-4',
                authorizationChoice === 'send' && 'bg-gray-50'
              )}
            >
              <CheckBox
                type="radio"
                name="authorization-choice"
                checked={authorizationChoice === 'send'}
                onChange={() => setAuthorizationChoice('send')}
              />
              <span className="text-sm font-medium text-gray-900 leading-5">
                No, send to an authorized signer
              </span>
            </label>

            {authorizationChoice === 'send' && (
              <div className="space-y-4 border-t border-gray-200 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium leading-5 text-gray-900">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter first name"
                    value={delegatedFirstName}
                    onChange={(e) => setDelegatedFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium leading-5 text-gray-900">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter last name"
                    value={delegatedLastName}
                    onChange={(e) => setDelegatedLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium leading-5 text-gray-900">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={delegatedEmail}
                    onChange={(e) => setDelegatedEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium leading-5 text-gray-900">
                    Note
                  </label>
                  <textarea
                    maxLength={100}
                    value={delegatedNote}
                    onChange={(e) => setDelegatedNote(e.target.value)}
                    className="block min-h-[46px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition duration-300 ease-in-out placeholder:text-gray-400 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main"
                  />
                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    Maximum 100 characters
                  </p>
                </div>
                <Button
                  size="md"
                  disabled={!canSendSigningRequest}
                  onClick={handleSendSigningRequest}
                >
                  Send signing request
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      )}
    </ModalShell>
  );
};

export default SmartExchangeOptInModal;

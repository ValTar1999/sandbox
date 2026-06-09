import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Box from '../../components/layout/Box';
import Button from '../../components/common/base/Button';
import Badge from '../../components/common/base/Badge';
import WrapSelect from '../../components/common/base/WrapSelect';
import Icon from '../../components/common/base/Icon';
import Accordion from '../../components/common/dropdowns/Accordion';
import { RefreshButton } from '../../components/common/base/RefreshButton';
import AccountDetails from '../../components/common/modules/AccountDetails';
import CheckboxField from '../../components/common/modules/CheckboxField';
import SmartExchangeOptInModal from '../../modals/SmartExchangeOptInModal';
import GetPaidSubmittedModal from '../../modals/GetPaidSubmittedModal';
import ViewCardDetailsModal from '../../modals/ViewCardDetailsModal';
import { smartExchangePayments } from './data';
import { formatAmountValue } from './utils';
import { ACTIVITY_LOG_ICONS } from './constants';
import {
  INITIAL_DISPUTE_FORM,
  bankAccountOptions,
  paymentMethodOptions,
  type DisputeFormErrors,
  type DisputeFormField,
} from './getPaid/constants';
import {
  getAttachmentMeta,
  getCardholderDetails,
  type AcceptedAttachmentMeta,
} from './getPaid/utils';
import StepMarker from './getPaid/components/StepMarker';
import GetPaidActivityLogDescription from './getPaid/components/GetPaidActivityLogDescription';
import {
  AutomaticCardProcessingBanner,
  AutomaticCardProcessingDelegatedPanel,
  AutomaticCardProcessingStatusPanel,
} from './getPaid/components/AutomaticCardProcessing';
import {
  DisputeAlertRow,
  DisputeDetailsFormModal,
  DisputeThankYouModal,
} from './getPaid/components/DisputeModals';
import SignatureModal from './getPaid/components/SignatureModal';
import DocumentReviewModal from './getPaid/components/DocumentReviewModal';

type GetPaidActivityLogItem = NonNullable<
  (typeof smartExchangePayments)[number]['getPaidActivityLog']
>[number];

const GetPaidPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [showAutomaticCardBanner, setShowAutomaticCardBanner] = useState(true);
  const [automaticCardProcessingOptedIn, setAutomaticCardProcessingOptedIn] =
    useState(false);
  const [automaticCardProcessingSignedBy, setAutomaticCardProcessingSignedBy] =
    useState('');
  const [
    automaticCardProcessingConfirmedAt,
    setAutomaticCardProcessingConfirmedAt,
  ] = useState('');
  const [
    automaticCardProcessingDelegated,
    setAutomaticCardProcessingDelegated,
  ] = useState<{
    delegatedTo: string;
    email: string;
    sentAt: string;
  } | null>(null);
  const [optInModalOpen, setOptInModalOpen] = useState(false);
  const [submitSuccessModalOpen, setSubmitSuccessModalOpen] = useState(false);
  const [cardDetailsModalOpen, setCardDetailsModalOpen] = useState(false);
  const [navigateAfterCardDetailsClose, setNavigateAfterCardDetailsClose] =
    useState(false);
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewDocumentTitle, setReviewDocumentTitle] = useState('');
  const [acceptedAttachments, setAcceptedAttachments] = useState<
    Record<string, AcceptedAttachmentMeta>
  >({});
  const [disputeFormOpen, setDisputeFormOpen] = useState(false);
  const [disputeSuccessOpen, setDisputeSuccessOpen] = useState(false);
  const [paymentDisputed, setPaymentDisputed] = useState(false);
  const [disputedAttachment, setDisputedAttachment] = useState<string | null>(
    null
  );
  const [pendingDisputeAttachment, setPendingDisputeAttachment] = useState<
    string | null
  >(null);
  const [disputeForm, setDisputeForm] = useState(INITIAL_DISPUTE_FORM);
  const [disputeFormErrors, setDisputeFormErrors] = useState<DisputeFormErrors>(
    {}
  );
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureSigned, setSignatureSigned] = useState(false);

  const payment = useMemo(
    () => smartExchangePayments.find((row) => row.id === id),
    [id]
  );

  const cardPaymentForDetails = useMemo(() => {
    if (!payment) {
      return null;
    }
    if (payment.paymentMethod.kind === 'card') {
      return payment;
    }
    return (
      smartExchangePayments.find((row) => row.paymentMethod.kind === 'card') ??
      null
    );
  }, [payment]);

  if (!payment) {
    return (
      <Box className="max-w-7xl mx-auto">
        <div className="p-6 text-red-500">Get Paid item not found.</div>
      </Box>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(payment.dateInitiated));

  const getPaidActivityItems: GetPaidActivityLogItem[] =
    payment.getPaidActivityLog ??
    (payment.activityLog?.[0]
      ? [
          {
            status: payment.activityLog[0].status,
            iconKey: payment.activityLog[0].iconKey,
            title: payment.activityLog[0].title,
            description: `Payment with record number #${payment.invoiceNumber} has been initiated via SMART Exchange on ${formattedDate}`,
            timestamp: `${formattedDate} 10:40 AM (EST)`,
          },
        ]
      : []);

  const attachmentItems =
    payment.attachments && payment.attachments.length > 0
      ? payment.attachments
      : ['invoice_1.pdf', 'photo_1.pdf'];

  const isBankMethod = selectedMethod === 'bank-account';
  const isQuickPayMethod = selectedMethod === 'quick-pay';
  const cardholderDetails = getCardholderDetails(payment);

  const cardLast4 =
    payment.paymentMethod.kind === 'card'
      ? payment.paymentMethod.last4
      : cardPaymentForDetails?.paymentMethod.kind === 'card'
        ? cardPaymentForDetails.paymentMethod.last4
        : '5612';

  const transactionId = `233DFER${payment.id.replace(/-/g, '').toUpperCase()}EV45GT`;

  const handleSubmitGetPaid = () => {
    setSubmitSuccessModalOpen(true);
  };

  const handleSubmitSuccessDone = () => {
    setSubmitSuccessModalOpen(false);

    if (isQuickPayMethod && cardPaymentForDetails) {
      setNavigateAfterCardDetailsClose(true);
      setCardDetailsModalOpen(true);
      return;
    }

    navigate('/smart-exchange');
  };

  const handleCardDetailsClose = () => {
    setCardDetailsModalOpen(false);

    if (navigateAfterCardDetailsClose) {
      setNavigateAfterCardDetailsClose(false);
      navigate('/smart-exchange');
    }
  };
  const allDocumentsAccepted = attachmentItems.every((attachment) =>
    Boolean(acceptedAttachments[attachment])
  );
  const isPaymentMethodReady = isBankMethod
    ? selectedBankAccount !== ''
    : selectedMethod !== '';
  const isSubmitReady =
    !paymentDisputed &&
    allDocumentsAccepted &&
    signatureSigned &&
    isPaymentMethodReady;

  const handleAcceptReview = (attachment: string) => {
    const meta = getAttachmentMeta(attachment);
    setAcceptedAttachments((prev) => ({
      ...prev,
      [attachment]: meta,
    }));
    setReviewModalOpen(false);
  };

  const handleDisputeReview = () => {
    setReviewModalOpen(false);
    setPendingDisputeAttachment(reviewDocumentTitle);
    setDisputeFormOpen(true);
  };

  const handleDisputeFormChange = (field: DisputeFormField, value: string) => {
    setDisputeForm((prev) => ({ ...prev, [field]: value }));
    if (disputeFormErrors[field]) {
      setDisputeFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleDisputeFormCancel = () => {
    setDisputeFormOpen(false);
    setPendingDisputeAttachment(null);
    setDisputeFormErrors({});
  };

  const validateDisputeForm = (): DisputeFormErrors => {
    const errors: DisputeFormErrors = {};
    if (!disputeForm.firstName.trim()) {
      errors.firstName = 'First Name is required.';
    }
    if (!disputeForm.lastName.trim()) {
      errors.lastName = 'Last Name is required.';
    }
    if (!disputeForm.email.trim()) {
      errors.email = 'Email is required.';
    }
    if (!disputeForm.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    }
    return errors;
  };

  const handleDisputeFormSubmit = () => {
    const errors = validateDisputeForm();
    setDisputeFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setDisputeFormOpen(false);
    setDisputeSuccessOpen(true);
  };

  const handleDisputeSuccessDone = () => {
    setDisputeSuccessOpen(false);
    setPaymentDisputed(true);
    setDisputedAttachment(pendingDisputeAttachment);
    setPendingDisputeAttachment(null);
    setDisputeFormErrors({});
  };

  const openReviewModal = (attachment: string) => {
    setReviewDocumentTitle(attachment);
    setReviewModalOpen(true);
  };

  return (
    <Box
      className="max-w-7xl mx-auto"
      footer={
        !paymentDisputed ? (
          <div className="flex w-full justify-end">
            <Button
              size="md"
              disabled={!isSubmitReady}
              onClick={handleSubmitGetPaid}
            >
              Submit and Get Paid
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5">
          <button
            type="button"
            className="inline-flex items-center gap-6 text-lg leading-6 font-medium text-gray-900 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="arrow-left" className="h-6 w-6 text-gray-400" />
            Get Paid
          </button>
          <RefreshButton />
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <div className="text-2xl leading-8 font-bold text-gray-900">
                  {formatAmountValue(payment.amountCents)}
                </div>
                <div className="text-2xl leading-8 text-gray-500">USD</div>
              </div>
              {paymentDisputed ? (
                <Badge
                  icon="exclamation-circle"
                  iconDirection="left"
                  color="red"
                  size="sm"
                >
                  Failed
                </Badge>
              ) : (
                <Badge
                  icon="clock"
                  iconDirection="left"
                  color="yellow"
                  size="sm"
                >
                  Pending Your Action
                </Badge>
              )}
            </div>
            {!paymentDisputed && (
              <Button
                size="md"
                disabled={!isSubmitReady}
                onClick={handleSubmitGetPaid}
              >
                Submit and Get Paid
              </Button>
            )}
          </div>

          <div className="flex items-center divide-x divide-gray-200 rounded-md bg-gray-50 p-4">
            <div className="pr-6 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Date Initiated
              </div>
              <div className="text-base leading-6 font-medium text-gray-700">
                {formattedDate ||
                  format(parseISO(payment.dateInitiated), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="px-6 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Customer
              </div>
              <div className="text-base leading-6 font-medium text-gray-700">
                {payment.customer}
              </div>
            </div>
            <div className="px-6 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Invoice #
              </div>
              <div className="text-base leading-6 font-medium text-gray-700">
                {payment.invoiceNumber}
              </div>
            </div>
          </div>

          <div className="text-base leading-6 pt-10 font-medium text-gray-900 pb-4 border-b border-gray-200">
            Follow these easy steps to Get Paid:
          </div>

          <div className="pt-8 space-y-9 divide-y divide-gray-200">
            <div className="grid grid-cols-[480px_400px] pb-8 gap-4">
              <div className="flex items-start gap-3">
                <StepMarker value={1} />
                <div className="flex flex-col gap-2 text-sm leading-5 font-semibold text-gray-700">
                  <span>Review Documents</span>
                  <div className="font-normal text-gray-500">
                    Please review and accept the documents.
                  </div>
                </div>
              </div>
              <div className="relative rounded-md border border-gray-200 bg-white divide-y divide-gray-200">
                {attachmentItems.flatMap((attachment, index) => {
                  const accepted = acceptedAttachments[attachment];
                  const meta = getAttachmentMeta(attachment);
                  const rows: ReactNode[] = [];

                  if (accepted) {
                    rows.push(
                      <div
                        key={`${attachment}-${index}`}
                        className="flex items-center justify-between p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon="link" className="h-5 w-5 text-gray-500" />
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm font-semibold leading-5 text-gray-900">
                              {accepted.label}
                            </div>
                            <div className="text-xs text-gray-500 leading-4">
                              {accepted.typeLabel} Â· {accepted.sizeLabel}
                            </div>
                          </div>
                        </div>
                        <Icon
                          icon="check"
                          variant="solid"
                          className="h-5 w-5 text-green-500"
                        />
                      </div>
                    );
                  } else {
                    rows.push(
                      <div
                        key={`${attachment}-${index}`}
                        className="flex items-center justify-between p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon="link" className="h-5 w-5 text-gray-500" />
                          <div className="flex flex-col gap-0.5">
                            <div className="text-gray-700 text-sm font-semibold leading-5 text-ellipsis overflow-hidden">
                              {meta.label}
                            </div>
                            <div className="text-xs text-gray-500 leading-4">
                              {meta.typeLabel} Â· {meta.sizeLabel}
                            </div>
                          </div>
                        </div>
                        {!paymentDisputed && (
                          <Button
                            variant="linkPrimary"
                            size="sm"
                            onClick={() => openReviewModal(attachment)}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    );
                  }

                  if (paymentDisputed && disputedAttachment === attachment) {
                    rows.push(
                      <DisputeAlertRow key={`dispute-alert-${attachment}`} />
                    );
                  }

                  return rows;
                })}
              </div>
            </div>

            <div className="grid grid-cols-[480px_400px] pb-8 gap-4">
              <div className="flex items-start gap-3">
                <StepMarker value={2} />
                <div className="flex flex-col gap-2 text-sm leading-5 font-semibold text-gray-700">
                  <span>Signature</span>
                  <div className="font-normal text-gray-500">
                    Please provide signature.
                  </div>
                </div>
              </div>
              <div>
                {signatureSigned ? (
                  <Badge
                    icon="check"
                    iconVariant="solid"
                    iconDirection="left"
                    color="green"
                    size="sm"
                  >
                    Signed
                  </Badge>
                ) : (
                  <Button
                    variant="secondary"
                    iconDirection="left"
                    size="sm"
                    icon="signature"
                    iconVariant="outline"
                    onClick={() => setSignatureModalOpen(true)}
                  >
                    Provide Signature
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[480px_512px] gap-4">
              <div className="flex items-start gap-3">
                <StepMarker value={3} />
                <div className="flex flex-col gap-2 text-sm leading-5 font-semibold text-gray-700">
                  <span>Select Payment Method</span>
                  <div className="font-normal text-gray-500">
                    Please select how you would like to Get Paid.
                  </div>
                </div>
              </div>
              <div>
                <WrapSelect
                  label="Method of Payment"
                  placeholder="Select payment method"
                  options={paymentMethodOptions}
                  selectedValue={selectedMethod}
                  onSelect={(value) => {
                    setSelectedMethod(value);
                    if (value !== 'bank-account') {
                      setSelectedBankAccount('');
                    }
                  }}
                  showSelectedDescription={false}
                />

                {isQuickPayMethod && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-md border border-gray-200 bg-gray-50">
                      <div className="border-b border-gray-200 bg-gray-100 px-4 py-2">
                        <div className="text-sm font-medium leading-5 text-gray-900">
                          Cardholder Details
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm leading-5">
                          <div className="font-medium text-gray-900">
                            Cardholder Name
                          </div>
                          <div className="text-gray-900">
                            {cardholderDetails.name}
                          </div>
                          <div className="font-medium text-gray-900">
                            Cardholder Address
                          </div>
                          <div className="text-gray-900">
                            {cardholderDetails.addressLines.map((line) => (
                              <div key={line}>{line}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {automaticCardProcessingOptedIn ? (
                      <AutomaticCardProcessingStatusPanel
                        signedBy={automaticCardProcessingSignedBy}
                        confirmedAt={automaticCardProcessingConfirmedAt}
                      />
                    ) : automaticCardProcessingDelegated ? (
                      <AutomaticCardProcessingDelegatedPanel
                        delegatedTo={
                          automaticCardProcessingDelegated.delegatedTo
                        }
                        email={automaticCardProcessingDelegated.email}
                        sentAt={automaticCardProcessingDelegated.sentAt}
                      />
                    ) : showAutomaticCardBanner ? (
                      <AutomaticCardProcessingBanner
                        onClose={() => setShowAutomaticCardBanner(false)}
                        onOptIn={() => setOptInModalOpen(true)}
                        onDontShowAgain={() =>
                          setShowAutomaticCardBanner(false)
                        }
                      />
                    ) : null}
                  </div>
                )}

                {isBankMethod && (
                  <div className="mt-4 space-y-4">
                    <WrapSelect
                      placeholder="Select bank account"
                      options={bankAccountOptions}
                      selectedValue={selectedBankAccount}
                      onSelect={setSelectedBankAccount}
                      footerActionLabel="Add new bank account"
                    />

                    {selectedBankAccount && (
                      <>
                        <AccountDetails variant="bank" />
                        <div className="flex flex-col space-y-3">
                          <CheckboxField
                            checked={savePaymentDetails}
                            onChange={(e) =>
                              setSavePaymentDetails(e.target.checked)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                Save payment details
                              </span>
                              <Icon
                                icon="information-circle"
                                className="h-4 w-4 text-gray-400"
                              />
                            </div>
                          </CheckboxField>
                          <CheckboxField
                            checked={setAsDefault}
                            onChange={(e) => setSetAsDefault(e.target.checked)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                Set as default
                              </span>
                              <Icon
                                icon="information-circle"
                                className="h-4 w-4 text-gray-400"
                              />
                            </div>
                          </CheckboxField>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Accordion title="Receivable Summary" className="pt-15">
            <table className="w-full">
              <thead className="border-b border-dashed border-gray-200">
                <tr className="text-gray-500 text-xs tracking-wider uppercase">
                  <th className="font-medium text-left py-2 px-6">item (2)</th>
                  <th className="font-medium text-left py-2 px-6">quantity</th>
                  <th className="font-medium text-right py-2 px-6">
                    unit price
                  </th>
                  <th className="font-medium text-right py-2 px-6">amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-2 text-sm text-left">Services</td>
                  <td className="px-6 py-2 text-sm text-left">1</td>
                  <td className="px-6 py-2 text-sm text-right">
                    {formatAmountValue(payment.amountCents)}{' '}
                    <span className="uppercase text-gray-500">USD</span>
                  </td>
                  <td className="px-6 py-2 text-sm text-right">
                    {formatAmountValue(payment.amountCents)}{' '}
                    <span className="uppercase text-gray-500">USD</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 text-sm text-left">Fees</td>
                  <td className="px-6 py-2 text-sm text-left">1</td>
                  <td className="px-6 py-2 text-sm text-right">
                    $0.00 <span className="uppercase text-gray-500">USD</span>
                  </td>
                  <td className="px-6 py-2 text-sm text-right">
                    $0.00 <span className="uppercase text-gray-500">USD</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Accordion>

          {getPaidActivityItems.length > 0 && (
            <Accordion title="Activity Log" className="" defaultOpen>
              <div className="relative px-6 pl-5">
                <div className="space-y-0">
                  {getPaidActivityItems.map((item, index) => {
                    const icon =
                      ACTIVITY_LOG_ICONS[item.iconKey ?? item.status];
                    const showLine = index < getPaidActivityItems.length - 1;

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex gap-4"
                      >
                        <div className="mt-1 -ml-5 flex flex-shrink-0 flex-col items-center">
                          <Icon
                            icon={icon.icon}
                            variant="solid"
                            className={icon.className}
                          />
                          {showLine && (
                            <div className="my-1 min-h-4 w-0.5 flex-1 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1 pb-6">
                          <div className="text-base font-medium leading-6 text-gray-900">
                            {item.title}
                          </div>
                          <GetPaidActivityLogDescription
                            description={item.description}
                            invoiceNumber={payment.invoiceNumber}
                          />
                          <div className="text-xs font-medium leading-4 text-gray-400">
                            {item.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Accordion>
          )}
        </div>
      </div>
      <DocumentReviewModal
        open={reviewModalOpen}
        title={reviewDocumentTitle}
        customerName={payment.customer}
        onClose={() => setReviewModalOpen(false)}
        onAccept={() => handleAcceptReview(reviewDocumentTitle)}
        onDispute={handleDisputeReview}
      />
      <DisputeDetailsFormModal
        open={disputeFormOpen}
        customerName={payment.customer}
        form={disputeForm}
        errors={disputeFormErrors}
        onClose={handleDisputeFormCancel}
        onCancel={handleDisputeFormCancel}
        onChange={handleDisputeFormChange}
        onSubmit={handleDisputeFormSubmit}
      />
      <DisputeThankYouModal
        open={disputeSuccessOpen}
        onClose={() => setDisputeSuccessOpen(false)}
        onDone={handleDisputeSuccessDone}
      />
      <SignatureModal
        open={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onCancel={() => setSignatureModalOpen(false)}
        onSign={() => {
          setSignatureModalOpen(false);
          setSignatureSigned(true);
        }}
      />
      <SmartExchangeOptInModal
        open={optInModalOpen}
        onClose={() => setOptInModalOpen(false)}
        signerName={cardholderDetails.name}
        onConfirmed={({ signedBy, confirmedAt }) => {
          setOptInModalOpen(false);
          setShowAutomaticCardBanner(false);
          setAutomaticCardProcessingDelegated(null);
          setAutomaticCardProcessingOptedIn(true);
          setAutomaticCardProcessingSignedBy(signedBy);
          setAutomaticCardProcessingConfirmedAt(confirmedAt);
        }}
        onDelegatedPending={({ delegatedTo, email, sentAt }) => {
          setOptInModalOpen(false);
          setShowAutomaticCardBanner(false);
          setAutomaticCardProcessingOptedIn(false);
          setAutomaticCardProcessingDelegated({
            delegatedTo,
            email,
            sentAt,
          });
        }}
      />
      <GetPaidSubmittedModal
        open={submitSuccessModalOpen}
        onClose={() => setSubmitSuccessModalOpen(false)}
        onDone={handleSubmitSuccessDone}
        amountCents={payment.amountCents}
        paymentDate={payment.dateInitiated}
        transactionId={transactionId}
        cardLast4={cardLast4}
        showCardReveal={isQuickPayMethod}
        showProcessingNotice={
          isQuickPayMethod &&
          showAutomaticCardBanner &&
          !automaticCardProcessingOptedIn &&
          !automaticCardProcessingDelegated
        }
        onRevealCardDetails={() => setCardDetailsModalOpen(true)}
      />
      <ViewCardDetailsModal
        open={cardDetailsModalOpen}
        onClose={handleCardDetailsClose}
        payment={cardPaymentForDetails}
      />
    </Box>
  );
};

export default GetPaidPage;

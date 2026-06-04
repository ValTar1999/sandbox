import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
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
import Input from '../../components/common/base/Input';
import LayoutModal from '../../components/common/modal/LayoutModal';
import Modal from '../../components/common/modal/Modal';
import WrapModal from '../../components/common/modal/WrapModal';
import { smartExchangePayments } from './data';

const INITIAL_DISPUTE_FORM = {
  firstName: 'Johnny',
  lastName: 'Anderson',
  company: 'Big Kahuna Burger Ltd',
  email: '',
  phone: '',
  message: '',
};

type DisputeFormState = typeof INITIAL_DISPUTE_FORM;
type DisputeFormField = keyof DisputeFormState;
type DisputeFormErrors = Partial<Record<DisputeFormField, string>>;

const formatAmountValue = (amountCents: number) => {
  const n = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
};

const paymentMethodOptions = [
  {
    label: 'Quick Pay',
    value: 'quick-pay',
    icon: 'credit-card-sparkle',
    iconVariant: 'custom' as const,
    description: 'Receive payment by card, no bank account details required.',
    descriptionPosition: 'below' as const,
    labelLink: 'How this works',
  },
  {
    label: 'Bank Account',
    value: 'bank-account',
    icon: 'library',
    description: 'You can set up more than one account.',
    descriptionPosition: 'below' as const,
  },
];

const bankAccountOptions = [
  {
    label: 'Wells Fargo Account',
    value: 'wells-fargo',
    icon: 'library',
    description: '••••8419',
    descriptionPosition: 'below' as const,
  },
  {
    label: 'Citibank Account',
    value: 'citibank',
    icon: 'library',
    description: '••••3674',
    descriptionPosition: 'below' as const,
  },
];

type AcceptedAttachmentMeta = {
  label: string;
  typeLabel: string;
  sizeLabel: string;
};

const getAttachmentMeta = (filename: string): AcceptedAttachmentMeta => {
  const base = filename.replace(/\.[^.]+$/, '');
  const ext = filename.split('.').pop()?.toUpperCase() ?? 'FILE';
  const sizeMap: Record<string, string> = {
    photo_12432: '980.5 KB',
    photo_1: '980.5 KB',
    invoice_1: '1.3 MB',
    Adjuster_Report: '1.3 MB',
    Adjuster_Report_02: '1.3 MB',
    Card_Authorization: '1.3 MB',
  };
  return {
    label: base,
    typeLabel:
      ext === 'PDF' ? 'PDF' : ext === 'JPG' || ext === 'JPEG' ? 'JPG' : ext,
    sizeLabel: sizeMap[base] ?? '1.3 MB',
  };
};

const DisputeAlertRow = () => (
  <div className="flex items-start gap-3 bg-gray-50 p-4">
    <Icon
      icon="document-cross"
      variant="solid"
      className="h-5 w-5 shrink-0 text-red-500"
    />
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium leading-5 text-red-800">
        Document was disputed
      </div>
      <div className="text-xs leading-4 text-red-700">
        The customer must review the disputed document and resend the payment
        once the issue is resolved.
      </div>
    </div>
  </div>
);

const DisputeDetailsFormModal = ({
  open,
  customerName,
  form,
  errors,
  onClose,
  onCancel,
  onChange,
  onSubmit,
}: {
  open: boolean;
  customerName: string;
  form: DisputeFormState;
  errors: DisputeFormErrors;
  onClose: () => void;
  onCancel: () => void;
  onChange: (field: DisputeFormField, value: string) => void;
  onSubmit: () => void;
}) => (
  <LayoutModal open={open}>
    <Modal
      className="w-full max-w-[596px]"
      title="Dispute Details Form"
      titleClassName="text-3xl leading-9"
      description={`Please provide your information and the reason for your dispute to help <span class="font-medium text-gray-900">${customerName}</span> resolve the issue promptly.`}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-4">
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="lg" onClick={onSubmit}>
            Submit Dispute
          </Button>
        </div>
      }
    >
      <div className="w-full space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
              First Name
            </label>
            <Input
              value={form.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              error={Boolean(errors.firstName)}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
              Last Name
            </label>
            <Input
              value={form.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              error={Boolean(errors.lastName)}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          <Input
            value={form.company}
            onChange={(e) => onChange('company', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              error={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              error={Boolean(errors.phone)}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
          <textarea
            rows={4}
            maxLength={255}
            value={form.message}
            onChange={(e) => onChange('message', e.target.value)}
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 transition duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main"
          />
          <p className="mt-1 text-sm text-gray-500">Maximum 255 characters</p>
        </div>
      </div>
    </Modal>
  </LayoutModal>
);

const DisputeThankYouModal = ({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) => (
  <LayoutModal open={open}>
    <Modal
      className="w-full max-w-[450px]"
      titleCenter
      title="Thank you!"
      description="We have submitted your information to the relevant team who will respond as soon as possible."
      icon={<Icon icon="mail" className="h-11 w-11 text-blue-600" />}
      onClose={onClose}
    >
      <Button size="xl" className="w-full" onClick={onDone}>
        Done
      </Button>
    </Modal>
  </LayoutModal>
);

const SIGNATURE_NAME_PATTERN = /^[a-zA-Z0-9.\\/\\'_:,#&\s-]+$/;
const SIGNATURE_INVALID_CHARS_MESSAGE =
  "You can only use letters, numbers, full stop (.), hyphen (-), forward slash (/), backslash (\\), single quote ('), underscore (_), comma (,), colon (:), hash (#), ampersand (&).";

type SignatureMode = 'draw' | 'type';

const SignatureModal = ({
  open,
  onClose,
  onCancel,
  onSign,
}: {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSign: () => void;
}) => {
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [typedName, setTypedName] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [drawError, setDrawError] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const resetModalState = useCallback(() => {
    setMode('draw');
    setTypedName('');
    setHasDrawn(false);
    setShowHint(false);
    setDrawError(false);
    setFullNameError(null);
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetModalState();
    }
  }, [open, resetModalState]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!open || mode !== 'draw') return;
    setupCanvas();
  }, [open, mode, setupCanvas]);

  const getCanvasPoint = (
    clientX: number,
    clientY: number
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    const point = getCanvasPoint(clientX, clientY);
    const ctx = canvasRef.current?.getContext('2d');
    if (!point || !ctx) return;
    isDrawingRef.current = true;
    setHasDrawn(true);
    setDrawError(false);
    setShowHint(false);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const drawLine = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current) return;
    const point = getCanvasPoint(clientX, clientY);
    const ctx = canvasRef.current?.getContext('2d');
    if (!point || !ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    setupCanvas();
    setHasDrawn(false);
    setDrawError(false);
  };

  const handleModeChange = (nextMode: SignatureMode) => {
    setMode(nextMode);
    setShowHint(false);
    setDrawError(false);
    setFullNameError(null);
  };

  const handleTypedNameChange = (value: string) => {
    setTypedName(value);
    if (fullNameError) {
      setFullNameError(null);
    }
    if (showHint) {
      setShowHint(false);
    }
  };

  const handleSign = () => {
    if (mode === 'type') {
      const trimmed = typedName.trim();
      if (!trimmed) {
        setFullNameError('Full Name is required');
        setShowHint(true);
        return;
      }
      if (!SIGNATURE_NAME_PATTERN.test(trimmed)) {
        setFullNameError(SIGNATURE_INVALID_CHARS_MESSAGE);
        setShowHint(false);
        return;
      }
      onSign();
      return;
    }

    if (!hasDrawn) {
      setDrawError(true);
      setShowHint(true);
      return;
    }

    onSign();
  };

  const signaturePreviewText = typedName.trim();

  return (
    <LayoutModal open={open}>
      <WrapModal
        className="w-full max-w-128"
        onClose={onClose}
        header={
          <span className="text-lg font-medium text-gray-900">Signature</span>
        }
        classContent="px-6 py-5"
        footer={
          <div className="flex justify-end gap-4">
            <Button variant="secondary" size="lg" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSign}>
              Sign
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              className={clsx(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition cursor-pointer',
                mode === 'draw' && 'bg-gray-100'
              )}
              onClick={() => handleModeChange('draw')}
            >
              Draw
            </button>
            <button
              type="button"
              className={clsx(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition cursor-pointer',
                mode === 'type' && 'bg-gray-100'
              )}
              onClick={() => handleModeChange('type')}
            >
              Type
            </button>
          </div>

          {mode === 'draw' ? (
            <div
              className={clsx(
                'relative flex max-h-64 min-h-64 w-full flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-gray-50 p-4',
                drawError ? 'border-red-500' : 'border-gray-200'
              )}
            >
              <Button
                variant="secondary"
                size="xs"
                className="absolute right-4 top-4 z-10"
                onClick={handleClearCanvas}
              >
                Clear
              </Button>
              <div className="relative min-h-0 w-full flex-1">
                <canvas
                  ref={canvasRef}
                  className="block h-full w-full cursor-crosshair touch-none"
                  onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
                  onMouseMove={(e) => drawLine(e.clientX, e.clientY)}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    if (!touch) return;
                    e.preventDefault();
                    startDrawing(touch.clientX, touch.clientY);
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    if (!touch) return;
                    e.preventDefault();
                    drawLine(touch.clientX, touch.clientY);
                  }}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
                  Your Full Name
                </label>
                <Input
                  placeholder="Type here"
                  value={typedName}
                  onChange={(e) => handleTypedNameChange(e.target.value)}
                  error={Boolean(fullNameError)}
                />
                {fullNameError && (
                  <p className="mt-1 text-sm text-red-600">{fullNameError}</p>
                )}
              </div>
              <div className="flex max-h-64 min-h-64 w-full flex-col items-center justify-center gap-4 self-stretch rounded-2xl border border-gray-200 bg-gray-50 p-4">
                {signaturePreviewText ? (
                  <span
                    className="text-center text-4xl text-gray-900"
                    style={{
                      fontFamily:
                        "'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive",
                    }}
                  >
                    {signaturePreviewText}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {showHint && (
            <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3">
              <Icon
                icon="exclamation-circle"
                variant="solid"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              />
              <p className="text-sm leading-5 text-red-700">
                Tap and hold to draw or type in your digital signature.
              </p>
            </div>
          )}
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

const StepMarker = ({ value }: { value: number }) => (
  <span className="flex h-5 w-5 min-w-5 min-h-5 max-w-5 max-h-5 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs leading-4 font-medium text-gray-800">
    {value}
  </span>
);

const DocumentReviewModal = ({
  open,
  title,
  customerName,
  onClose,
  onAccept,
  onDispute,
}: {
  open: boolean;
  title: string;
  customerName: string;
  onClose: () => void;
  onAccept: () => void;
  onDispute: () => void;
}) => {
  const [disputeConfirmOpen, setDisputeConfirmOpen] = useState(false);

  const handleCloseAll = () => {
    setDisputeConfirmOpen(false);
    onClose();
  };

  const handleDisputeConfirm = () => {
    setDisputeConfirmOpen(false);
    onDispute();
  };

  return (
    <LayoutModal open={open}>
      <div className="m-auto flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
          <Button
            icon="x"
            size="lg"
            variant="linkSecondary"
            onClick={handleCloseAll}
            aria-label="Close document review"
          />
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="mx-auto w-full max-w-[560px] rounded border border-gray-200 bg-white p-16 text-gray-700 shadow-sm">
            <h3 className="text-3xl font-semibold text-gray-900">
              Document Title
            </h3>
            <p className="mt-2 text-lg text-gray-500">
              Lorem Ipsum Nice Subtitle
            </p>
            <div className="mt-8 space-y-6 text-lg leading-8">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                venenatis mauris quis arcu vehicula, ac lobortis orci hendrerit.
                Phasellus lectus sem, auctor in lacinia eu, condimentum ac nisl.
              </p>
              <p>
                Vestibulum ut elementum ex, sed fermentum justo. Cras viverra
                libero ut felis rutrum, ac hendrerit sapien varius. Aenean
                venenatis gravida nulla et convallis.
              </p>
              <p>
                Praesent a scelerisque nunc, at auctor elit. Quisque sed tortor
                ipsum. Quisque at nisi scelerisque lectus sollicitudin placerat
                vitae efficitur lacus.
              </p>
            </div>
            <div className="mt-8 text-right text-sm font-medium text-gray-400">
              PAGE 1
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 border-t border-gray-200 px-6 py-4">
          <Button
            variant="secondary"
            size="lg"
            icon="x"
            iconClass="text-red-500"
            iconDirection="left"
            onClick={() => setDisputeConfirmOpen(true)}
          >
            Dispute
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon="check"
            iconDirection="left"
            iconClass="text-green-500"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </div>
      <LayoutModal open={disputeConfirmOpen}>
        <Modal
          className="w-128"
          titleCenter={true}
          title="Dispute Documents"
          description={`Are you sure you want to dispute the documents?<br/><br/>The payment request will be cancelled and you'll need to contact [${customerName}] to receive the payment.`}
          icon={
            <Icon
              icon="exclamation"
              className="-mb-2 -mt-4 h-11 w-11 text-red-500"
            />
          }
          onClose={() => setDisputeConfirmOpen(false)}
          footer={
            <div className="grid grid-cols-2 items-center gap-6">
              <Button
                variant="secondary"
                size="xl"
                className="w-full"
                onClick={() => setDisputeConfirmOpen(false)}
              >
                Go Back
              </Button>
              <Button
                variant="primaryDistructive"
                size="xl"
                className="w-full"
                onClick={handleDisputeConfirm}
              >
                Dispute
              </Button>
            </div>
          }
        />
      </LayoutModal>
    </LayoutModal>
  );
};

const GetPaidPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [saveCardAsDefault, setSaveCardAsDefault] = useState(true);
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

  const attachmentItems =
    payment.attachments && payment.attachments.length > 0
      ? payment.attachments
      : ['invoice_1.pdf', 'photo_1.pdf'];

  const isBankMethod = selectedMethod === 'bank-account';
  const isQuickPayMethod = selectedMethod === 'quick-pay';
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
            <Button size="md" disabled={!isSubmitReady}>
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
              <Button size="md" disabled={!isSubmitReady}>
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
                              {accepted.typeLabel} · {accepted.sizeLabel}
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
                              {meta.typeLabel} · {meta.sizeLabel}
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
                        <div className="text-sm font-medium text-gray-900 leading-5">
                          Card Holder Details
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm leading-5">
                          <div className="font-medium text-gray-900">
                            Name on Card
                          </div>
                          <div className="text-gray-900">
                            {payment.customer}
                          </div>
                          <div className="font-medium text-gray-700">
                            Customer&apos;s Address
                          </div>
                          <div className="text-gray-700">
                            <div>3476 Orphan Road</div>
                            <div>Hayward, WI 54843</div>
                            <div>US</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CheckboxField
                      checked={saveCardAsDefault}
                      onChange={(e) => setSaveCardAsDefault(e.target.checked)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Save and set card as default
                        </span>
                        <Icon
                          icon="information-circle"
                          className="h-3.5 w-3.5 text-gray-400"
                        />
                      </div>
                    </CheckboxField>
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
    </Box>
  );
};

export default GetPaidPage;

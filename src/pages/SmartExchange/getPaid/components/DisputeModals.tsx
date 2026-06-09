import Button from '../../../../components/common/base/Button';
import Icon from '../../../../components/common/base/Icon';
import Input from '../../../../components/common/base/Input';
import LayoutModal from '../../../../components/common/modal/LayoutModal';
import Modal from '../../../../components/common/modal/Modal';
import type {
  DisputeFormErrors,
  DisputeFormField,
  DisputeFormState,
} from '../constants';

export const DisputeAlertRow = () => (
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

export const DisputeDetailsFormModal = ({
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

export const DisputeThankYouModal = ({
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

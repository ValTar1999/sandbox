import Button from '../../../../components/common/base/Button';
import Badge from '../../../../components/common/base/Badge';
import Icon from '../../../../components/common/base/Icon';

export const AutomaticCardProcessingDelegatedPanel = ({
  delegatedTo,
  email,
  sentAt,
}: {
  delegatedTo: string;
  email: string;
  sentAt: string;
}) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
      <Icon
        icon="credit-card-sparkle"
        variant="outline"
        className="h-5 w-5 text-blue-600"
      />
      <h3 className="text-sm font-semibold leading-5 text-gray-900">
        Automatic Card Processing
      </h3>
    </div>
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 text-sm leading-5">
      <dt className="font-medium text-gray-900">Status</dt>
      <dd>
        <Badge size="sm" color="blue">
          In Process
        </Badge>
      </dd>
      <dt className="font-medium text-gray-900">Delegated to</dt>
      <dd className="break-words text-gray-600">{delegatedTo}</dd>
      <dt className="font-medium text-gray-900">Email</dt>
      <dd className="break-words text-gray-600">{email}</dd>
      <dt className="font-medium text-gray-900">Send at</dt>
      <dd className="text-gray-600">{sentAt}</dd>
    </dl>
    <p className="border-t border-gray-200 px-4 py-3 text-sm leading-5 text-gray-500">
      <span className="font-medium text-gray-900">{delegatedTo}</span> will
      receive an email with a secure link to review and acknowledge the Visa AR
      Manager Participation Agreement.
    </p>
  </div>
);

export const AutomaticCardProcessingStatusPanel = ({
  signedBy,
  confirmedAt,
}: {
  signedBy: string;
  confirmedAt: string;
}) => (
  <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
      <Icon
        icon="credit-card-sparkle"
        variant="outline"
        className="h-5 w-5 text-blue-600"
      />
      <h3 className="text-sm font-semibold leading-5 text-gray-900">
        Automatic Card Processing
      </h3>
    </div>
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-sm leading-5">
      <dt className="font-medium text-gray-900">Status</dt>
      <dd>
        <Badge size="sm" color="green">
          Completed
        </Badge>
      </dd>
      <dt className="font-medium text-gray-900">Signed by</dt>
      <dd className="text-gray-600">{signedBy}</dd>
      <dt className="font-medium text-gray-900">Confirmed at</dt>
      <dd className="text-gray-600">{confirmedAt}</dd>
    </dl>
  </div>
);

export const AutomaticCardProcessingBanner = ({
  onClose,
  onOptIn,
  onDontShowAgain,
}: {
  onClose: () => void;
  onOptIn: () => void;
  onDontShowAgain: () => void;
}) => (
  <div className="relative rounded-md border border-blue-200 bg-blue-50 p-4">
    <button
      type="button"
      className="absolute right-3 top-3 cursor-pointer transition-colors hover:text-gray-600"
      onClick={onClose}
      aria-label="Dismiss"
    >
      <Icon icon="x" variant="solid" className="h-3.5 w-3.5 text-gray-400" />
    </button>
    <div className="flex items-start gap-3 pr-5">
      <Icon
        icon="credit-card-sparkle"
        variant="outline"
        className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
      />
      <div className="flex min-w-0 flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold leading-5 text-gray-900">
            Automatic Card Processing
          </h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Automatically process card payments with no manual steps. You can
            opt out anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" size="sm" onClick={onOptIn}>
            Opt in
          </Button>
          <button
            type="button"
            className="cursor-pointer text-sm font-medium leading-5 text-gray-700 transition-colors hover:text-gray-900"
            onClick={onDontShowAgain}
          >
            Don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  </div>
);

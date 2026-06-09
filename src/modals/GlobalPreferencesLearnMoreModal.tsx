import LayoutModal from '../components/common/modal/LayoutModal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';
import GlobalPreferencesBgImg from '../assets/image/Global-Preferences-bg-img-modal.svg';

const SECTIONS = [
  {
    icon: 'globe-alt',
    title: 'Our Network of Payers is Growing',
    description:
      'More companies and financial institutions are enhancing and automating their payment processes, which means more of your customers are likely to start making payments through the Transcard network. By setting your primary, secondary, and third preferred methods of payment, you can ensure seamless payments from all your payers.',
  },
  {
    icon: 'circle-stack',
    title: 'Have a Backup Payment Option',
    description:
      "Sometimes, a second payment option is necessary. For example, if the person signing checks is unavailable, your customer might want to send an electronic payment instead. Life happens - let's be prepared!",
  },
  {
    icon: 'user-check',
    title: 'Can I Customize the Payment Method for a Specific Customer?',
    description:
      "Absolutely. You can set customer-specific payment preferences that differ from your global default settings. These rules can be easily configured in the 'Advanced Settings' tab.",
  },
] as const;

interface GlobalPreferencesLearnMoreModalProps {
  open: boolean;
  onClose: () => void;
}

const GlobalPreferencesLearnMoreModal = ({
  open,
  onClose,
}: GlobalPreferencesLearnMoreModalProps) => (
  <LayoutModal open={open}>
    <div className="m-auto w-full max-w-[640px] overflow-hidden rounded-lg bg-white">
      <div className="relative">
        <img
          src={GlobalPreferencesBgImg}
          alt=""
          className="h-64 w-full object-cover object-center"
        />
        <Button
          icon="x"
          size="xl"
          variant="linkSecondary"
          className="absolute right-5 top-5"
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      <div className="p-12">
        <h2 className="text-3xl font-bold leading-9 text-gray-800">
          Ensure You Get Paid
        </h2>

        <div className="mt-6 space-y-6">
          {SECTIONS.map(({ icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon
                  icon={icon}
                  variant="solid"
                  className="h-5 w-5 text-blue-600"
                />
              </span>
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </LayoutModal>
);

export default GlobalPreferencesLearnMoreModal;

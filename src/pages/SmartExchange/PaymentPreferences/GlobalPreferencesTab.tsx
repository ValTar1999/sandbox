import { useMemo, useState } from 'react';
import Button from '../../../components/common/base/Button';
import WrapSelect from '../../../components/common/base/WrapSelect';
import GlobalPreferencesLearnMoreModal from '../../../modals/GlobalPreferencesLearnMoreModal';
import {
  globalPaymentMethodOptions,
  type GlobalPaymentPreferences,
} from './data';
import { getPreferenceOptionsBySlot } from './utils';

type PreferenceSlot = keyof GlobalPaymentPreferences;

interface GlobalPreferencesTabProps {
  preferences: GlobalPaymentPreferences;
  onChange: (slot: PreferenceSlot, value: string) => void;
}

const StepMarker = ({ value }: { value: number }) => (
  <span className="flex h-5 w-5 min-w-5 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-medium leading-4 text-gray-800">
    {value}
  </span>
);

const preferenceRows: Array<{
  slot: PreferenceSlot;
  step: number;
  placeholder: string;
  label: string;
}> = [
  {
    slot: 'primary',
    step: 1,
    placeholder: 'Select primary method',
    label: 'Primary payment method',
  },
  {
    slot: 'secondary',
    step: 2,
    placeholder: 'Select secondary method',
    label: 'Secondary payment method',
  },
  {
    slot: 'third',
    step: 3,
    placeholder: 'Select third method',
    label: 'Third payment method',
  },
];

const GlobalPreferencesTab = ({
  preferences,
  onChange,
}: GlobalPreferencesTabProps) => {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  const optionsBySlot = useMemo(
    () => getPreferenceOptionsBySlot(preferences, globalPaymentMethodOptions),
    [preferences]
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4">
      <div className="flex flex-col gap-5">
        {preferenceRows.map(({ slot, step, placeholder, label }) => (
          <div key={slot} className="flex items-center gap-4">
            <StepMarker value={step} />
            <div className="min-w-0 flex-1">
              <WrapSelect
                hideLabel
                label={label}
                placeholder={placeholder}
                options={optionsBySlot[slot]}
                selectedValue={preferences[slot]}
                onSelect={(value) => onChange(slot, value)}
                showSelectedDescription
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="w-5 shrink-0" aria-hidden />
        <Button
          variant="linkPrimary"
          size="xs"
          icon="question-mark-circle"
          iconDirection="left"
          iconClass="!w-4 !h-4"
          className="justify-start"
          onClick={() => setLearnMoreOpen(true)}
        >
          Why set multiple payment methods
        </Button>
      </div>

      <GlobalPreferencesLearnMoreModal
        open={learnMoreOpen}
        onClose={() => setLearnMoreOpen(false)}
      />
    </div>
  );
};

export default GlobalPreferencesTab;

import { useMemo } from 'react';
import Button from '../../../components/common/base/Button';
import PayerPreferenceSelect from './PayerPreferenceSelect';
import {
  entityOptions,
  payerOptions,
  payerPaymentMethodOptions,
  type PayerSpecificPreferenceRow,
} from './data';
import { getPreferenceOptionsBySlot } from './utils';

type PaymentSlot = 'primary' | 'secondary' | 'third';

interface PayerPreferenceRowProps {
  row: PayerSpecificPreferenceRow;
  onChange: (
    id: string,
    field: keyof PayerSpecificPreferenceRow,
    value: string
  ) => void;
  onRemove: (id: string) => void;
}

const paymentSlots: Array<{
  slot: PaymentSlot;
  placeholder: string;
  label: string;
}> = [
  {
    slot: 'primary',
    placeholder: 'Select payment method',
    label: 'Primary Method of Payment',
  },
  {
    slot: 'secondary',
    placeholder: 'Select payment method',
    label: 'Secondary Method of Payment',
  },
  {
    slot: 'third',
    placeholder: 'Select payment method',
    label: 'Third Method of Payment',
  },
];

const PayerPreferenceRow = ({
  row,
  onChange,
  onRemove,
}: PayerPreferenceRowProps) => {
  const paymentOptionsBySlot = useMemo(
    () => getPreferenceOptionsBySlot(row, payerPaymentMethodOptions),
    [row]
  );

  return (
    <tr>
      <td className="min-w-0 align-middle px-2 py-2.5">
        <PayerPreferenceSelect
          label="Payer Name"
          placeholder="Select payer"
          options={payerOptions}
          value={row.payerId}
          onChange={(value) => onChange(row.id, 'payerId', value)}
          showIcon={false}
        />
      </td>

      <td className="min-w-0 align-middle px-2 py-2.5">
        <PayerPreferenceSelect
          label="Entity on File with Payer"
          placeholder="Select entity"
          options={entityOptions}
          value={row.entityId}
          onChange={(value) => onChange(row.id, 'entityId', value)}
          dropdownClassName="w-72"
        />
      </td>

      {paymentSlots.map(({ slot, placeholder, label }) => (
        <td key={slot} className="min-w-0 align-middle px-2 py-2.5">
          <PayerPreferenceSelect
            label={label}
            placeholder={placeholder}
            options={paymentOptionsBySlot[slot]}
            value={row[slot]}
            onChange={(value) => onChange(row.id, slot, value)}
            showSelectedDescription
            dropdownClassName="w-[416px]"
          />
        </td>
      ))}

      <td className="w-7 max-w-7 min-w-7 align-middle py-2.5">
        <div className="flex justify-center">
          <Button
            icon="x"
            variant="linkSecondary"
            size="xs"
            className="!p-0"
            onClick={() => onRemove(row.id)}
            aria-label="Remove payer preference"
          />
        </div>
      </td>
    </tr>
  );
};

export default PayerPreferenceRow;

import { useState } from 'react';
import Button from '../../../components/common/base/Button';
import Icon from '../../../components/common/base/Icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/common/base/Tooltip';
import RemoveCustomPaymentPreferenceModal from '../../../modals/RemoveCustomPaymentPreferenceModal';
import PayerPreferenceRow from './PayerPreferenceRow';
import {
  createEmptyPayerPreferenceRow,
  ENTITY_ON_FILE_TOOLTIP,
  getPayerLabel,
  type PayerSpecificPreferenceRow,
} from './data';

interface AdvancedSettingsTabProps {
  rows: PayerSpecificPreferenceRow[];
  savedRows: PayerSpecificPreferenceRow[];
  isCustomizing: boolean;
  onStartCustomize: () => void;
  onRowsChange: (rows: PayerSpecificPreferenceRow[]) => void;
  onCancelCustomize: () => void;
}

const AdvancedSettingsTab = ({
  rows,
  savedRows,
  isCustomizing,
  onStartCustomize,
  onRowsChange,
  onCancelCustomize,
}: AdvancedSettingsTabProps) => {
  const [rowToRemove, setRowToRemove] =
    useState<PayerSpecificPreferenceRow | null>(null);

  const displayRows = rows.length > 0 ? rows : savedRows;
  const showEmptyState = savedRows.length === 0 && !isCustomizing;
  const showTable = isCustomizing || savedRows.length > 0;

  const handleRowChange = (
    id: string,
    field: keyof PayerSpecificPreferenceRow,
    value: string
  ) => {
    onRowsChange(
      displayRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const removeRow = (id: string) => {
    const nextRows = displayRows.filter((row) => row.id !== id);
    onRowsChange(nextRows);

    if (nextRows.length === 0) {
      onCancelCustomize();
    }
  };

  const handleRemoveRow = (id: string) => {
    const row = displayRows.find((item) => item.id === id);
    if (!row) return;

    setRowToRemove(row);
  };

  const handleAddRow = () => {
    onRowsChange([...displayRows, createEmptyPayerPreferenceRow()]);
  };

  return (
    <div className="px-6 pb-6 pt-9">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Customize Default Preferences by Payer
        </h2>
        <p className="mt-2 text-sm leading-5 text-gray-500">
          Global Preferences will remain the same for all other payers.
        </p>
      </div>

      {showEmptyState ? (
        <div className="flex flex-col gap-4 items-center pt-8 pb-2 text-center">
          <p className="text-sm leading-5 text-gray-500">
            No payer specific payment preferences added.
          </p>
          <Button
            size="md"
            icon="plus"
            iconDirection="left"
            onClick={onStartCustomize}
          >
            Customize
          </Button>
        </div>
      ) : null}

      {showTable ? (
        <div className="pt-6">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: 'calc((100% - 1.75rem) * 18 / 94)' }} />
              <col style={{ width: 'calc((100% - 1.75rem) * 22 / 94)' }} />
              <col style={{ width: 'calc((100% - 1.75rem) * 18 / 94)' }} />
              <col style={{ width: 'calc((100% - 1.75rem) * 18 / 94)' }} />
              <col style={{ width: 'calc((100% - 1.75rem) * 18 / 94)' }} />
              <col style={{ width: '1.75rem' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-2 py-2.5 text-left text-xs font-medium leading-4 text-gray-500">
                  Payer Name
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-medium leading-4 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    Entity on File with Payer
                    <Tooltip trigger="hover" placement="top" arrow>
                      <TooltipTrigger
                        as="span"
                        className="inline-flex cursor-help"
                      >
                        <Icon
                          icon="information-circle"
                          className="h-3.5 w-3.5 text-gray-400 hover:text-gray-900"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="max-w-xs bg-gray-900 p-3 text-white"
                        arrowClassName="fill-gray-900"
                      >
                        {ENTITY_ON_FILE_TOOLTIP}
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-medium leading-4 text-gray-500">
                  Primary Method of Payment
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-medium leading-4 text-gray-500">
                  Secondary Method of Payment
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-medium leading-4 text-gray-500">
                  Third Method of Payment
                </th>
                <th className="w-7 max-w-7 min-w-7 px-0 py-2.5">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="border-b border-gray-200 divide-y divide-gray-200 last:border-b-0">
              {displayRows.map((row) => (
                <PayerPreferenceRow
                  key={row.id}
                  row={row}
                  onChange={handleRowChange}
                  onRemove={handleRemoveRow}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-start py-5">
            <Button
              variant="linkPrimary"
              size="xs"
              icon="plus"
              iconClass="!w-3.5 !h-3.5"
              iconDirection="left"
              onClick={handleAddRow}
            >
              Customize another payer
            </Button>
          </div>
        </div>
      ) : null}

      <RemoveCustomPaymentPreferenceModal
        open={rowToRemove !== null}
        payerName={
          rowToRemove
            ? getPayerLabel(rowToRemove.payerId) || '[Payer Name]'
            : ''
        }
        onClose={() => setRowToRemove(null)}
        onConfirm={() => {
          if (rowToRemove) {
            removeRow(rowToRemove.id);
          }
          setRowToRemove(null);
        }}
      />
    </div>
  );
};

export default AdvancedSettingsTab;

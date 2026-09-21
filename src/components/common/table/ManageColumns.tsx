import { useState } from 'react';
import Button from '../base/Button';
import ManageColumnsModal, {
  type ManageColumnConfig,
  type ManageColumnDefinition,
} from '../../../modals/ManageColumnsModal';

export type { ManageColumnConfig, ManageColumnDefinition };

type ManageColumnsProps = {
  value: ManageColumnConfig[];
  defaultColumns: ManageColumnConfig[];
  getColumnDefinition: (id: string) => ManageColumnDefinition;
  description?: string;
  onApply?: (columns: ManageColumnConfig[]) => void;
};

/**
 * Reusable Manage columns control: trigger button + modal.
 * Pass page-specific column defs so the list matches that table.
 */
export const ManageColumns = ({
  value,
  defaultColumns,
  getColumnDefinition,
  description = 'Choose which columns appear in the table.',
  onApply,
}: ManageColumnsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="md"
        variant="secondary"
        icon="adjustments-horizontal"
        iconVariant="outline"
        title="Manage columns"
        onClick={() => setOpen(true)}
      />
      <ManageColumnsModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        defaultColumns={defaultColumns}
        getColumnDefinition={getColumnDefinition}
        description={description}
        onApply={onApply}
      />
    </>
  );
};

export default ManageColumns;

import Button from '../base/Button';
import Menu from '../base/Menu';
import MenuCloseItem from '../base/MenuCloseItem';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: 'csv', label: 'CSV (.csv)' },
  { format: 'json', label: 'JSON (.json)' },
  { format: 'xlsx', label: 'Excel (.xlsx)' },
  { format: 'pdf', label: 'PDF (.pdf)' },
];

type ExportMenuProps = {
  onExport: (format: ExportFormat) => void;
};

/** Reusable Export dropdown used next to Filter / Manage columns. */
export const ExportMenu = ({ onExport }: ExportMenuProps) => (
  <Menu.Root placement="bottom-start">
    <Menu.Trigger asChild>
      <Button
        size="md"
        variant="secondary"
        icon="arrow-up-tray"
        iconDirection="right"
      >
        Export
      </Button>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner className="z-50">
        <Menu.Popup className="min-w-20 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-dropdown">
          {EXPORT_OPTIONS.map(({ format, label }) => (
            <MenuCloseItem
              key={format}
              className="px-4 py-2.5 text-sm leading-5 font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => onExport(format)}
            >
              {label}
            </MenuCloseItem>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

export default ExportMenu;

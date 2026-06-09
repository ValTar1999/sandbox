import clsx from 'clsx';
import Button from '../../../../components/common/base/Button';
import Menu from '../../../../components/common/base/Menu';
import MenuCloseItem from '../../../../components/common/base/MenuCloseItem';
import { TH_TEXT_CLASS, FLEX_START } from '../../../../constants/tableStyles';

const FilterColumnHeader = ({ label }: { label: string }) => (
  <div className={clsx('flex items-center gap-1', FLEX_START)}>
    <div className={TH_TEXT_CLASS}>{label}</div>
    <Menu.Root placement="bottom-end">
      <Menu.Trigger as="span">
        <Button icon="filter" size="xs" variant="linkSecondary" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="z-50 min-w-32 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <MenuCloseItem>All</MenuCloseItem>
            <MenuCloseItem>Clear filters</MenuCloseItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
);

export default FilterColumnHeader;

import { format } from 'date-fns';
import { Dropdown } from './Dropdown';
import Button from '../base/Button';
import Icon from '../base/Icon';

interface DropdownCalendarProps {
  dueDate: string;
  onSelectDate: (date: string | null) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  notification?: boolean;
  handleChooseDataClick: () => void;
}

const scheduleOptions = (dueDate: string) => [
  { label: 'Tomorrow morning', date: new Date(2025, 7, 5, 9, 0) },
  { label: 'Monday morning', date: new Date(2025, 7, 10, 9, 0) },
  { label: 'Due date', date: dueDate ? new Date(dueDate) : new Date() },
];

const DropdownCalendar = ({ dueDate, onSelectDate, selectedIndex, setSelectedIndex, notification }: DropdownCalendarProps) => {
  return (
    <Dropdown
      trigger={
        <div className="relative">
          {notification && (
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-smart-main"></div>
          )}
          <Button size="md" iconVariant="outline" variant="gray" icon="calendar" />
        </div>
      }
      menu={({ closeDropdown }) => (
        <div className="w-90 py-1">
          {scheduleOptions(dueDate).map((option, index) => (
            <div
              key={option.label}
              className={`flex justify-between text-sm font-medium items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
                selectedIndex !== null && index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                setSelectedIndex(index);
                onSelectDate(format(option.date, "yyyy-MM-dd hh:mm a"));
                closeDropdown();
              }}
            >
              <div>{option.label}</div>
              <div className="flex items-center">
                <div className="text-gray-500">{format(option.date, 'MMM dd, hh:mm a')}</div>
                {selectedIndex !== null && index === selectedIndex && <Icon className="text-green-600 w-5 h-5 ml-2" icon="check" />}
              </div>
            </div>
          ))}
          <div className="flex flex-col border-t border-gray-200">
            <button 
              onClick={() => handleChooseDataClick()}
              className="flex px-4 py-2 text-smart-main cursor-pointer text-sm font-medium hover:bg-gray-50 transition-all duration-300"
            >
              Choose another date
            </button>
            {selectedIndex !== null && (
              <button
                className="flex px-4 py-2 text-red-600 cursor-pointer text-sm font-medium hover:bg-gray-50 transition-all duration-300"
                onClick={() => {
                  onSelectDate(null);
                  setSelectedIndex(null);
                  closeDropdown();
                }}
              >
                Cancel schedule
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default DropdownCalendar;
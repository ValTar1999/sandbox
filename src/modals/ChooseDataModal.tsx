import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import Calendar from "../component/modules/Calendar";
import { format } from 'date-fns';
import Icon from '../component/base/Icon';

interface ChooseDataModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  dueDate: string;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  onSelectDate: (date: string | null) => void;
}

const ChooseDataModal: React.FC<ChooseDataModalProps> = ({ open, onClose, onConfirm, dueDate, selectedIndex, setSelectedIndex, onSelectDate }) => {
  if (!open) return null;

  const scheduleOptions = [
    { label: 'Tomorrow morning', date: new Date(2025, 7, 5, 9, 0) },
    { label: 'Monday morning', date: new Date(2025, 7, 10, 9, 0) },
    { label: 'Due date', date: dueDate ? new Date(dueDate) : new Date() },
  ];

  const handleOptionClick = (index: number) => {
    setSelectedIndex(index);
    onSelectDate(format(scheduleOptions[index].date, "yyyy-MM-dd hh:mm a"));
  };

  return (
    <LayoutModal>
      <WrapModal
        className="w-128"
        onClose={onClose}
        header={
          <div>Schedule for Later</div>
        }
        footer={
          <div className="flex items-center justify-end gap-6">
            <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
            <Button size="lg" onClick={() => onConfirm(format(scheduleOptions[selectedIndex!].date, "yyyy-MM-dd hh:mm a"))}>Select</Button>
          </div>
        }
      >
        <Calendar/>
        <div className="grid gap-6 px-6 py-4">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <div className="grid gap-1 text-xs">
              <div className="font-semibold text-gray-900">Schedule Timing</div>
              <div className="text-xs text-gray-500">Please note that all scheduled payments will be submitted on selected date starting from 9 AM (ET).</div>
            </div>
          </div>
        </div>
        <div className="grid px-2">
          <div className="border-t border-gray-200 px-4 py-4 text-lg font-medium">Recommended</div>
          <div className="pb-6">
            {scheduleOptions.map((option, index) => (
              <div
                key={option.label}
                className={`flex justify-between items-center text-sm font-medium px-4 py-2 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
                  selectedIndex !== null && index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleOptionClick(index)}
              >
                <div>{option.label}</div>
                <div className="flex items-center">
                  <div className="text-gray-500">{format(option.date, 'MMM dd, hh:mm a')}</div>
                  {selectedIndex !== null && index === selectedIndex && (
                    <Icon icon="check" className="text-green-600 ml-2"/>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default ChooseDataModal;
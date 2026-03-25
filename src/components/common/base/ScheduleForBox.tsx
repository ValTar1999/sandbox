import Button from "./Button";
import Icon from "./Icon";

const ScheduleForBox = ({
  selectedDate,
  onClear,
}: {
  selectedDate: string | null;
  onClear: () => void;
}) => {
  if (!selectedDate) return null;
  return (
    <div className="flex justify-end">
      <div className="text-sm font-semibold inline-flex">
        <div className="px-2 flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-300 rounded-l-md">
          <Icon className="w-4.5 h-4.5" icon="calendar" variant="outline" />
          <span>Schedule for:</span>
        </div>
        <div className="flex items-center border-y border-r border-gray-200 rounded-r-md">
          <span className="text-blue-600 pl-2">{selectedDate}</span>
          <Button
            size="sm"
            icon="x"
            variant="add_on"
            onClick={onClear}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleForBox;

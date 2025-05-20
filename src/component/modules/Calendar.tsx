import React from 'react';
import clsx from 'clsx';
import Button from '../base/Button';

type TDay = {
  date: string;
  due?: boolean;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startDate?: string;
  endDate?: string;
  month?: number;
  today?: string;
  selected?: string;
  due?: string;
  date?: string;
}

const generateDates = (
  startDate: string,
  endDate: string,
  month: number,
  today: string,
  selected: string,
  due: string
): TDay[] => {
  const dates: TDay[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const day: TDay = {
      date: dateStr,
      isCurrentMonth: currentDate.getMonth() + 1 === month,
    };
    if (dateStr === today) day.isToday = true;
    if (dateStr === selected) day.isSelected = true;
    if (dateStr === due) day.due = true;
    dates.push(day);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const Calendar: React.FC<Props> = ({
  startDate,
  endDate,
  month,
  today,
  selected,
  due,
  date = 'August 2023',
  className,
  ...props
}) => {
  const daysConfig1 = {
    startDate: '2023-07-27',
    endDate: '2023-09-06',
    month: 8, // August
    today: '2023-08-04',
    due: '2023-08-13',
  };

  const actualStartDate = startDate || daysConfig1.startDate;
  const actualEndDate = endDate || daysConfig1.endDate;
  const actualMonth = month || daysConfig1.month;
  const actualToday = today || daysConfig1.today;
  const actualDue = due || daysConfig1.due;
  const actualSelected = selected || actualToday;

  const days = generateDates(
    actualStartDate,
    actualEndDate,
    actualMonth,
    actualToday,
    actualSelected,
    actualDue
  );

  return (
    <div className={clsx("w-full text-center", className)} {...props}>
      <div className="flex items-center border-b border-gray-200 px-6 py-2 text-gray-900">
        <div className="flex items-center">
          <Button iconVariant="bicolor" icon="angle-double-left" size="lg" variant="linkSecondary" />
          <Button iconVariant="bicolor" icon="angle-left" size="lg" variant="linkSecondary" />
        </div>
        <div className="flex-auto text-base font-semibold">{date}</div>
        <div className="flex items-center">
          <Button iconVariant="bicolor" icon="angle-right" size="lg" variant="linkSecondary" />
          <Button iconVariant="bicolor" icon="angle-double-right" size="lg" variant="linkSecondary" />
        </div>
      </div>

      <div className="mx-6 mt-6 grid grid-cols-7 text-sm leading-6 text-gray-500">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mx-6 mt-2 grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            className={clsx(
              "py-1.5 hover:bg-gray-100 focus-visible:z-10 cursor-pointer transition-colors duration-300",
              day.isCurrentMonth ? "bg-white text-gray-900" : "bg-gray-50 text-gray-400",
              day.isToday && "text-smart-main"
            )}
          >
            <time
              dateTime={day.date}
              className={clsx(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full font-medium",
                day.isSelected && "bg-smart-main text-white"
              )}
            >
              {new Date(day.date).getDate()}
            </time>
            {day.due && <div className="-mb-2 -mt-2 text-[7px] font-semibold text-red-500">DUE DATE</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

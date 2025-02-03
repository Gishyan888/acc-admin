import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isWithinInterval,
  isSameDay,
} from "date-fns";

const DatePickerWithRange = ({
  range,
  setRange,
  mainBgColor,
  mainTextColor,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => {
    if (!range.start || range.end) {
      setRange({ start: date, end: null });
    } else {
      if (date < range.start) {
        setRange({ start: date, end: range.start });
      } else {
        setRange((prev) => ({ ...prev, end: date }));
      }
    }
  };

  const isInRange = (date) =>
    range.start &&
    range.end &&
    isWithinInterval(date, { start: range.start, end: range.end });

  const isSelected = (date) =>
    isSameDay(date, range.start) || isSameDay(date, range.end);

  return (
    <div
      className={`w-80 ${
        mainBgColor ?? "bg-blue-100"
      }  rounded-md shadow-md p-8`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2
          className={`text-xl font-bold ${mainTextColor ?? "text-blue-800"} `}
        >
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={handleNextMonth}>
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center">
        {daysInMonth.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 m-1 rounded cursor-pointer flex justify-center items-center ${
              isSelected(day)
                ? "bg-blue-500 text-white"
                : isInRange(day)
                ? `${mainBgColor ?? "bg-gray-200"}`
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleDateClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePickerWithRange;

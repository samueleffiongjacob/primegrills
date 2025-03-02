import { useState, useEffect } from "react";

const Calendar = () => {
  // Define the state types explicitly
  const [currentDate] = useState<Date>(new Date()); // Removed `setCurrentDate` as it's not in use
  const [daysInMonth, setDaysInMonth] = useState<(number | null)[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Get the first day of the month (0 = Sunday)
    const totalDays = new Date(year, month + 1, 0).getDate(); // Get the total days in the month

    // Create an array representing the calendar grid
    const daysArray: (number | null)[] = Array(firstDay).fill(null).concat(
      Array.from({ length: totalDays }, (_, i) => i + 1)
    );
    setDaysInMonth(daysArray);
  }, [currentDate]);

  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth();

  return (
    <div className="bg-[#343434] max-h-[400px] h-full mb-2 rounded-4xl pt-8 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4 mx-4">
        <h2 className="text-white text-xl font-semibold">Calendar</h2>
        <button className="text-white text-xl font-semibold hover:underline">
          View
        </button>
      </div>
      <div className="bg-white rounded-4xl p-4 h-full shadow-lg flex flex-col">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        <div className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden flex-1">
          {/* Days of the week */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-gray-200 text-gray-700 font-medium py-2 text-center border-b border-gray-300"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day, index) => (
            <div
              key={index}
              className={`border border-gray-300 flex items-center justify-center text-gray-900 font-medium cursor-pointer transition h-auto w-full
                ${
                  day === today.getDate() && isCurrentMonth
                    ? "bg-blue-500 text-white" // Highlight current day
                    : "hover:bg-gray-200"
                } ${day === null ? "bg-gray-100" : ""}`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

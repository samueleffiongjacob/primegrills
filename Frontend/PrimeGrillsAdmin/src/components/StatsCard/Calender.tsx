import { useState, useEffect } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Get first day of the month (0 = Sunday)
    const totalDays = new Date(year, month + 1, 0).getDate(); // Get total days in the month

    // Create an array representing the calendar grid
    const daysArray = Array(firstDay).fill(null).concat([...Array(totalDays).keys()].map((d) => d + 1));
    setDaysInMonth(daysArray);
  }, [currentDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

  return (
    <div className="bg-[#343434] max-h-[300px] mb-2 rounded-4xl pt-8 p-2 flex flex-col">
      <div className="flex justify-between items-center mb-4 mx-2">
        <h2 className="text-white text-xl font-semibold">Calendar</h2>
        <button className="text-white text-xl font-semibold hover:underline">View</button>
      </div>
      <div className="bg-white max-h-[200px] rounded-4xl p-4 shadow-lg flex flex-col">
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

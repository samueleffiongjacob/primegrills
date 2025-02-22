const Calendar = () => {
  return (
    <div className="bg-[#343434] max-h-[300px] mb-2 rounded-4xl pt-8 p-2 flex flex-col">
      <div className="flex justify-between items-center mb-4 mx-2">
        <h2 className="text-white text-xl font-semibold">Calendar</h2>
        <button className="text-white text-xl font-semibold hover:underline">View</button>
      </div>
      <div className="bg-white max-h-[200px] rounded-4xl p-4 shadow-lg flex flex-col">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">January 2025</h3>
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
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i + 1}
              className="border border-gray-300 flex items-center justify-center text-gray-900 font-medium cursor-pointer hover:bg-gray-100 transition h-auto"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

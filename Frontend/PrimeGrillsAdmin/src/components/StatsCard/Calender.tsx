const Calendar = () => {
    return (
      <div className="bg-white rounded-4xl p-4 shadow">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">January 2025</h3>
        </div>
        <div className="grid grid-cols-7 border border-gray-300 rounded-3xl">
          {/* Days of the week */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="border border-gray-300 bg-gray-100 text-gray-700 font-medium py-2"
            >
              {day}
            </div>
          ))}
  
          {/* Calendar days */}
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i + 1}
              className="border border-gray-300 aspect-square flex items-center justify-center text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Calendar;
  
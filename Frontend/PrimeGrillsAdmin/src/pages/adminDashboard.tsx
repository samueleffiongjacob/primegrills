import StatsGrid from "../components/StatsCard/StatsCard";
import Chart from "../components/StatsCard/lineChart";
import Calendar from "../components/StatsCard/Calender";

const Dashboard = () => {
  return (
    <div>
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 bg-[#343434] rounded-xl p-6">
          <Chart />
        </div>
        <div className="bg-[#343434] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">Calendar</h2>
            <button className="text-white">View</button>
          </div>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

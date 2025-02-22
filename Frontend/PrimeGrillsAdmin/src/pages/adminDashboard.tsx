import StatsGrid from "../components/StatsCard/StatsCard";
import Chart from "../components/StatsCard/lineChart";
import Calendar from "../components/StatsCard/Calender";

const Dashboard = () => {
  return (
    <div className=" min-h-screen  overflow-y-auto grid flex-col w-4/5">
      <StatsGrid />
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 h-[300px] bg-[#343434]  rounded-xl p-6">
          <Chart />
        </div>
        <div className="h-[400px] ">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

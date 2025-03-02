import StatsGrid from "../components/StatsCard/StatsCard";
import Chart from "../components/StatsCard/lineChart";
import Calendar from "../components/StatsCard/Calender";

const Dashboard = () => {
  return (
    <div className="max-h-[90vh] overflow-y-auto grid flex-col">
      <StatsGrid />
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
       <div className="lg:col-span-2 min-h-[400px] bg-[#343434]  rounded-xl p-6">
          <Chart />
        </div>
        <div className="">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

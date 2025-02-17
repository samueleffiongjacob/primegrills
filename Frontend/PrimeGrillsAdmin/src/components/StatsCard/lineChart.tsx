import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          stepSize: 250, // Ensure that every label is displayed
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          display: false, // Hides the numbers on the Y-axis
        },
      },
    },
  };

  const data = {
    labels: ["250", "500", "750","1000","1250","1500","1750","2000","2250","2500"], // Explicit X-axis labels
    datasets: [
      {
        data: [100, 300, 200, 500, 400,500,450,500,550,600], // Rising and falling data
        borderColor: "#ee7f61",
        tension: 0.4,
      },
      {
        data: [50, 70, 150, 450, 600,700,450, 200,300,300], // Another dataset with rising and falling data
        borderColor: "#1976d2",
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default Chart;

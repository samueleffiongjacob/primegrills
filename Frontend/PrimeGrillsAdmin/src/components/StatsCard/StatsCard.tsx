import money1 from "../../assets/images/money1.png";
import money2 from "../../assets/images/money2.png";
import client from "../../assets/images/client.png";

interface StatsCardProps {
  title: string;
  value: string;
  linkText: string;
  bgStyle: React.CSSProperties;
}

const StatsCard = ({ title, value, linkText, bgStyle }: StatsCardProps) => {
  const renderImage = (title: string) => {
    if (title === "Weekly Balance") {
      return (
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-20 h-20">
          <img src={money1} alt={title} className="w-full h-full object-contain" />
        </div>
      );
    }

    if (title === "Orders In Line") {
      return (
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center">
          <img
            src={money2}
            alt={`${title} Rotated`}
            className="w-16 h-16 object-contain rotate-[-40.49deg]"
          />
          <img src={money2} alt={title} className="w-16 h-16 object-contain -ml-10" />
        </div>
      );
    }

    if (title === "New Clients") {
      return (
        <div className="absolute right-4 bottom-4 w-20 h-20 z-50">
          <img src={client} alt={title} className="w-full h-full object-contain" />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="rounded-3xl p-6 relative z-10 mt-5 shadow-md overflow-hidden"
      style={bgStyle}
    >
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-4xl font-bold text-[#ee7f61] mb-4">{value}</p>
        <a href="#" className="text-sm text-gray-600 hover:underline">
          {linkText}
        </a>
      </div>
      {renderImage(title)}
    </div>
  );
};

const StatsGrid = () => {
  const stats = [
    {
      title: "Weekly Balance",
      value: "$5M",
      linkText: "View Entire List",
      bgStyle: {
        background: "linear-gradient(101.21deg, #96BDD9 5%, #4F6473 99.06%)",
      },
    },
    {
      title: "Orders In Line",
      value: "800",
      linkText: "View Entire List",
      bgStyle: {
        background: "linear-gradient(106.79deg, #D9CF96 -3.14%, #736D4F 89.23%)",
      },
    },
    {
      title: "New Clients",
      value: "800",
      linkText: "View Entire List",
      bgStyle: {
        background: "linear-gradient(96.61deg, #909777 14.1%, #2F3127 116.23%)",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 py-2 px-3">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          linkText={stat.linkText}
          bgStyle={stat.bgStyle}
        />
      ))}
    </div>
  );
};

export default StatsGrid;

import {
  LayoutDashboard,
  Menu,
  Package,
  User,
  Mail,
  ShoppingCart,
  Calendar,
  Users,
  Settings,
  FileBarChart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/primeLogo.png";

const SidebarLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center  gap-3 px-4 py-2 rounded-lg transition-colors duration-300 ${
        isActive ? "text-[#EE7F61] bg-[#2C2F55]" : "hover:text-[#EE7F61]"
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
      {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-[#EE7F61] rounded-r-lg" />}
    </Link>
  );
};

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/menu", icon: Menu, label: "Menu" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/user", icon: User, label: "User" },
  { to: "/message", icon: Mail, label: "Message" },
  { to: "/pos", icon: ShoppingCart, label: "POS" },
  { to: "/paypoints", icon: Calendar, label: "PayPoints" },
  { to: "/category", icon: Users, label: "Category" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/report", icon: FileBarChart, label: "Report" },
];

const Sidebar = () => {
  return (
    <aside className="w-[250px] overflow-y-auto max-h-screen scroll-smooth bg-[#171943] text-white p-6">
      <div className="mb-8">
        <img
          src={logo}
          alt="Prime Grills & Cafe"
          width={100}
          height={40}
          className="mx-auto"
        />
      </div>

      <nav className="space-y-6">
        {navItems.map((item) => (
          <SidebarLink key={item.label} to={item.to} icon={item.icon}>
            {item.label}
          </SidebarLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  X
} from "lucide-react";
import logo from "../../assets/images/primeLogo.png";
import { useAuth } from "../../context/authContext";


interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  icon: React.ElementType;
  collapsed: boolean;
}

const SidebarLink = ({ to, children, icon: Icon, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const {user} = useAuth()
  
  // Mock user role 
  const userRole = user.staff_profile.role; 
  const allRoles = ["admin", "accountant", "waiter", "cleaner", "kitchen", 'manager'];


  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 relative ${
        isActive ? "text-[#EE7F61] bg-[#2C2F55]" : "hover:text-[#EE7F61]"
      }`}
    >
      <Icon size={20} />
      {!collapsed && <span>{children}</span>}
      {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-[#EE7F61] rounded-r-lg" />}
    </Link>
  );
};

interface navItems {
  to: string;
  icon: React.ElementType;
  label: string;
  
}

// Define navigation items - sort what items each role sees
const navItems = [
  { to: "/profile", icon: Users, label: "Profile", roles: [ "cleaner", "waiter", "kitchen"] },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "accountant", 'manager' ] },
  { to: "/category", icon: Users, label: "Category", roles: ["admin", "accountant" ] },
  { to: "/menu", icon: Package, label: "Menu", roles: allRoles },
  { to: "/staff", icon: User, label: "Staff", roles: allRoles},
  { to: "/orders", icon: ShoppingCart, label: "Order", roles: ["admin", "accountant", "kitchen"]},
  { to: "/message", icon: Mail, label: "Message", roles: allRoles },
  { to: "/pos", icon: ShoppingCart, label: "POS", roles: ["admin", "accountant"] },
  { to: "/paypoints", icon: Calendar, label: "PayPoints", roles: ["admin", "accountant"] },
  { to: "/settings", icon: Settings, label: "Settings", roles: ["admin"] },
  { to: "/report", icon: FileBarChart, label: "Report", roles: allRoles},
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setIsMobileOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-[#171943] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static h-screen z-40 transition-all duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          collapsed && !isMobileOpen ? 'w-[70px]' : 'w-[250px]'
        } overflow-y-auto scroll-smooth bg-[#171943] text-white shadow-xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2C2F55]">
          {!collapsed && (
            <img 
              src={logo} 
              alt="Prime Grills & Cafe" 
              className="h-8"
            />
          )}
          
          {/* Toggle button for large screens */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-white hover:text-[#EE7F61] transition-colors"
          >
            {collapsed ? (
              <Menu size={20} />
            ) : (
              <X size={20} />
            )}
          </button>
          
          {/* Close button for mobile */}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-white hover:text-[#EE7F61] transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className={`p-3 ${collapsed ? 'mt-2' : 'mt-4'}`}>
          <nav className="space-y-1 text-white">
            {filteredNavItems.map((item) => (
              <SidebarLink 
                key={item.label} 
                to={item.to} 
                icon={item.icon}
                collapsed={collapsed}
              >
                {item.label}
              </SidebarLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Responsive spacer div for small screens when sidebar is hidden */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;
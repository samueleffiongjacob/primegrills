import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "../components/AdminSidebar/Sidebar";
import Header from "../components/AdminNavbar/AdminNav";
import Dashboard from '../pages/adminDashboard';
import MenuDashboard from '../components/Menu/menu';
// import Staff from "../components/Staff/staff";
// import ProductDashboard from '../components/Menu/menu';
import Category from '../components/category/category';
import Settings from '../components/Settings/settings';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MessagesPage from '../pages/messages';
import Profile from '../pages/profile';
import PayPoint from '../pages/paypoint';
import { useAuth } from '../context/authContext';
import OrdersDashboard from '../pages/orders';
import TransactionsTable from '../pages/pos';
import Staff from '../components/Staff/staff';
import Clients from '../components/Clients/clients';

function Redirect() {
    const { user } = useAuth();
    if (!user) return; // Redirect to login if no user
    return (
      <Navigate to="/dashboard" replace /> 
    )
    
}

const Navigations = () => {
  return (
    <ProtectedRoute>
    <Router>
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main>
            <Routes>
               {/* redirection */}
              <Route path="/" element={<Redirect />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/menu" element={<MenuDashboard />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/category" element={<Category />} />
              <Route path="/message" element={<MessagesPage />} />
              <Route path="/paypoints" element={<PayPoint />} />
              <Route path="/pos" element={<TransactionsTable />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<OrdersDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
    </ProtectedRoute>
  );
};

export default Navigations;

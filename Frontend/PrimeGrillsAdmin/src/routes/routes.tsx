import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "../components/AdminSidebar/Sidebar";
import Header from "../components/AdminNavbar/AdminNav";
import Dashboard from '../pages/adminDashboard';
import MenuDashboard from '../components/Menu/menu';
// import Staff from "../components/Staff/staff";
// import ProductDashboard from '../components/Menu/menu';
import Category from '../components/category/category';
import ReportIssue from '../components/Report/report';
import ComplaintPolicy from '../components/Report/complaintPolicy';
import Settings from '../components/Settings/settings';
import User from '../components/User/user';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MessagesPage from '../pages/messages';
import Profile from '../pages/profile';
import PayPoint from '../pages/paypoint';
import { useAuth } from '../context/authContext';
import OrdersDashboard from '../pages/orders';
import TransactionsTable from '../pages/pos';

function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) return; // Redirect to login if no user

  return user.role === "admin" || user.role === "accountant" 
    ? <Navigate to="/dashboard" replace /> 
    : <Navigate to="/profile" replace />;
}

const Navigations = () => {
  const allRoles = ["admin", "accountant", "waiter", "kitchen", "cleaner"];
  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main>
            <Routes>
               {/* Role-based redirection */}
              <Route path="/" element={<RoleBasedRedirect />} />

              <Route path="/dashboard" element={<ProtectedRoute roles={["admin", "accountant"]}><Dashboard /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute roles={["admin", "accountant", "waiter", "kitchen", "cleaner"]}><MenuDashboard /></ProtectedRoute>} />
              <Route path="/user" element={<ProtectedRoute roles={allRoles}><User /></ProtectedRoute>} />
              <Route path="/category" element={<ProtectedRoute roles={["admin", "accountant"]}><Category /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute roles={allRoles}><ReportIssue /></ProtectedRoute>} />
              <Route path="/complaintpolicy" element={<ProtectedRoute roles={allRoles}><ComplaintPolicy /></ProtectedRoute>} />
              <Route path="/message" element={<ProtectedRoute roles={allRoles}><MessagesPage /></ProtectedRoute>} />
              <Route path="/paypoints" element={<ProtectedRoute roles={["admin", "accountant"]}><PayPoint /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute roles={["admin", "accountant"]}><TransactionsTable /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute roles={["admin"]}><Settings /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute roles={["admin", "accountant", "kitchen"]}><OrdersDashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute roles={allRoles}><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Navigations;

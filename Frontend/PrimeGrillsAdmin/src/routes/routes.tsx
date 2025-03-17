
// Navigations.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "../components/AdminSidebar/Sidebar";
import Header from "../components/AdminNavbar/AdminNav";
import Dashboard from '../pages/adminDashboard';
import MenuDashboard from '../components/Menu/menu';
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
import { FC } from 'react';

// Improved RoleBasedRedirect with proper typing
const RoleBasedRedirect: FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (user.staff_profile.role === "admin" || user.staff_profile.role === "accountant") 
    ? <Navigate to="/dashboard" replace /> 
    : <Navigate to="/profile" replace />;
};

const Navigations: FC = () => {
  // Define roles as a constant array of the UserRole type
  const allRoles = ["admin", "accountant", "waiter", "kitchen", "cleaner", "kitchen", "chef", "pos", 'manager'];
  
  return (
    <ProtectedRoute roles={allRoles}>
      <Router>
        <div className="flex bg-gray-100 min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="p-4">
              <Routes>
                {/* Role-based redirection */}
                <Route path="/" element={<RoleBasedRedirect />} />

                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute roles={["admin", "accountant", 'manager']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/menu" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <MenuDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute roles={allRoles} >
                      <User />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/category" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <Category />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/report" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <ReportIssue />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/complaintpolicy" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <ComplaintPolicy />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/message" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <MessagesPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/paypoints" 
                  element={
                    <ProtectedRoute roles={["admin", "accountant", 'manager']}>
                      <PayPoint />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/pos" 
                  element={
                    <ProtectedRoute roles={["admin", "accountant", 'manager'] }>
                      <TransactionsTable />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute roles={["admin", "accountant", "kitchen", 'manager']}>
                      <OrdersDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute roles={allRoles}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Add a fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ProtectedRoute>
  );
};

export default Navigations;
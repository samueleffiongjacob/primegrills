
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from "../components/AdminSidebar/Sidebar";
import Header from "../components/AdminNavbar/AdminNav";
import Dashboard from '../pages/adminDashboard';
import MenuDashboard from '../components/Menu/menu';
import Staff from "../components/Staff/staff";
import ProductDashboard from '../components/Product/product';
import Category from '../components/category/category';
import ReportIssue from '../components/Report/report';
import ComplaintPolicy from '../components/Report/complaintPolicy';
import Settings from '../components/Settings/settings';
import User from '../components/User/user';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MessagesPage from '../pages/messages';

const Navigations= () => {
  return (
    <Router>
      <div className="flex bg-gray-100 border-4 border-amber-300 h-screen">
        {/* Sidebar always visible */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Header always visible */}
          <Header />

          {/* Main content area */}
          <main className=" ">
            <Routes>
              <Route path="/" element={  <ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute><MenuDashboard /></ProtectedRoute>} />
              <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductDashboard /></ProtectedRoute>} />
              <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
              <Route path="/complaintpolicy" element={<ProtectedRoute><ComplaintPolicy /></ProtectedRoute>} />
              <Route path="/message" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Navigations;

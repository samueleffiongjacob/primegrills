
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from "../components/AdminSidebar/Sidebar";
import Header from "../components/AdminNavbar/AdminNav";
import Dashboard from '../pages/adminDashboard';
import MenuDashboard from '../components/Menu/menu';
import Staff from "../components/Staff/staff";
import ProductDashboard from '../components/Product/product';
import Category from '../components/category/category';


const Navigations= () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar always visible */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Header always visible */}
          <Header />

          {/* Main content area */}
          <main className="bg-[#D9D9D9] flex-1 p-6">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/menu" element={<MenuDashboard />} />
              <Route path="/user" element={<Staff />} />
              <Route path="/products" element={<ProductDashboard />} />
              <Route path="/category" element={<Category />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Navigations;

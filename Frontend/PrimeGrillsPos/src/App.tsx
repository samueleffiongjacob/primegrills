import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mainframe from './Pages/MainFrame';
import HomePage from './Pages/Out/HomePage';
import MenuPage from './Pages/Out/MenuPage';
import ClientFrame from './Pages/ClientFrame';
import { SearchProvider } from './context/SearchContext';
import { MenuProvider } from './context/MenuContext';
import Settings from "@components/Settings";
import TransactionsTable from "@components/TransactionTable";
import Dashboard from "@components/Dashboard";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/Login';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <MenuProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginModal isOpen={true} onClose={() => {}} onLogin={() => {}} />} />
              
              {/* Protected Routes - All under same protection */}
              <Route path="/" element={<ProtectedRoute><Mainframe /></ProtectedRoute>}>
                <Route index element={<HomePage />} />
                <Route path='menus' element={<MenuPage />} />
                <Route path='settings' element={<Settings />} />
                <Route path='orders' element={<TransactionsTable />} />
                <Route path='dashboard' element={<Dashboard />} />
              </Route>
              
              {/* Client View - Public */}
              <Route path='/clientview' element={<ClientFrame />} />
              
              {/* Catch all - redirect to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </MenuProvider>
      </SearchProvider>
      <Toaster />
    </AuthProvider>
  )
}

export default App;

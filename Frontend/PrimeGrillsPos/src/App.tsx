import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  
  return (
    <>
      <SearchProvider>
        <MenuProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Mainframe />}>
                <Route index element={<HomePage />} />
                
                <Route path='menus' element={<MenuPage />} />
                <Route path='settings' element={<Settings />} />
                <Route path='orders' element={<TransactionsTable />} />
                
                <Route path='dashboard' element={<Dashboard />} />
                {/*
                <Route path='*' element={<NotFound />} /> */}
                
              </Route>
              <Route path='/clientview' element={<ClientFrame />} />
            </Routes>
          </BrowserRouter>
        </MenuProvider>
      </SearchProvider>
      <Toaster />
    </>
  )
}

export default App;

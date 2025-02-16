import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mainframe from './Pages/MainFrame';
import HomePage from './Pages/Out/HomePage';
import MenuPage from './Pages/Out/MenuPage';
import ClientFrame from './Pages/ClientFrame';

function App() {
  
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainframe />}>
          <Route index element={<HomePage />} />
          
          <Route path='menus' element={<MenuPage />} />
          {/*
          <Route path='orders' element={<Orders />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='settings' element={<Settings />} />
          <Route path='*' element={<NotFound />} /> */}
          
        </Route>
        <Route path='/clientview' element={<ClientFrame />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;

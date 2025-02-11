import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "../Pages/LandingPage"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer.js"
import MenuPage from '../Pages/MenuPage.js';


const Navigations = () => {
    return (
      <Router>
        {/* Navbar links*/}
        <Navbar />

        {/* pages */}
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
        </Routes>

        {/* footer */}
        <Footer /> 
      </Router>
    );
  };
  
export default Navigations;
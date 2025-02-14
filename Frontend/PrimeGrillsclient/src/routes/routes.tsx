import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "../Pages/LandingPage"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer.js"
import MenuPage from '../Pages/MenuPage.js';
import BottomNavigation from '../components/BottomNavigation.js';
import FeedbackPage from '../Pages/FeedbackPage.js';


const Navigations = () => {
    return (
      <Router>
        {/* Navbar links*/}
        <Navbar />

        {/* pages */}
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
        

        {/* footer */}
        <Footer /> 
        <BottomNavigation />
      </Router>
    );
  };
  
export default Navigations;
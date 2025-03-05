import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "../Pages/LandingPage"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer.js"
import CartPage from '../Pages/Checkout/CartPage.js';
import Services from '../Pages/ServicesPage.js';
import AllMenuPage from '../Pages/Menu/AllMenuPage.js';
import PastriesPage from '../Pages/Menu/PastriesPage.js';
import BarsPage from '../Pages/Menu/BarsPage.js';
import FoodPage from '../Pages/Menu/FoodPage.js';
import GrillsPage from '../Pages/Menu/GrillsPage.js';
import PopularMealsPage from '../Pages/Menu/PopularlMealsPage.js';
import SpecialDishesPage from '../Pages/Menu/SpecialDishesPage.js';
import OffersPage from '../Pages/Offers.js';
// import Blog from '../pages/blog';
import Menu from '../Pages/Menu/MenuPage/Menu.js';
import BottomNavigation from '../components/BottomNavigation.js';
import FeedbackPage from '../Pages/FeedbackPage.js';
import CheckoutPage from '../Pages/Checkout/ChekoutPage.js';
import LoginModal from '../components/User/Login.js';
import SignUpModal from '../components/User/SignUp.js';
import VerifyEmail from '../components/User/VerifyEmail.js';


const Navigations = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  // Function to toggle the login modal
  const toggleLoginModal = () => {
    setLoginModalOpen(prev => !prev);
    if (signUpModalOpen) setSignUpModalOpen(false);
  };

  // Function to toggle the sign up modal
  const toggleSignUpModal = () => {
    setSignUpModalOpen(prev => !prev);
    if (loginModalOpen) setLoginModalOpen(false);
  };

  // Function to handle successful login
  const handleLogin = (email: string, password: string) => {
    // Any additional logic after login
    setLoginModalOpen(false); // Close the modal after successful login
  };

    return (
      <Router>
         {/* Login Modal */}
        <LoginModal 
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          onToggleSignUp={toggleSignUpModal}
        />

        {/* Navbar links*/}
        <Navbar />

        {/* pages */}
        <Routes>
            {/* Desktop specific */}
            <Route path='/services' element={< Services/>} />

            <Route path='/menu/all' element={< AllMenuPage/>} />
            <Route path='/menu/pastries' element={< PastriesPage/>} />
            <Route path='/menu/drinks' element={< BarsPage/>} />
            <Route path='/menu/food' element={< FoodPage/>} />
            <Route path='/menu/grills' element={< GrillsPage/>} />
            <Route path='/menu/popular' element={< PopularMealsPage/>} />
            <Route path='/menu/special' element={< SpecialDishesPage/>} />
            <Route path='/offers' element={< OffersPage/>} />
            <Route path='/cart' element={<CartPage toggleLoginModal={toggleLoginModal} />}  />
            <Route path='/checkout' element={< CheckoutPage />} />
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu-category" element={<Menu />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
        </Routes>
        

        {/* footer */}
        <Footer /> 
        <BottomNavigation />
      </Router>
    );
  };
  
export default Navigations;
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


const Navigations = () => {
    return (
      <Router>
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
            <Route path='/cart' element={< CartPage />} />
            <Route path='/checkout' element={< CheckoutPage />} />
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu-category" element={<Menu />} />
            <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
        

        {/* footer */}
        <Footer /> 
        <BottomNavigation />
      </Router>
    );
  };
  
export default Navigations;
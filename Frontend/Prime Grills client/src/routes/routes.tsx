import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "../Pages/LandingPage"
import Navbar from "../components/Navbar/Navbar"
// import Signin from "../components/Login/login";
import Footer from "../components/Footer/Footer.js"
// import Blog from '../pages/blog';

const Navigations = () => {
    return (
      <Router>
        {/* Navbar links*/}
        <Navbar />

        {/* pages */}
        <Routes>
             {/* <Route path="/" element={<Signin />} />  */}
            <Route path="/" element={<LandingPage />} />
        </Routes>

        {/* footer */}
        <Footer /> 
      </Router>
    );
  };
  
export default Navigations;
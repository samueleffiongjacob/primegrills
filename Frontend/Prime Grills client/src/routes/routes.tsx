import { BrowserRouter as Router, Routes } from 'react-router-dom';
// import Home from "../pages/Homes"
import Navbar from "../components/Navbar/Navbar"
// import Footer from "../components/footer/Footer"
// import Blog from '../pages/blog';

const Navigations = () => {
    return (
      <Router>
        {/* Navbar links*/}
        <Navbar />

        {/* pages */}
        <Routes>
            {/* <Route path="/" element={<Blog />} /> */}
            {/* <Route path="/Platform" element={<Home />} /> */}
        </Routes>

        {/* footer */}
        {/* <Footer /> */}
      </Router>
    );
  };
  
export default Navigations;
import { FaXTwitter } from 'react-icons/fa6';
import logo from '../../assets/images/primeLogo.png';
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-30  py-10 px-6">
      <div className="container text-left mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* First Column - Larger */}
        <div className="col-span-1">
        <img
                            src={logo} 
                            alt="Logo"
                            className="h-10 w-10 "
                        />
          <p className="text-sm leading-relaxed text-gray-600">
            Savor the artisary  where <br/>every dish is a cullinary <br/>master piece
          </p>

        </div>

        {/* Second Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 underline">Useful Links</h3>
          <ul className="space-y-2  font-normal text-gray-600">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Event</a></li>
            <li><a href="#" className="hover:underline">Blogs</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>

        {/* Third Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 underline">Main Menu</h3>
          <ul className="space-y-2 font-normal text-gray-600">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Offer</a></li>
            <li><a href="#" className="hover:underline">Menu</a></li>
            <li><a href="#" className="hover:underline">Reservation</a></li>
          </ul>
        </div>

        {/* Fourth Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 underline ">Contact Us</h3>
          <ul className="space-y-2 text-sm font-normal text-gray-600">
            <li>123@p&g.com</li>
            <li>+234-332-211</li>
            <li>SocialMedia </li>
          </ul>
          <div className="flex space-x-4">
              <a href="#" className="text-[#EE7F61] hover:text-white">
                <FaFacebook/>
              </a>
              <a href="#" className="text-[#EE7F61] hover:text-white">
                <FaXTwitter/>
              </a>
              <a href="#" className="text-[#EE7F61] hover:text-white">
                <FaInstagramSquare/>
              </a>
            </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Prime and Grills. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

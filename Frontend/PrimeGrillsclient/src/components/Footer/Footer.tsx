import React from 'react';
import { FaXTwitter, FaFacebook, FaInstagram } from 'react-icons/fa6';
import logo from '../../assets/images/primeLogo.png';

const FooterLink = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="hover:text-[#EE7F61] transition-colors duration-300 hover:underline"
    >
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href, icon: Icon }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer" 
    className="text-[#EE7F61] hover:text-[#9f6453] transform hover:scale-120 transition-all duration-300"
  >
    <Icon size={24} />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Event', href: '/events' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'FAQs', href: '/faqs' }
  ];

  const mainMenu = [
    { label: 'Home', href: '/' },
    { label: 'Offer', href: '/offers' },
    { label: 'Menu', href: '/menu' },
    { label: 'Reservation', href: '/reservation' }
  ];

  return (
    <footer className="mt-32 py-12 mx-2 px-6 bg-white">
      <div className="container  lg:w-[86%] mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6 lg:pl-10">
            <img
              src={logo}
              alt="Prime and Grills Logo"
              className="h-14 w-auto"
            />
            <p className="text-gray-600 font-semibold w-[180px]  -mt-3 text-sm leading-relaxed">
              Savor The Artistry Where Every Dish is a Culinary Masterpiece
            </p>
          </div>

          {/* Useful Links */}
          <div className='lg:pl-8'>
            <h3 className="text-xl font-semibold mb-6 text-gray-900 border-b border-[#EE7F61] pb-2 inline-block">
              Useful Links
            </h3>
            <ul className="space-y-3 text-gray-600">
              {usefulLinks.map(link => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Main Menu */}
          <div className='lg:pl-8'>
            <h3 className=" text-xl font-semibold mb-6 text-gray-900 border-b border-[#EE7F61] pb-2 inline-block">
              Main Menu
            </h3>
            <ul className="space-y-3 text-gray-600">
              {mainMenu.map(item => (
                <FooterLink key={item.label} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className=' lg:pl-10'>
            <h3 className="text-xl font-semibold mb-6 text-gray-900 border-b border-[#EE7F61] pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:123@p&g.com" className="hover:text-[#EE7F61] transition-colors duration-300">
                  123@p&g.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <a href="tel:+234-332-211" className="hover:text-[#EE7F61] transition-colors duration-300">
                  +234-332-211
                </a>
              </li>
            </ul>
            <div className="flex space-x-6 items-center">
              <SocialIcon href="https://facebook.com" icon={FaFacebook} />
              <SocialIcon href="https://twitter.com" icon={FaXTwitter} />
              <SocialIcon href="https://instagram.com" icon={FaInstagram} />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-600">
          <p className="text-sm">
            &copy; {currentYear} Prime and Grills. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
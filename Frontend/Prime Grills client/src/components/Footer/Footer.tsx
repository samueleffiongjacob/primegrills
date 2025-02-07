import logo from '../../assets/images/primeLogo.png';

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
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Menu</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
          </ul>
        </div>

        {/* Third Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 underline">Services</h3>
          <ul className="space-y-2 font-normal text-gray-600">
            <li><a href="#" className="hover:underline">Catering</a></li>
            <li><a href="#" className="hover:underline">Event Planning</a></li>
            <li><a href="#" className="hover:underline">Delivery</a></li>
            <li><a href="#" className="hover:underline">Private Dining</a></li>
          </ul>
        </div>

        {/* Fourth Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 underline ">Contact Us</h3>
          <ul className="space-y-2 text-sm font-normal text-gray-600">
            <li>Phone: (123) 456-7890</li>
            <li>Email: conta</li>
            <li>Address: 123 Prime </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Prime and Grills. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

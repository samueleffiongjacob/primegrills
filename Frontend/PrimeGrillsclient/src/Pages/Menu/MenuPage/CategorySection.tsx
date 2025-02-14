import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

// Importing images
import menuimg1 from "../../../assets/images/menuimg1.png";
import menuimg2 from "../../../assets/images/menuimg2.png";
import menuimg3 from "../../../assets/images/menuimg3.png";
import product4 from "../../../assets/images/product4.png";
import pizza from "../../../assets/images/pizza.png";
import desert from "../../../assets/images/desert.png";

interface MenuProps {
  img: string;
  title: string;
  path: string; // Add path as a prop
}

const MenuItem: React.FC<MenuProps> = ({ img, title, path }) => {
  return (
    <Link to={path}>
      <motion.div
        className="flex flex-col items-center hover:text-white bg-gray-300 hover:bg-[#EE7F61] p-4 rounded-2xl shadow-md transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <div className="h-[80px] w-[80px] rounded-lg overflow-hidden">
          <img src={img} alt={title} className="object-cover w-full h-full" />
        </div>
        <h3 className="mt-2 text-md font-bold text-center">{title}</h3>
      </motion.div>
    </Link>
  );
};


// Menu Section Component
interface MenuProps {
  img: string;
  title: string;
  path: string; // Add path to the interface
}

const CategorySection = () => {
  const MENU_ITEMS: MenuProps[] = [
    { img: product4, title: "All", path: "/menu/all" },
    { img: pizza, title: "Pizza", path: "/menu/pizza" },
    { img: desert, title: "Desert", path: "/menu/desert" },
    { img: menuimg2, title: "Pastries", path: "/menu/pastries" },
    { img: menuimg3, title: "Barbecue", path: "/menu/barbecue" },
    { img: menuimg1, title: "Grilled Fish", path: "/menu/grilled-fish" },
    { img: desert, title: "Desert", path: "/menu/desert" },
    { img: menuimg1, title: "Grilled Fish", path: "/menu/grilled-fish" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(MENU_ITEMS.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col my-10 px-4 md:my-14 md:mb-20">
      {/* Title and Navigation Buttons */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`rounded-full w-10 me-4 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
              currentPage === 0
                ? "bg-gray-200 cursor-not-allowed opacity-50"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            <FaChevronLeft size={20} className="text-black" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
              currentPage === totalPages - 1
                ? "bg-[#ffaa91] cursor-not-allowed opacity-50"
                : "bg-[#EE7F61] hover:bg-[#ff8f71]"
            }`}
          >
            <FaChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {MENU_ITEMS.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        ).map((item, index) => (
          <MenuItem
            key={index}
            img={item.img}
            title={item.title}
            path={item.path} // Pass the path prop
          />
        ))}
      </motion.div>
    </div>
  );
};


export default CategorySection;
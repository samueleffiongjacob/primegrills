import React, { useState, useEffect } from "react";
import menuimg1 from '../../assets/images/menuimg1.png';
// import { FaPlus, FaMinus } from "react-icons/fa";
// import Button from "../../components/Navbar/button";
import MealDetailsModal from "../../components/MealDetailsModal";
import { motion } from 'framer-motion';
import PromotionSection from "./MenuPage/PromotionSection";

const menuItems = [
  { id: 1,
    name: "Pastries", price: 8000, image: menuimg1, 
    description: "Delicious pastries with a rich buttery flavor.",
    items: ["1 Croissant", "1 Danish", "Chocolate filling"]
  },
  { id: 2,
    name: "Nigerian", price: 8000, image: menuimg1, 
    description: "A traditional Nigerian meal with rich spices.",
    items: ["Jollof Rice", "Fried Plantain", "Grilled Chicken"]
  },
  { id: 3,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 4,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 5,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 6,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 7,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 8,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 9,
    name: "Shawarma", price: 8000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 10,
    name: "Shawarma", price: 4000, image: menuimg1, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
];

const AllMenuPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] =  useState<{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    items: string[];
  } | null>(null);

   // Simulate data fetching
   useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen p-6 lg:px-12">
      <PromotionSection />
      <h1 className="text-3xl font-bold text-black my-6">All Menu</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
        {loading
          ? Array(12)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 animate-pulse rounded-xl py-4 flex flex-col items-center"
                >
                  <div className="w-20 md:w-32 h-20 bg-gray-400 rounded-full mb-2"></div>
                  <div className="w-2/3 h-4 bg-gray-400 rounded mb-2"></div>
                  <div className="w-1/3 h-4 bg-gray-400 rounded"></div>
                </div>
              ))
        
          : menuItems.map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-300 rounded-xl py-4 flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedMeal(item)}
          >
            <img src={item.image} alt={item.name} className="w-20 md:w-32 h-20 object-cover rounded-full" />
            <p className="text-black font-semibold mt-2">{item.name}</p>
            <p className="text-orange-600 text-lg font-bold">₦{item.price.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* <div className="flex justify-center my-10">
        <Button title="Check Cart" />
      </div> */}

      {/* Meal Details Modal */}
      <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  );
};

export default AllMenuPage;

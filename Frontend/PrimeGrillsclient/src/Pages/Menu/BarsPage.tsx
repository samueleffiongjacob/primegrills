import React, { useState } from "react";
import {motion} from 'framer-motion'
import menuimg3 from '../../assets/images/menuimg3.png';
import MealDetailsModal from "../../components/MealDetailsModal";

const menuItems = [
  { id: 11,
    name: "Pastries", price: 7000, image: menuimg3, 
    description: "Delicious pastries with a rich buttery flavor.",
    items: ["1 Croissant", "1 Danish", "Chocolate filling"]
  },
  { id: 12,
    name: "Nigerian", price: 5000, image: menuimg3, 
    description: "A traditional Nigerian meal with rich spices.",
    items: ["Jollof Rice", "Fried Plantain", "Grilled Chicken"]
  },
  { id: 13,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 14,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 2,
    name: "Shawarma", price: 5000, image: menuimg3, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
];

const BarsPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] =  useState<{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    items: string[];
  } | null>(null);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-orange-600 my-6 mx-5">Bars/Drinks</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
        {menuItems.map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#7e7c7c] rounded-xl py-2 flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedMeal(item)}
          >
            <img src={item.image} alt={item.name} className="w-20 md:w-32 h-20 object-cover rounded-full" />
            <p className="text-white font-semibold mt-2">{item.name}</p>
            <p className="text-orange-200 text-lg font-bold">₦{item.price}</p>
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

export default BarsPage;

import React, { useState } from "react";
import {motion} from 'framer-motion' 
import product2 from '../../assets/images/product2.png';
import MealDetailsModal from "../../components/MealDetailsModal";

const menuItems = [
  { id: 20,
    name: "Amala", price: 8000, image: product2, 
    description: "Delicious pastries with a rich buttery flavor.",
    items: ["1 Croissant", "1 Danish", "Chocolate filling"]
  },
  { id: 21,
    name: "Pounded Yam", price: 8000, image: product2, 
    description: "A traditional Nigerian meal with rich spices.",
    items: ["Jollof Rice", "Fried Plantain", "Grilled Chicken"]
  },
  { id: 22,
    name: "Jollof Rice", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 22,
    name: "Akpu", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 23,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 24,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 25,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 26,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 27,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
  { id: 28,
    name: "Shawarma", price: 8000, image: product2, 
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
  },
];

const FoodPage: React.FC = () => {
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
      <h1 className="text-2xl font-semibold text-orange-600 my-6 mx-5">Food</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
        {menuItems.map((item, index) => (    
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
            className="bg-[#7e7c7c]  rounded-xl py-2 flex flex-col items-center cursor-pointer"
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

export default FoodPage;

import React, { useState } from "react";
import {motion} from 'framer-motion'
import { FaHeart } from "react-icons/fa";

// INTERNAL IMPORTS 
import menuimg2 from '../../assets/images/menuimg2.png';
import MealDetailsModal from "../../components/MealDetailsModal";
import { MENU_ITEMS } from "../../components/HomeSpecialSection/productDetails";
import Product from "../../components/HomeSpecialSection/product";
import PromotionSection from "./MenuPage/PromotionSection";

const SpecialDishesPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] =  useState<{
    id: number,
    image: string;
    name: string;
    description: string;
    price: number;
    rating: string; 
    items: string[];
  } | null>(null);

  return (
    <div className="min-h-screen p-6">
      <PromotionSection />
      <h1 className="text-3xl font-bold text-black md:ml-8 my-6 mx-5">Special Dishes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {MENU_ITEMS.map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=" rounded-xl flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedMeal(item)}
          >
             <Product
                img={item.image}
                title={item.name}
                description={item.description}
                price={item.price}
                rating={item.rating}
            />
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

export default SpecialDishesPage;

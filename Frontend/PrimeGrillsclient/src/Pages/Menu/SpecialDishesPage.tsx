import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaFire } from "react-icons/fa";

// INTERNAL IMPORTS 
import MealDetailsModal from "../../components/MealDetailsModal";
import { MENU_ITEMS } from "../../components/HomeSpecialSection/productDetails";
import Product from "../../components/HomeSpecialSection/product";
import PromotionSection from "./MenuPage/PromotionSection";
import { ShoppingBasket } from "lucide-react";

const SpecialDishesPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<{
    id: number,
    image: string;
    name: string;
    description: string;
    price: number;
    rating: string; 
    items: string[];
  } | null>(null);

  const [spotlightItem, setSpotlightItem] = useState<number | null>(null);
  const [specialEffectItems, setSpecialEffectItems] = useState<{[key: number]: string}>({});

  // List of possible special effects
  const specialEffects = [
    "spotlight", "sparkle", "sizzle", "pulse", "float"
  ];

  // Generate random special effects for items
  useEffect(() => {
    const assignSpecialEffects = () => {
      // Reset current effects
      const effects: {[key: number]: string} = {};
      
      // Assign random effects to 2-3 items
      const numEffects = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numEffects; i++) {
        const randomItemIndex = Math.floor(Math.random() * MENU_ITEMS.length);
        const randomEffect = specialEffects[Math.floor(Math.random() * specialEffects.length)];
        effects[randomItemIndex] = randomEffect;
      }
      
      setSpecialEffectItems(effects);
    };
    
    // Initial assignment
    assignSpecialEffects();
    
    // Change effects every 12 seconds
    const interval = setInterval(assignSpecialEffects, 12000);
    
    return () => clearInterval(interval);
  }, []);

  // Spotlight effect that follows mouse on specific item
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightItem !== null) {
        const el = document.getElementById(`special-dish-${spotlightItem}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          el.style.setProperty('--mouse-x', `${x}px`);
          el.style.setProperty('--mouse-y', `${y}px`);
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [spotlightItem]);

  // Component for sparkle animation
  const Sparkles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  };

  // Sizzle effect component
  const Sizzle = () => {
    return (
      <div className="absolute -top-3 -right-3 z-10">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.4, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="bg-orange-500 text-white p-1 rounded-full shadow-lg">
            <FaFire className="text-lg" />
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 lg:px-12">
 
      <PromotionSection />
      <motion.h1 
        className="text-3xl font-bold text-black md:ml-8 my-6 mx-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Special Dishes
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {MENU_ITEMS.map((item, index) => {
          const effect = specialEffectItems[index];
          const isSpotlight = effect === "spotlight";
          const isSparkle = effect === "sparkle";
          const isSizzle = effect === "sizzle";
          const isPulse = effect === "pulse";
          const isFloat = effect === "float";
          
          return (
            <motion.div 
              key={index}
              id={`special-dish-${index}`}
              className={`rounded-xl flex flex-col items-center cursor-pointer relative ${isFloat ? 'float-effect' : ''}`}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => isSpotlight && setSpotlightItem(index)}
              onMouseLeave={() => isSpotlight && setSpotlightItem(null)}
              onClick={() => setSelectedMeal(item)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Special effect indicators */}
              {isSparkle && <Sparkles />}
              {isSizzle && <Sizzle />}
              
              {isPulse && (
                <motion.div 
                  className="absolute inset-0 bg-orange-500 rounded-xl opacity-0"
                  animate={{ 
                    opacity: [0, 0.2, 0],
                    scale: [0.8, 1.1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              )}
              
              {effect && (
                <motion.div 
                  className="absolute -top-3 -left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {effect === "spotlight" && "Premium"}
                  {effect === "sparkle" && "Featured"}
                  {effect === "sizzle" && "Hot"}
                  {effect === "pulse" && <ShoppingBasket />}
                  {effect === "float" && <ShoppingBasket />}
                </motion.div>
              )}
              
              <div className="relative w-full">
                <Product
                  img={item.image}
                  title={item.name}
                  description={item.description}
                  price={item.price}
                  rating={item.rating}
                />
                
                {/* Extra highlighting for special items */}
               {/*  {effect && (
                  <motion.div 
                    className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {effect === "spotlight" && <FaCrown />}
                    {effect === "sparkle" && <FaStar />}
                    {effect === "sizzle" && <FaFire />}
                    {effect === "pulse" && <FaHeart />}
                    {effect === "float" && <FaHeart />}
                  </motion.div>
                )} */}
              </div>
            </motion.div>
          );
        })}
      </div>

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
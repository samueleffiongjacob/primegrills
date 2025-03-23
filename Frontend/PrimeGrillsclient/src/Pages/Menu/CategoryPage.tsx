import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import MealDetailsModal from "../../components/MealDetailsModal";
import PromotionSection from "./MenuPage/PromotionSection";
import { ShoppingBasketIcon } from "lucide-react";
import { menuItems } from "../../components/sample";

// Utility function to convert slug back to readable format
const slugToReadable = (slug: string) => {
  return slug
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

// Animation variants
const animationVariants = [
  {
    // Bounce animation
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: 3,
        repeatType: "reverse" as const,
      },
    },
  },
  {
    // Wiggle animation
    animate: {
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.6,
        repeat: 2,
        repeatType: "reverse" as const,
      },
    },
  },
  {
    // Pulse animation
  /*   animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: 2,
        repeatType: "reverse" as const,
      },
    }, */
  },
/*   {
    // Shake animation
    animate: {
      x: [0, -3, 3, -3, 0],
      transition: {
        duration: 0.4,
        repeat: 3,
        repeatType: "reverse" as const,
      },
    },
  }, */
  {
    // Glow animation (using boxShadow)
    animate: {
      boxShadow: [
        "0 0 0 rgba(238, 127, 97, 0)",
        "0 0 10px rgba(238, 127, 97, 0.7)",
        "0 0 0 rgba(238, 127, 97, 0)",
      ],
      transition: {
        duration: 1.5,
        repeat: 1,
        repeatType: "reverse" as const,
      },
    },
  },
];

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // Convert slug back to readable format for the heading
  const readableCategory = slugToReadable(category || "");

  // Filter items by category
  const categoryItems = menuItems.filter(
    (item) => item.category.toLowerCase().replace(/\s+/g, "-") === category
  );

  const [selectedMeal, setSelectedMeal] = useState<{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    items: string[];
  } | null>(null);

  const [animatedItems, setAnimatedItems] = useState<number[]>([]);

  // Function to randomly animate items
  useEffect(() => {
    const animateRandomItems = () => {
      // Pick 1-3 random items to animate
      const numItems = Math.floor(Math.random() * 3) + 1;
      const itemsToAnimate: number[] = [];

      while (itemsToAnimate.length < numItems) {
        const randomIndex = Math.floor(Math.random() * categoryItems.length);
        if (!itemsToAnimate.includes(randomIndex)) {
          itemsToAnimate.push(randomIndex);
        }
      }

      setAnimatedItems(itemsToAnimate);

      // Reset animations after they complete
      setTimeout(() => {
        setAnimatedItems([]);
      }, 2500);
    };

    // Initial animation after a delay
    const initialTimeout = setTimeout(animateRandomItems, 1000);

    // Set up interval for periodic animations
    const intervalId = setInterval(animateRandomItems, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [categoryItems.length]);

  // Function to get a random animation variant
  const getRandomAnimation = () => {
    const randomIndex = Math.floor(Math.random() * animationVariants.length);
    return animationVariants[randomIndex];
  };

  return (
    <div className="min-h-screen p-6 lg:px-12 ">
      <PromotionSection />
      <h1 className="text-3xl font-bold text-black my-6 ">
        {readableCategory}
      </h1>

      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
        {categoryItems.map((item, index) => {
          const isAnimated = animatedItems.includes(index);
          const animation = getRandomAnimation();

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={isAnimated ? animation.animate : {}}
              className={`bg-gray-300 rounded-xl py-2 flex flex-col items-center cursor-pointer transition-all ${
                isAnimated ? "z-10" : "z-0"
              }`}
              onClick={() => setSelectedMeal(item)}
            >
              <div className="relative">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-20 md:w-32 h-20 object-cover rounded-full"
                />
                {isAnimated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-2 -right-2 bg-[#EE7F61] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  >
                    <ShoppingBasketIcon />
                  </motion.div>
                )}
              </div>
              <p className="text-black font-semibold mt-2">{item.name}</p>
              <motion.p
                className="text-orange-600 text-lg font-bold"
                animate={isAnimated ? { fontSize: ["16px", "18px", "16px"] } : {}}
                transition={{ duration: 0.5, repeat: isAnimated ? 2 : 0 }}
              >
                ₦{item.price.toLocaleString()}
              </motion.p>
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

export default CategoryPage;
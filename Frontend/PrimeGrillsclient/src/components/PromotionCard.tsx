import React, { useEffect } from "react";
import { motion, useAnimationControls} from "framer-motion";

interface PromotionProps {
  promotionItems: {
    title: string;
    description: string;
    minOrder: string;
    image: string;
  }[];
}

const PromotionCard: React.FC<PromotionProps> = ({ promotionItems }) => {
  const badgeControls = useAnimationControls();
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  };

  // Stagger children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  useEffect(() => {

    // Badge animation
    badgeControls.start({
      scale: [1, 1.15, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
    });

  }, [ badgeControls]);


  return (
    <div className="flex justify-center items-center mb-10">
      
      <div className="w-full">
        {promotionItems.map((promo, index) => (
          <div
            key={index}
            className="flex items-center justify-between md:rounded-4xl rounded-3xl p-8 md:h-54 relative"
            style={{
              background: "linear-gradient(97.01deg, #EE7F61 5.44%, #884938 105.78%)",
              overflow: "visible"
            }}
          >
             {/* Hot Deal Badge */}
             <motion.div 
              className="absolute -top-3 -left-3  bg-orange-100 text-orange-500 px-4 py-1 rounded-full text-sm font-bold shadow-lg z-30"
              animate={badgeControls}
            >
              HOT DEAL
            </motion.div>

            {/* Animated Text Content */}
            <motion.div 
              className="text-white max-w-md z-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.p 
                className="text-sm mb-2 font-semibold tracking-wider uppercase"
                variants={textVariants}
              >
                Today's Offer
              </motion.p>
              <motion.h2 
                className="text-3xl font-extrabold mb-3 tracking-tight"
                variants={textVariants}
              >
                {promo.title}
              </motion.h2>
              <motion.p 
                className="text-base mb-3 font-medium"
                variants={textVariants}
              >
                {promo.description}
              </motion.p>
              <motion.p 
                className="text-base font-bold"
                variants={textVariants}
              >
                On All Orders above {promo.minOrder}
              </motion.p>
            </motion.div>

            {/* Animated Image */}
            <motion.img
              src={promo.image}
              alt="Promotion"
              className="w-24 md:w-52 md:h-52 h-24 lg:h-52 object-contain md:right-10 absolute -top-10 -right-2"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
              }}
            />

            {/* Decorative Elements */}
            <motion.div 
              className="absolute top-0 right-0 w-1/3 h-full opacity-10"
              animate={{
                opacity: [0.2, 0.2, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <div className="absolute bottom-5 right-8 w-16 h-16 rounded-full bg-green-200"></div>
              <div className="absolute top-4 right-[100%] w-16 h-16 rounded-full bg-blue-400"></div>
              <div className="absolute bottom-8 right-[150%] w-10 h-10 rounded-full bg-purple-400"></div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionCard;
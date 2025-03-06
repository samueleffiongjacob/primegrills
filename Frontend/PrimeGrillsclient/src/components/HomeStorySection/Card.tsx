// const Card =() =>{

//     const CardSection = [
//         {
//             Image: 'Icon1',
//             title: 'CATERING',
//             value: 'Delight your guest <br/> with our flavour and <br/> presentation'
//         },
//         {
//             Image: 'Icon1',
//             title: 'CATERING',
//             value: 'Delight your guest <br/> with our flavour and <br/> presentation'
//         },
//         {
//             Image: 'Icon1',
//             title: 'CATERING',
//             value: 'Delight your guest <br/> with our flavour and <br/> presentation'
//         }
//     ]
//     return(

//     )
// }
// export default Card;

// INTERNAL IMPORTS
import Icon1 from '../../assets/images/icon1.png'
import Icon2 from '../../assets/images/icon2.png'
import Icon3 from '../../assets/images/bin.png'
import Icon4 from '../../assets/images/icon3.png'
// import { slideVariants } from '../../utils/utils'
import { motion } from 'framer-motion';

const Card = () => {
  const CardSection = [
    {
      Image: Icon1,
      title: 'Fine Dining Experience',
      value: 'Enjoy an exquisite culinary journey with our top-notch chefs crafting memorable dishes that delight the senses and elevate dining to an art form.',
    },
    {
      Image: Icon2,
      title: 'off-site CATERING',
      value: 'From corporate events to weddings, we provide premium catering tailored to your needs, ensuring every guest experiences exceptional flavors and impeccable service.',
    },
    {
      Image: Icon3,
      title: 'Private Chef',
      value: 'Hire a personal chef to create a customized dining experience in the comfort of your home, offering a refined and intimate meal tailored to your unique tastes.',
    },
    {
      Image: Icon4,
      title: 'Cooking Classes',
      value: 'Learn the art of cooking with hands-on classes led by our expert chefs, where you can master culinary techniques and explore diverse cuisines in an engaging environment.',
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
      {CardSection.map((card, index) => (
        <motion.div key={index} className="bg-white rounded-2xl m-3 border-t border-t-gray-300 shadow-gray-400 shadow-lg p-2 flex flex-col items-center
         text-[#EE7F61] py-3 lg:py-5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
              }}
          >
          <img src={card.Image} alt={card.title} className="w-12 h-12 mb-2 shadow-[#EE7F61] shadow-2xl bg-transparent" />
          <h3 className="text-lg uppercase font-bold mb-2">{card.title}</h3>
          <p className="text-center font-semibold p-2 text-xs" dangerouslySetInnerHTML={{ __html: card.value }} />
        </motion.div>
      ))}
    </div>
  );
};

export default Card;

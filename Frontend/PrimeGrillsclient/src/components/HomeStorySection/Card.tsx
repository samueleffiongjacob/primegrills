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
      title: 'CATERING',
      value: 'Delight your guest <br/> with our flavour and <br/> presentation',
    },
    {
      Image: Icon2,
      title: 'CATERING',
      value: 'Delight your guest <br/> with our flavour and <br/> presentation',
    },
    {
      Image: Icon3,
      title: 'CATERING',
      value: 'Delight your guest <br/> with our flavour and <br/> presentation',
    },
    {
      Image: Icon4,
      title: 'CATERING',
      value: 'Delight your guest <br/> with our flavour and <br/> presentation',
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
          <h3 className="text-lg font-bold mb-2">{card.title}</h3>
          <p className="text-center font-semibold text-xs" dangerouslySetInnerHTML={{ __html: card.value }} />
        </motion.div>
      ))}
    </div>
  );
};

export default Card;

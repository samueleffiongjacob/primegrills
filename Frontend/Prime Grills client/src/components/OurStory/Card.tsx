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

import Icon1 from '../../assets/images/icon1.png'
import Icon2 from '../../assets/images/icon2.png'
import Icon3 from '../../assets/images/bin.png'
import Icon4 from '../../assets/images/icon3.png'

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
    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
      {CardSection.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col items-center text-[#EE7F61]">
          <img src={card.Image} alt={card.title} className="w-12 h-12 mb-2 shadow-[#EE7F61] shadow-2xl bg-transparent" />
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p className="text-center " dangerouslySetInnerHTML={{ __html: card.value }} />
        </div>
      ))}
    </div>
  );
};

export default Card;

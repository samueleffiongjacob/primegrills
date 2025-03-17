import PromotionCard from "../../../components/PromotionCard";
import PromoteImage from "../../../assets/images/promotionimage.png";

const promotions = [
  {
    title: "A Free Box of Fries",
    description: "Limited time offer!",
    minOrder: "₦10,000",
    image: PromoteImage,
  },
];

const PromotionSection = () => {
  return(
    <div className="lg:mt-10">
       < h1 className="text-3xl text-black font-bold my-6">Promotion</h1>
        <PromotionCard promotionItems={promotions} />;
    </div>
    
  ) 
};

export default PromotionSection;

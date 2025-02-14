
import MenuPopularSection from "./MenuPopularSection";
import PromotionSection from "./PromotionSection";
import CategorySection from "./CategorySection";
import MenuFoodSection from "./MenuFoodSection";



const MenuPage = () => {
    

    return(
        <div className="container justify-self-center">
            <div className="">
                <CategorySection />
                {/* Promotion */}
                <PromotionSection />;
                {/* Popular */}
                <MenuPopularSection />
                {/* Food */}
                <MenuFoodSection />
            </div>
        </div>
    )
}

export default MenuPage;
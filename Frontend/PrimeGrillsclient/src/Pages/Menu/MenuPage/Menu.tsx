
import MenuPopularSection from "./MenuPopularSection";
import PromotionSection from "./PromotionSection";
import CategorySection from "./CategorySection";
import MenuFoodSection from "./MenuFoodSection";
import MenuDrinksSection from "./MenuDrinksSection";
import MenuPastriesSection from "./MenuPastries";



const Menu = () => {
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
                {/* Drinks */}
                <MenuDrinksSection />
                {/* Pastries */}
                <MenuPastriesSection />
            </div>
        </div>
    )
}

export default Menu;
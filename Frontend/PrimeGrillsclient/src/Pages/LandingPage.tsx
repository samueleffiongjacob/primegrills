import Hero from "../components/HeroSection/Hero.tsx";
import Menu from "../components/Menu/Category.tsx";
import Story from "../components/OurStory/OurStory.tsx";
import ProductMenu from "../components/product/ProductMenu.tsx";
import Testimonials from "../components/Testimonials/Testimonials.tsx";


const PrimePages = () => {
    return (
        <div className="">
            <div className="">
                <Hero />
            </div>
            <div className="">
                <Menu />
                <ProductMenu />
            </div>
            <div className=" ">
                <Testimonials />
            </div>
            <div className=" ">
                <Story />
            </div>
            
        </div>
    );
}
 
export default PrimePages;
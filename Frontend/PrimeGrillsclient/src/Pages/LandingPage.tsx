import Hero from "../components/HomeHeroSection/Hero.tsx";
import Menu from "../components/HomeCategorySection/Category.tsx";
import Story from "../components/HomeStorySection/OurStory.tsx";
import ProductMenu from "../components/HomeSpecialSection/ProductMenu.tsx";
import Testimonials from "../components/HomeTestimonialSection/Testimonials.tsx";


const PrimePages = () => {
    return (
        <div className="max-w-[1440px] mx-auto">
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
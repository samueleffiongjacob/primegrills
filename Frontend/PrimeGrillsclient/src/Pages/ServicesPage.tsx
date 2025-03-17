import { motion } from "framer-motion";

// INTERNAL IMPORTS
import Button from "../components/Navbar/button";
import Card from "../components/HomeStorySection/Card";
import { headerVariants } from "../utils/animate";

const services = [
  {
    title: "Fine Dining Experience",
    description: "Enjoy an exquisite culinary journey with our top-notch chefs crafting memorable dishes that delight the senses and elevate dining to an art form.",
  },
  {
    title: "Catering Services",
    description: "From corporate events to weddings, we provide premium catering tailored to your needs, ensuring every guest experiences exceptional flavors and impeccable service.",
  },
  {
    title: "Private Chef",
    description: "Hire a personal chef to create a customized dining experience in the comfort of your home, offering a refined and intimate meal tailored to your unique tastes.",
  },
  {
    title: "Cooking Classes",
    description: "Learn the art of cooking with hands-on classes led by our expert chefs, where you can master culinary techniques and explore diverse cuisines in an engaging environment.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 container mx-auto px-6 lg:px-32">
      {/* Heading Section */}
      <motion.div
        className="text-center  flex flex-col p-2 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={headerVariants}
      >
        <h1 className="bg-clip-text text-transparent uppercase mb-4 font-bold text-sm tracking-wide px-2 bg-[#EE7F61]">
          Our Story & Services
        </h1>
        <p className="text-4xl font-bold px-2 leading-tight">
          Our Culinary Journey <br /> and Services
        </p>
        <p className="py-2 leading-relaxed px-2 md:text-lg my-4" style={{ lineHeight: "35px" }}>
          Rooted in passion, we curate unforgettable dining experiences and offer
          exceptional services, blending culinary artistry with warm hospitality.
          Our dedication to excellence is evident in every dish we prepare, ensuring
          that each meal tells a story of craftsmanship, tradition, and innovation.
          Whether you’re looking for a sophisticated dinner, professional catering,
          or a hands-on cooking experience, we are here to serve you with expertise
          and enthusiasm.
        </p>
        <Button title="Explore" />
      </motion.div>

      {/* Services Grid */}
      <div className="md:w-[70%] mx-auto">
        <Card />
      </div>
    </section>
  );
};

export default Services;


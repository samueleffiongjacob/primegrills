import Button from "../Navbar/button";
import Card from "../OurStory/Card";

const Story =() => {
    return (
        <div>
            <div id="services" className=" p-2 justify-self-center container mt-30 grid grid-cols-1 md:grid-cols-2  px-5 gap-8 ">

                {/* Left column */}
                <div className=" text-left flex flex-col p-2 mr-5">
                    <h1
                        className="bg-clip-text text-transparent uppercase mb-4 font-bold text-sm tracking-wide px-2 bg-[#EE7F61]"
                    >
                        Our story and services
                    </h1>
                    <p className="text-4xl font-bold px-2 leading-tight">
                        Our Culinary journey<br/> and services
                    </p>
                    <p
                        className=" py-2 leading-relaxed px-2"
                        style={{
                            lineHeight: '35px',
                        }}
                        >
                    Rooted in passion, we curate unforgettable dining
                    experiences and offer exceptional services,
                    blending culinary artisanry with warm hospitality.
                    </p>
                    <Button className="" title="Explore" />
                </div>
                {/* Right column */}
                <div className="">
                    <Card />
                </div>

            </div>

        </div>
    )      
}
export default Story;
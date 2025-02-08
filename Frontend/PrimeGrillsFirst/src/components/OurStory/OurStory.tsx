import Button from "../Navbar/button";
import Card from "./Card";

const Story =() => {
    return (
        <div>
            <div className="container mt-30 grid grid-cols-1 md:grid-cols-2 lg:px-32 px-5 gap-8 ">

                {/* Left column */}
                <div className=" text-left flex flex-col mr-5">
                    <h1
                        className="bg-clip-text text-transparent uppercase font-semibold text-sm tracking-wide px-2 bg-[#EE7F61]"
                    >
                        Our story and services
                    </h1>
                    <p className="text-3xl font-bold px-2 leading-tight">
                        Our Cultinary journey<br/> and services
                    </p>
                    <p
                        className=" py-2 leading-relaxed px-2"
                        style={{
                            lineHeight: '35px',
                        }}
                        >
                    Rooted in passion, we curate unforgettable dining<br/>
                    experiences and offer exceptional services,<br/>
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
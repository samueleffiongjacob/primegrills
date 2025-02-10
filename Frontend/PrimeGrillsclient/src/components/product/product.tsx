import {FaHeart, FaStar } from "react-icons/fa"

const Product =(props) => {
    return (
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-xl flex flex-col justify-center shadow-lg">
            <div className=" relative ms-auto  ">
                <FaHeart className="absolute top-0 text-white   right-0 bg-[#EE7F61]"/>
             </div>   
            <div className=" justify-items-start items-start">
                
                <img src={props.img} alt="" className="h-[150px] w-[150px] rounded-lg" />
            </div>
            <div className="text-left p-2 mt-2">
                <h3 className="font-bold text-md" >{props.title}</h3>
                <p className="mt-1.5 font-semibold text-md"> Description of the Dish </p>
                 <div className="text-lg flex items-center font-bold space-x-2 mt-2">
                    <p>#3500</p>
                    <span className="flex items-center ms-auto">
                    <FaStar className="text-[#EE7F61]" />
                    <p>4.0</p>
                    </span>
                </div>    
               
            </div>
        </div>
    )
}
export default Product;
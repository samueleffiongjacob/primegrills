import {FaHeart, FaStar } from "react-icons/fa"

interface ProductProps {
    img: string;
    title: string;
    description?: string;
    price: number;
    rating: string;
}

const Product: React.FC<ProductProps> =  ({
    img,
    title,
    description = "Description of the Dish",
    price,
    rating,
  }) => {
    return (
        <div className="w-[96%] bg-white p-3 rounded-xl flex flex-col m-1 justify-center shadow-lg">

            {/* Heart icon  */}
            <div className="justify-center lg:-right-5 lg:mr-2 flex items-center relative -top-3 ms-auto bg-[#EE7F61] h-12 w-12 
             rounded-bl-3xl rounded-tr-2xl  -right-3 ">
                <FaHeart className=" top-0 w-6 h-6 text-white right-0"/>
                <FaHeart className="absolute right-[14px] top-[14px] w-5 h-5 text-[#EE7F61] "/>
             </div>

             {/* Product Image  */}  
            <div className=" justify-items-start rounded-full w-[160px] -mt-10 items-start ">
                <img src={img} alt={title} className="h-[160px] w-[150px] rounded-full" />
            </div>

           {/*  Product Details */}
            <div className="text-left p-2 mt-2">
                <h3 className="font-bold text-md" >{title}</h3>
                <p className="mt-1.5 font-semibold text-md">{description} </p>
                 <div className="text-lg flex items-center font-bold space-x-2 mt-2">
                    <p>₦{price}</p>
                    <span className="flex items-center ms-auto">
                        <FaStar className="text-[#EE7F61]" />
                        <p>{rating}</p>
                    </span>
                </div>    
            </div>
        </div>
    );
};
export default Product;

interface MenuProps {
    img: string;
    title: string;
    value: string;  
}

const MenuCard: React.FC<MenuProps> =  ({
    img,
    title,
    value
  }) => {
    return (
        <div id="menuCategory" className="w-full border-t border-t-gray-300 bg-white p-3 rounded-2xl flex flex-col
         shadow-gray-400 shadow-lg items-center justify-center">
            <div className=" w-[101px] rounded-full  ">
                <img src={img} alt={title} className="h-[101px] w-[101px] mt-2" />
            </div>
            <div className="text-left p-2 ">
                <h3 className="font-bold text-md text-center" >{title}</h3>
                <p className="text-center"> {value} </p>
            </div>
        </div>
    )
}
export default MenuCard;
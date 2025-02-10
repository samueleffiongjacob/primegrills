

const MenuCard =(props) => {
    return (
        <div id="menuCategory" className="w-full lg:w-1/5 bg-white p-3 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <div className="  ">
                <img src={props.img} alt="" className="h-[81px] w-[79px] rounded-full bg-[#EE7F61]" />
            </div>
            <div className="text-left p-2 mt-2">
                <h3 className="font-bold text-md" >{props.title}</h3>
                <p> {props.value} </p>
            </div>
        </div>
    )
}
export default MenuCard;
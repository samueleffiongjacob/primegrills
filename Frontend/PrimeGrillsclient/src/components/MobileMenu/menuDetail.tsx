// interface MenuProps {
//     img: string;
//     title: string;
//   }
  
//   const MenuItem: React.FC<MenuProps> = ({ img, title }) => {
//     return (
//       <div
//         id="menuCategory"
//         className=" bg-gray-300 hover:bg-[#EE7F61] p-4 rounded-2xl  border flex flex-col items-center justify-center shadow-lg transition-all duration-300"
//       >
//         <div className="h-[80px] w-[80px] rounded-lg ">
//           <img src={img} alt={title} className="object-cover w-full h-full" />
//         </div>
//         <h3 className="font-bold text-md text-center mt-2  hover:text-white">
//           {title}
//         </h3>
//       </div>
//     );
//   };
  
//   export default MenuItem;
interface MenuProps {
    img: string;
    title: string;
  }
  
  const MenuItem: React.FC<MenuProps> = ({ img, title }) => {
    return (
      <div className="flex flex-col flex-wrap items-center px-5 mx-auto w-full max-w-[200px] ">
        {/* Box with the image */}
        <div
          id="menuCategory"
          className=" bg-gray-300 hover:bg-[#EE7F61] p-4  rounded-2xl shadow-lg transition-all duration-300  items-center justify-center"
        >
          <div className="h-[80px] w-[80px] rounded-lg">
            <img src={img} alt={" "} className="object-cover w-full h-full" />
          </div>
        </div>
  
        {/* Text outside the box */}
        <h3 className=" font-bold text-md text-center mt-2 hover:text-[#EE7F61]">
          {title}
        </h3>
      </div>
    );
  };
  
  export default MenuItem;
  
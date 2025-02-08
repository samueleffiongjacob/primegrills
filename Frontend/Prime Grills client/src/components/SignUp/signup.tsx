import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import Button from "../../components/Navbar/button";
import { BiBarChart, BiBattery, BiFilterAlt } from "react-icons/bi";

const SignUp = () => {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center ">
            <div className="bg-white h-[874px] w-1/2 flex flex-col rounded-2xl overflow-hidden shadow-lg">
                {/* Gray section */}
                <div className="bg-gray-500 w-full h-[77px] flex items-center px-6">
                    <p className="text-white font-bold text-lg">10:27</p>
                    <div className="flex space-x-1 ms-auto">
                        <BiBarChart className=" text-white rounded- p-1 text-2xl"/>
                        <BiFilterAlt className=" text-white rounded- p-1 text-2xl"/>
                        <BiBattery className=" text-white rounded- p-1 text-2xl"/>
                    </div>
                </div>
                {/* Form */}
                <form className="px-6 space-y-4">
                    <div className="mt-20">
                        <p className="font-semibold text-2xl tracking-wide">Let's You In</p>
                    </div>
                    <div className=" mt-5">

                        <input
                                type="text"
                                id="name"
                                className="bg-white  shadow-lg text-sm w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                                placeholder="Name"
                            />
                        <input
                                type="text"
                                id="username"
                                className="bg-white mt-5 shadow-lg text-sm w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                                placeholder="Username"
                            />
                        <input
                                type="text"
                                id="email"
                                className="bg-white mt-5 shadow-lg text-sm w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                                placeholder="Email"
                            />
                        <input
                                type="password"
                                id="password"
                                className="bg-white mt-5 shadow-lg text-sm w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                                placeholder="Password"
                            />
                    </div>
                    <div className="mt-10 p-4">
                        <Button title= "Sign Up" />
                        
                    </div>
                </form>
                <div>
                    <p className="mb-5 text-md font-bold">Or Continue with</p>
                    <div className="relative px-4">
                            <a href="#" className="absolute inset-y-0 left-7 flex items-center">
                                <FaGoogle className=" text-[#EE7F61] rounded- p-1 text-2xl "/>
                            </a>
                        <input
                            type="text"
                            id="email"
                            className="bg-gray-300 shadow-lg text-md text-black text-center font-bold w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                            placeholder="Sign Up with Google"
                        />
                    </div>
                    <div className="relative px-4 mt-5">
                            <a  href="#" className="absolute inset-y-0 left-7 flex items-center">
                                <FaFacebook className=" text-blue-500 rounded- p-1 text-2xl "/>
                            </a>
                        <input
                            type="text"
                            id="email"
                            className="bg-blue-400 shadow-lg text-white text-center w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                            placeholder="Sign Up with Facebook"
                        />
                    </div>
                    <div className="relative px-4 mt-5">
                            <a  href="#" className="absolute inset-y-0 left-7 flex items-center">
                                <FaApple className=" text-blue-500 rounded- p-1 text-2xl "/>
                            </a>
                        <input
                            type="text"
                            id="email"
                            className="bg-blue-400 shadow-lg text-white text-center w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                            placeholder="Sign Up with iOS"
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    </>
  );
};


//       <div className="h-screen flex justify-center items-center bg-gray-100">
//         <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
//           <h2 className="text-2xl font-bold text-center text-[#EE7F61] mb-6">
//             Sign Up
//           </h2>
//           Gray section
//                  <div className="bg-gray-500 w-full h-[77px] flex items-center px-6">
//                      <p className="text-white font-bold text-lg">10:27</p>
//                      <div className="flex space-x-1 ms-auto">
//                          <BiBarChart className=" text-white rounded- p-1 text-2xl"/>
//                          <BiFilterAlt className=" text-white rounded- p-1 text-2xl"/>
//                         <BiBattery className=" text-white rounded- p-1 text-2xl"/>/                     </div>
//                 </div>
//           <form className="space-y-4">
//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Enter your name"
//                 className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
//               />
//             </div>
  
//             {/* Username */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Choose a username"
//                 className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
//               />
//             </div>
  
//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Create a password"
//                 className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
//               />
//             </div>
  
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Enter your email"
//                 className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
//               />
//             </div>
  
//             {/* Submit Button */}
//             <div className="text-center">
//               <button
//                 type="submit"
//                 className="w-full bg-[#EE7F61] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#e56a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE7F61]"
//               >
//                 Sign Up
//               </button>
//             </div>
//           </form>
  
//           {/* Or sign up with */}
//           <div className="text-center mt-6">
//             <p className="text-gray-500">Or sign up with</p>
//             <div className="flex justify-center space-x-4 mt-4">
//               {/* Google */}
//               <button className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200">
//                 <img
//                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png"
//                   alt="Google"
//                   className="h-6 w-6"
//                 />
//               </button>
  
//               {/* Facebook */}
//               <button className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200">
//                 <img
//                   src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
//                   alt="Facebook"
//                   className="h-6 w-6"
//                 />
//               </button>
  
//               {/* iOS */}
//               <button className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-200">
//                 <img
//                   src="https://upload.wikimedia.org/wikipedia/commons/3/33/Apple_logo_black.svg"
//                   alt="iOS"
//                   className="h-6 w-6"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
  export default SignUp;
  
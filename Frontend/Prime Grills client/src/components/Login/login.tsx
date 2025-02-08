import messagebox from "../../assets/images/messagebox.png";
import padlock from "../../assets/images/padlock.png";
import eye from "../../assets/images/eye.png";
import Button from "../../components/Navbar/button";
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { BiBarChart, BiBattery, BiFilterAlt } from "react-icons/bi";

const Signin = () => {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center ">
                {/* form */}
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
                <form className="px-6 py-8">
                    <div className="mt-5">
                        <p className="font-semibold text-2xl tracking-wide">Signin</p>
                    </div>
                    <div className="relative py-4">
                        <span className="absolute inset-y-0 left-3 flex items-center">
                            <img src={messagebox} alt="message" className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            id="email"
                            className="bg-white shadow-lg text-sm w-full border-t rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                            placeholder="Email"
                        />
                    </div>
                    <div className="relative py-4">
                        <span className="absolute inset-y-0 left-3 flex items-center">
                            <img src={padlock} alt="padlock" className="h-4 w-4" />
                        </span>
                        <input
                            type="password"
                            id="password"
                            className="bg-white shadow-lg border-t  text-sm w-full rounded-2xl border-t-[#EE7F61] pl-10 py-2.5"
                            placeholder="Password"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                            <img src={eye} alt="eye" className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="flex flex-row items-center font-bold">
                        <input
                            type="checkbox"
                            className="w-5 h-5 appearance-none border-2 border-[#EE7F61] rounded bg-[#EE7F61] checked:bg-[#EE7F61] cursor-pointer"
                        />
                        <label className="p-2 text-sm cursor-pointer">Stay signed in</label>
                        <p className="ml-auto text-sm cursor-pointer hover:underline">
                            Forgot password?
                        </p>
                    </div>
                    <div className="mt-10 p-4">
                        <Button title= "Sign In" />
                        
                    </div>
                </form>
                <div className=" grid justify-center items-center px-2 py-6 mt-20">
                    <p className="mb-5 text-sm font-bold">Or Continue with</p>
                    <div className="flex space-x-4">
                        <a href="#" >
                            <FaGoogle className="bg-gray-500 border-4 border-[#EE7F61] text-white rounded- p-1 text-2xl"/>
                        </a>
                        <a href="#" >
                            <FaFacebook className="bg-gray-500 border-4 border-[#EE7F61] text-white rounded p-1 text-2xl"/>
                        </a>
                        <a href="#" >
                            <FaApple className="bg-[#EE7F61] text-white  border-4 border-gray-500 rounded p-1 text-2xl"/>
                        </a>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center space-x-2 mt-10">
                    <p className="text-gray-500">Don't have an Account?</p>
                    <p className="text-[#EE7F61] font-semibold cursor-pointer hover:underline">
                        Sign Up
                    </p>
                </div>
            </div>
        </div>
    </>
  );
};

export default Signin;

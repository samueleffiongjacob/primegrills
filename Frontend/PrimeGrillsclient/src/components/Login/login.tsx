import messagebox from "../../assets/images/messagebox.png"
import padlock from "../../assets/images/padlock.png"
import eye from "../../assets/images/eye.png"

const Signin =() => {
    return (
    <>
        <div className=" h-screen flex justify-center item-center ">
            {/* form  */}
            <div className="bg-white h-{874px} w-1/2 flex flex-col px-3 py-3 rounded-2xl">
                <div className="bg-gray-500 w-full h-{77px} m-0  box-content size-32">
                    <p className="text-white font-bold text-left">10:27</p>
                </div>
                <form action="">
                    
                    <div className=" mt-10">
                        <p className="font-semibold text-2xl tracking-wide"> Signin</p>
                    </div>
                    <div className="relative py-3">
                        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <img src={messagebox} alt="message" className="h-4 w-4" />
                        </span>
                        <input type="text" id="input-group-1" className=" flex bg-white shadow-md border-t text-gray-900 text-sm w-full rounded-2xl ring-orange-500 border-orange-500  ps-10 p-2.5" placeholder="Email"/>
                        
                    </div>
                    <div className="relative py-3">
                        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <img src={padlock} alt="padlock" className="h-3 w-3" />
                        </span>
                        <input type="text" id="input-group-1" className="bg-white shadow-md border-t border-gray-300 text-gray-900 text-sm w-full rounded-2xl ring-orange-500   ps-10 p-2.5" placeholder="Password"/>
                        <span className="absolute inset-y-0 text-base right-0 flex items-center ps-5 pointer-events-none">
                            <img src={eye} alt="eye" className="h-4 w-4" />
                        </span>
                    </div>


                </form>
            </div>
        </div>
    </>
    )
}

export default Signin;
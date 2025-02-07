import { FaStar } from 'react-icons/fa';
import customer from '../../assets/images/customer.png';
import test1 from '../../assets/images/test1.jpeg';
import test2 from '../../assets/images/test1.jpeg';
import test3 from '../../assets/images/test1.jpeg';
import test4 from '../../assets/images/test1.jpeg';

const Testimonials = () => {
    return (
        <div>
            <div className="container grid grid-cols-1 md:grid-cols-2 lg:px-32 px-5 gap-8">
                {/* Left Column: Image and Chef Info */}
                <div className="relative flex flex-col items-center">
                    <img src={customer} alt="" className="rounded-lg bg-[#EE7F61] w-80 h-auto" />
                    <div className="absolute bottom-0 right-20 bg-white flex items-center px-4 py-2 rounded-lg shadow-md">
                        <h2 className="text-black font-bold mr-2">Our best chef</h2>
                        <span className="text-xl">😍</span>
                    </div>
                </div>

            {/* Right Column: Testimonials */}
                <div className="space-y-6">
                    <h1
                    className="bg-clip-text text-transparent font-semibold text-sm tracking-wide px-2"
                    style={{
                        backgroundColor: '#EE7F61',
                        letterSpacing: '0.4em',
                    }}
                    >
                    TESTIMONIALS
                    </h1>
                    <p className="text-4xl font-bold px-2 leading-tight">
                    What our Customers <br /> say about us
                    </p>
                    <p
                        className="text-left py-2 leading-relaxed px-2"
                        style={{
                            lineHeight: '35px',
                        }}
                        >
      I had the pleasure of dining at Prime and Grills this evening, and the
      experience was intriguing as every bite was an example of a sumptuous
      meal. Thank you so much Prime and Grills for being outstanding.
    </p>

    {/* Feedback Section */}
    <div className="flex flex-col lg:flex-row items-center gap-6">
      {/* Customer Images */}
      <div className="flex  ">
        <img src={test1} alt="" className="w-8 h-8 object-cover rounded-full" />
        <img src={test2} alt="" className="w-8 h-8 object-cover rounded-full" />
        <img src={test3} alt="" className="w-8 h-8 object-cover rounded-full" />
        <img src={test4} alt="" className="w-8 h-8 object-cover rounded-full" />
      </div>

      {/* Feedback Text */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold">Customers' Feedback</h2>
        <p className="flex items-center justify-center lg:justify-start gap-2 text-xl">
          <FaStar className="text-[#EE7F61]" />
          <span className="font-bold">4.9</span> (90.7k Reviews)
        </p>
      </div>
    </div>
  </div>
</div>

            {/* <div className=" container grid grid-cols-1 md:grid-cols-2 lg:px-32 px-5 ">
                <div className='relative'>
                    <img src={customer} alt="" className='rounded-lg bg-[#EE7F61] w-80 h-100' />
                    <div className="absolute bottom-0 right-40 m bg-white flex px-4 py-2 rounded-lg shadow-md">
                        
                        <h2 className="text-black font-bold">Our best chef</h2>
                        <span className="text-xl">😍</span>
                    </div>
                </div>
                <div className='space-y-3'>
                    <h1 className=" bg-clip-text text-transparent font-semibold text-sm px-2  "
                                style={{
                                    backgroundColor: '#EE7F61',
                                    letterSpacing: '0.4em',
                                }}>TESTIMONIALS</h1>
                    <p className="text-4xl font-bold  px-2  ">what our Customers <br/> say about us</p>
                    < p className="text-left py-2 " style={{
                                    lineHeight:'35px',
                                    
                                }}>I had the pleasure of dining at Prime and Grills this<br/>
                    evening, and the experience was intriguing as every bite<br/>
                    was an example of a sumptous meal. Thank you so much<br/>
                    Prime and grills for being outstanding.</p>
                </div>
                <div className='flex'>
                    <div className="flex">
                        <img src={test1} alt="" className="w-40 h-40 object-cover rounded-lg" />
                        <img src={test1} alt="" className="w-40 h-40 object-cover rounded-lg" />
                        <img src={test1} alt="" className="w-40 h-40 object-cover rounded-lg" />
                        <img src={test1} alt="" className="w-40 h-40 object-cover rounded-lg" />
                    </div>
                    <div >
                     <h2>Customers` Feedback</h2>
                     <p> <FaStar /> <span>4.9</span> (90.7k Reviews) </p>
                    </div>           
                </div>
                
            </div> */}
        </div>
        
    )
}
export default Testimonials;
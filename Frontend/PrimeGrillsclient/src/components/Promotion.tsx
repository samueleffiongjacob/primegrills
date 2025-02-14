import Promote from ".././assets/images/promotionimage.png";
const Promotion = () => {
    return(
        <div className="  justify-center items-center  my-10 mx-10">
                    <div className="px-4">
                        <h2 className="text-lg font-bold mb-4">Promotion</h2>
                        <div
                        className="flex flex-row items-start justify-between rounded-4xl p-4 py-15 relative"
                        style={{
                            background: "linear-gradient(97.01deg, #EE7F61 5.44%, #884938 105.78%)",
                        }}
                        >
                            {/* Text Content */}
                            <div className="text-white">
                                <p className="text-sm mb-4">Today's Offer</p>
                                <h2 className="text-xl font-bold mb-4">A Free Box of Fries</h2>
                                <p className="text-sm">On All Orders above #10,000</p>
                            </div>
                            {/* Image */}
                            <img
                                src={Promote}
                                alt="PromotionImage"
                                className="w-40 h-40 object-contain absolute bottom-12 right-0"
                            />
                        </div>
                    </div>
                </div>
    )
}
export default Promotion;
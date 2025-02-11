const Button = (props) => {
    return (
        <div>
            <button 
                className="px-6 py-3 border border-orange text-white rounded-full
                          shadow-[-2px_22px_38px_0px_rgba(238,127,97,0.29)]
                          bg-[#EE7F61] 
                          hover:bg-white hover:text-[#EE7F61]
                          transform hover:scale-105
                          transition-all duration-300 ease-in-out"
            >
                {props.title}
            </button>
        </div>
    )
}

export default Button;
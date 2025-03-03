interface ButtonProps {
    title: string;
    disabled?: boolean; // Optional if you want it to default to `false`
    onClick?: () => void; // Optional for click handling
  }
  
  const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
    return (
        <div>
            <button 
                onClick={onClick}
                className="px-6 py-3 border border-orange text-white rounded-full
                          shadow-[-2px_22px_38px_0px_rgba(238,127,97,0.29)]
                          bg-[#EE7F61] 
                          hover:bg-white hover:text-[#EE7F61]
                          transform hover:scale-105
                          transition-all duration-300 ease-in-out"
            >
                {title}
            </button>
        </div>
    )
}

export default Button;
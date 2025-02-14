import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
  isActive?: boolean;
  onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
    className = "", 
    isMobile = false,
    isActive = false,
    onClose
  }) => {
    if (isMobile) {
      return (
        <div 
          className={`
            fixed top-0 left-0 h-20 
            flex items-center
            transition-all duration-300 ease-in-out
            ${isActive ? 'w-full px-4' : 'w-10 ml-auto'}
            ${className}
          `}
        >
          {isActive ? (
            <div className="relative w-full flex items-center">
              <input
                type="search"
                placeholder="Search menu items..."
                className="w-full py-2 px-4 pr-10 text-gray-700 bg-white border border-[#EE7F61] rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-opacity-50
                  placeholder:text-gray-400 text-sm"
                autoFocus
              />
              <button 
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EE7F61]"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onClose}
              className="ml-auto p-2 text-[#EE7F61]"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          )}
        </div>
      );
    }
    
  
    return (
      <div className={`relative ${className}`}>
        <input
          type="search"
          placeholder="Search menu items..."
          className="w-full py-2 px-4 pr-10 text-gray-700 bg-white border border-[#EE7F61] rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-opacity-50
                    placeholder:text-gray-400 text-sm"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EE7F61] w-5 h-5" />
      </div>
    );
  };
  
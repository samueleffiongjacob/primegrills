import { useContext } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { SearchContext } from '../context/SearchContext';
import primeLogo from '@assets/images/primeLogo.png';
import { useAuth } from '../context/authContext';

type dateOptionsType = {
    [key: string]: string;
}

function HeaderBar() {
  const dateOptions: dateOptionsType = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const {user} = useAuth();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const today = new Date().toLocaleDateString('en-US', dateOptions);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
        <div className="h-26 bg-transparent flex items-center space-x-4 justify-between px-4 m-4">
            <img 
            src={primeLogo} 
            alt="Prime Grills Logo"
            className=" h-24 w-24 rounded-full border-primary" />

            <input 
            type="search" 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for Food, Drinks, Snacks, etc." 
            className="w-1/2 h-20 border-4 active:border-primary bg-secondary border-primary rounded-4xl px-2" />

            {/* Date before profile */}
            <p className="text-gray-200 text-md font-semibold">{today}</p>

            {/* Dropdown Menu */}
            
            <div className="flex min-w-[376px] items-center space-x-4 border-l-6 pl-4 border-primary">
              <div className="flex items-center space-x-2">
                <img 
                src={user?.profileImage} 
                alt="Profile" 
                className="h-22 w-22 rounded-full" />
                <p className="text-gray-200 text-md font-bold">{user?.username}, {user?.staff_profile.role}</p>
              </div>

              <MdOutlineNotificationsNone className='text-gray-200 text-lg h-10 w-10' />

            </div>
        </div>
    </>
  )
}

export default HeaderBar;
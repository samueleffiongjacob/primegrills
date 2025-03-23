import HeaderBar from '@components/headerBar';
import { SlHome, SlSettings, SlEnvolope } from 'react-icons/sl';
import { LiaFile } from 'react-icons/lia';
import { RxDashboard } from 'react-icons/rx';
import { MdRestaurantMenu } from 'react-icons/md';
import { NavLink, Outlet } from 'react-router-dom';
import OrderTemplate from '@components/OrderTemplate';
import { MenuProvider } from '../context/MenuContext';

function Sidebar() {
    return (
        <>
            <aside className="min-h-[calc(100vh-10.5rem)] mt-10 p-6 justify-center flex">
                <ul className="space-y-8 flex flex-col [&_li]:text-gray-800">
                    <li>
                        <NavLink to="/" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <SlHome color={isActive ? '#EE7F61' : 'currentColor'} className='w-13 h-13' />
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/menus" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <MdRestaurantMenu color={isActive ? '#EE7F61' : 'currentColor'} className='w-13 h-13' />
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <LiaFile color={isActive ? '#EE7F61' : 'currentColor'} className='w-13 h-13' />
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <RxDashboard color={isActive ? '#EE7F61' : 'currentColor'} className='w-13 h-13' />
                            )}
                        </NavLink>
                    </li>
                    <li className="text-lg font-semibold">
                        <NavLink to="/settings" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <SlSettings color={isActive ? '#EE7F61' : 'currentColor'} className='h-13 w-13' />
                            )}
                        </NavLink>
                    </li>
                    <li className="text-lg font-semibold">
                        <NavLink to="/message" className={({ isActive }) => `flex items-center text-2xl ${isActive ? 'text-primary' : ''}`}>
                            {({ isActive }) => (
                                <SlEnvolope color={isActive ? '#EE7F61' : 'currentColor'} className='h-13 w-13' />
                            )}
                        </NavLink>
                    </li>
                </ul>
            </aside>
        </>
    );
};

function Mainframe() {
  return (
    <MenuProvider>
        <div className="flex flex-col bg-background/71 w-full">
            <header>
                <HeaderBar />
            </header>

            <main className="w-full flex overflow-hidden"> {/* Updated this line */}
                <Sidebar />
                <div className="flex-1 overflow-hidden"> {/* Added this wrapper */}
                    <Outlet />
                </div>
                <div className='ml-auto right-0'>
                    <OrderTemplate />
                </div>
            </main>
        </div>      
    </MenuProvider>
  );
};

export default Mainframe;
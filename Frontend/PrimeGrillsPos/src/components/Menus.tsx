import { useEffect, useState, useContext } from 'react'
import { Grid, List } from 'lucide-react'
import { Card} from './UI/Card';
import { useMenu } from '../context/MenuContext';
import { SearchContext } from '../context/SearchContext';
import product3 from '@assets/images/product3.png';
import product2 from '@assets/images/product2.png';
import product1 from '@assets/images/product1.png';
// import menu1 from '@assets/images/menuimg1.png';
// import menu2 from '@assets/images/menuimg2.png';
// import menu3 from '@assets/images/menuimg3.png';

function Menus() {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { addToOrder, removeFromOrder, orders } = useMenu();
    const { searchQuery } = useContext(SearchContext);

    // const categories = [
    //     { id: 1, name: 'All Menu', icon: <Home className="w-6 h-6" /> },
    //     { id: 2, name: 'Nigerian', image: menu1 },
    //     { id: 3, name: 'Pizza', image: menu2 },
    //     { id: 4, name: 'Pastries', image: menu3 },
    //     { id: 5, name: 'Grills', image: menu1 },
    //     { id: 6, name: 'Bar', image: menu2 },
    // ];

    const menuItemsList = [
        { id: 1, name: 'Pastries', price: 8000, image: product1, category: 'Pastries' },
        { id: 2, name: 'Nigerian', price: 8000, image: product2, category: 'Nigerian' },
        { id: 3, name: 'Pepper Noodle', price: 8000, image: product3, category: 'Nigerian' },
        { id: 4, name: 'Shawarma', price: 8000, image: product1, category: 'Grills' },
        { id: 5, name: 'Assorted', price: 8000, image: product2, category: 'Grills' },
        { id: 6, name: 'Nigerian', price: 8000, image: product3, category: 'Nigerian' },
        { id: 7, name: 'Grills Fish', price: 8000, image: product1, category: 'Grills' },
        { id: 8, name: 'Assorted', price: 8000, image: product2, category: 'Pizza' },
        { id: 9, name: 'Grills Fish', price: 8000, image: product3, category: 'Bar' },
        { id: 10, name: 'Assorted', price: 8000, image: product1, category: 'Bar' },
    ];

    const [filteredMenus, setFilteredMenus] = useState(menuItemsList);

    const handleItemClick = (item: typeof menuItemsList[0]) => {
        setSelectedItems(prev => {
            const isSelected = prev.includes(item.id);
            if (isSelected) {
                removeFromOrder(item.id);
                return prev.filter(id => id !== item.id);
            } else {
                addToOrder({
                    ...item,
                    quantity: 1,
                    category: item.category // || selectedCategory
                });
                return [...prev, item.id];
            }
        });
    };

    const filterMenuItems = () => {
        let filtered = menuItemsList;
        
        // if (selectedCategory !== 'All Menu') {
        //     filtered = filtered.filter((item) => item.category === selectedCategory);
        // }

        if (searchQuery) {
            filtered = filtered.filter((item) => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredMenus(filtered);
    };

    useEffect(() => {
        filterMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    useEffect(() => {
        setSelectedItems(prev => {
            const order = orders.map(order => order.id);
            return prev.filter(id => order.includes(id));
        });
    }, [orders]);

    return (
        <div className="p-6 max-h-[calc(100vh-7.5rem)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-primary font-bold">Menu Items</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="categories-section mb-8">
                {/* ...existing categories code... */}
            </div>

            {/* Menu Items */}
            <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "flex flex-col space-y-4"
            }>
                {filteredMenus.map((item) => (
                    <Card 
                        key={item.id}
                        className={`${viewMode === 'grid' 
                            ? 'h-60 p-2 pt-4 w-full' 
                            : 'h-24 p-2 w-full'} 
                            relative flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} 
                            items-center overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-shadow rounded-3xl cursor-pointer
                            ${selectedItems.includes(item.id) ? 'bg-primary/75' : 'bg-black/45'}`}
                        onClick={() => handleItemClick(item)}
                    >
                        {selectedItems.includes(item.id) && (
                            <div className='absolute z-10 top-1 right-2 bg-amber-700 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full'>
                                {orders.find(order => order.id === item.id)?.quantity}
                            </div>
                        )}
                        <img
                            src={item.image}
                            alt={item.name}
                            className={viewMode === 'grid' 
                                ? "w-45 h-40 object-cover rounded-3xl"
                                : "w-20 h-20 object-cover rounded-xl"}
                        />
                        <div className={`p-2 ${viewMode === 'grid' ? 'mt-auto' : 'ml-4'} flex-1`}>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className={`${selectedItems.includes(item.id) ? 'text-black/70' : 'text-primary'} font-bold`}>
                                ₦{item.price.toLocaleString()}
                            </p>
                            {viewMode === 'list' && (
                                <p className="text-gray-400 text-sm">{item.category}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Menus;
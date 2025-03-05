import { ChevronLeft, ChevronRight, Home, } from 'lucide-react'
import { useEffect, useState, useContext } from 'react'
import { Card, CardContent } from './UI/Card';
import product3 from '@assets/images/product3.png';
import product2 from '@assets/images/product2.png';
import product1 from '@assets/images/product1.png';
import menu1 from '@assets/images/menuimg1.png';
import menu2 from '@assets/images/menuimg2.png';
import menu3 from '@assets/images/menuimg3.png';
import { useMenu } from '../context/MenuContext';
import { SearchContext } from '../context/SearchContext';

function FoodItems() {

    const [selectedCategory, setSelectedCategory] = useState('All Menu');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const { addToOrder, removeFromOrder, orders } = useMenu();
    const { searchQuery } = useContext(SearchContext);
  
const categories = [
    { id: 1, name: 'All Menu', icon: <Home className="w-10 h-10 items-center text-center " /> },
    { id: 2, name: 'Nigerian', image: menu1 },
    { id: 3, name: 'Pizza', image: menu2 },
    { id: 4, name: 'Pastries', image: menu3 },
    { id: 5, name: 'Grills', image: menu1 },
    { id: 6, name: 'Bar', image: menu2 },
];

const menuItemsList = [
    { id: 1, name: 'Pastries', price: 8000, image: product1, category: 'Pastries' },
    { id: 2, name: 'Nigerian', price: 8000, image: product2, category: 'Nigerian' },
    { id: 3, name: 'Pepper Noodle', price: 8000, image: product3, category: 'Nigerian' },
    { id: 4, name: 'Shawarma', price: 8000, image: product1, category: 'Grills' },
    { id: 5, name: 'Assorted', price: 8000, image: product2, category: 'Grills' },
    { id: 6, name: 'Nigerian', price: 8000, image: product3, category: 'Nigerian' },
    { id: 7, name: 'Grills Fish', price: 8000, image: product1, category: 'Grills' },
    { id: 8, name: 'Assorted', price: 8000, image: product2, category: 'Grills' },
    { id: 9, name: 'Grills Fish', price: 8000, image: product3, category: 'Grills' },
    { id: 10, name: 'Assorted', price: 8000, image: product1, category: 'Grills' },
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
            category: item.category || selectedCategory
        });
        return [...prev, item.id];
      }
    });
  };

  const handleCategory = (item: typeof categories[0]) => {
    setSelectedCategory(item.name);
  }

  const filterMenuItems = () => {
    let filtered = menuItemsList;
    
    // Filter by category
    if (selectedCategory !== 'All Menu') {
        filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter((item) => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    setFilteredMenus(filtered);
};

// Update filters when search query or category changes
useEffect(() => {
    filterMenuItems();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSelectedItems(prev => {
        const order = orders.map(order => order.id);
        return prev.filter(id => order.includes(id));
    });
}, [orders]);

  return (
    <>
    <div className="p-6 max-h-[calc(100vh-7.5rem)]">
        <h2 className="text-xl mb-4 text-primary font-bold">Menu Category</h2>
        <div className="flex items-center gap-4 relative">
            <button 
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={() => {
                const container = document.querySelector('.scroll-container');
                if (container) {
                container.scrollLeft -= 200;
                }
            }}
            >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex gap-4 overflow-x-auto w-full pb-4 hide-scrollbar-x scroll-container">
            {categories.map((category) => (
            <button
            key={category.id}
            onClick={() => handleCategory(category)}
            className={`flex flex-col text-center items-center min-w-[100px] p-4 rounded-lg transition-colors ${
                selectedCategory === category.name
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            >
            {category.icon || (
                <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 rounded-lg object-cover mb-2"
                />
            )}
            <span className="text-lg italic font-medium">{category.name}</span>
            </button>
            ))}
            </div>
            <button 
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={() => {
                const container = document.querySelector('.scroll-container');
                if (container) {
                container.scrollLeft += 200;
                }
            }}
            >
            <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
        </div>

        {/* Menu Items Grid */}
        <h2 className="text-xl text-primary font-bold mt-8 mb-4">{selectedCategory}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-y-6 gap-4">
          {filteredMenus.map((item: typeof menuItemsList[0]) => (
            <Card 
              key={item.id} 
              className={`h-60 p-2 pt-4 w-full relative flex flex-col justify-center items-center overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-shadow rounded-3xl cursor-pointer
                ${selectedItems.includes(item.id) ? 'bg-primary/75' : 'bg-black/45'}`}
              onClick={() => handleItemClick(item)}
            >
                  {selectedItems.includes(item.id) && (
                    <div className='absolute z-10 top-1 right-2 bg-amber-700 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full'>
                      {orders.find(order => order.id === item.id)?.quantity}
                    </div>
                  )}
              <CardContent className="pb-2 ">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-45 h-40 object-cover rounded-3xl"
                />
                <div className="p-2 mt-auto">
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className={`${selectedItems.includes(item.id) ? 'text-black/70' : 'text-primary'} font-bold`}>₦{item.price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default FoodItems;
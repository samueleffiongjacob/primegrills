import { ChevronRight, Home } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from './UI/Card';
import product3 from '@assets/images/product3.png';
import product2 from '@assets/images/product2.png';
import product1 from '@assets/images/product1.png';
import menu1 from '@assets/images/menuimg1.png';
import menu2 from '@assets/images/menuimg2.png';
import menu3 from '@assets/images/menuimg3.png';
import { useMenu } from '../context/MenuContext';

function FoodItems() {

    const [selectedCategory, setSelectedCategory] = useState('All Menu');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const { addToOrder } = useMenu();
  
const categories = [
    { id: 1, name: 'All Menu', icon: <Home className="w-6 h-6" /> },
    { id: 2, name: 'Nigerian', image: menu1 },
    { id: 3, name: 'Pizza', image: menu2 },
    { id: 4, name: 'Pastries', image: menu3 },
    { id: 5, name: 'Grills', image: menu1 },
    { id: 6, name: 'Bar', image: menu2 },
];

const menuItems = [
    { id: 1, name: 'Pastries', price: 8000, image: product1 },
    { id: 2, name: 'Nigerian', price: 8000, image: product2 },
    { id: 3, name: 'Pepper Noodle', price: 8000, image: product3 },
    { id: 4, name: 'Shawarma', price: 8000, image: product1 },
    { id: 5, name: 'Assorted', price: 8000, image: product2 },
    { id: 6, name: 'Nigerian', price: 8000, image: product3 },
    { id: 7, name: 'Grills Fish', price: 8000, image: product1 },
    { id: 8, name: 'Assorted', price: 8000, image: product2 },
    { id: 9, name: 'Grills Fish', price: 8000, image: product3 },
    { id: 10, name: 'Assorted', price: 8000, image: product1 },
];

const handleItemClick = (item: typeof menuItems[0]) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(item.id);
      if (isSelected) {
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
  
  return (
    <>
    <div className="p-6 max-h-[calc(100vh-7.5rem)]">
        <h2 className="text-xl text-gray-600 mb-4">Menu Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex flex-col items-center min-w-[100px] p-4 rounded-lg transition-colors ${
                selectedCategory === category.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.icon || (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 rounded-lg object-cover mb-2"
                />
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
          <button className="p-2 bg-gray-200 rounded-full">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Menu Items Grid */}
        <h2 className="text-xl text-gray-600 mt-8 mb-4">All Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.id} 
              className={`h-60 flex flex-col justify-center items-center overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-shadow rounded-3xl cursor-pointer
                ${selectedItems.includes(item.id) ? 'bg-primary/75' : 'bg-black/45'}`}
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-0 h-30 ">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-30 h-20 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-primary font-bold">₦{item.price.toLocaleString()}</p>
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
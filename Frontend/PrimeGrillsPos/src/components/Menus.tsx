import { useState } from 'react';
import { Card, CardContent } from './UI/Card';
import { useMenu } from '../context/MenuContext';
import product3 from '@assets/images/product3.png';
import product2 from '@assets/images/product2.png';
import product1 from '@assets/images/product1.png';


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

function Menus() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { addToOrder } = useMenu();

  const handleItemClick = (item: typeof menuItems[0]) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(item.id);
      if (isSelected) {
        return prev.filter(id => id !== item.id);
      } else {
        addToOrder({
          ...item,
          quantity: 1,
          category: ''
        });
        return [...prev, item.id];
      }
    });
  };

  return (
    <div className="p-6 max-h-[calc(100vh-7.5rem)]">
      <h2 className="text-xl text-gray-600 mt-8 mb-4">All Menu</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {menuItems.map((item) => (
          <Card 
            key={item.id} 
            className={`h-60 flex flex-col justify-center items-center overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-shadow rounded-3xl cursor-pointer
              ${selectedItems.includes(item.id) ? 'bg-primary/75' : 'bg-black/45'}`}
            onClick={() => handleItemClick(item)}
          >
            <CardContent className="p-0 h-30">
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
  );
}

export default Menus;
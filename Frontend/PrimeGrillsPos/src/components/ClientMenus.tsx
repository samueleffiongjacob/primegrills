import { useState, useEffect } from 'react';
import { Card, CardContent } from './UI/Card';
import product3 from '@assets/images/product3.png';
import product2 from '@assets/images/product2.png';
import product1 from '@assets/images/product1.png';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    image: string;
    available?: boolean;
}

// Dummy data for initial render
const dummyMenuItems: MenuItem[] = [
    { id: 1, name: 'Pastries', price: 8000, image: product1, available: true },
    { id: 2, name: 'Nigerian', price: 8000, image: product2, available: true },
    { id: 3, name: 'Pepper Noodle', price: 8000, image: product3, available: false },
    { id: 4, name: 'Shawarma', price: 8000, image: product1, available: true },
    { id: 5, name: 'Assorted', price: 8000, image: product2, available: true },
    { id: 6, name: 'Nigerian', price: 8000, image: product3, available: true },
];

function ClientMenus() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(dummyMenuItems);

    useEffect(() => {
        // WebSocket connection setup
        const ws = new WebSocket('ws://your-websocket-server-url');

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMenuItems(data);
            } catch (error) {
                console.error('WebSocket data parsing error:', error);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="p-6 max-h-screen">
            <h2 className="text-xl text-primary font-bold mt-8 mb-4">Available Menu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {menuItems.map((item) => (
                    <Card 
                        key={item.id} 
                        className={`h-60 flex flex-col justify-center items-center overflow-hidden 
                            transition-all duration-300 bg-black/45 rounded-3xl
                            ${!item.available ? 'opacity-50' : ''}`}
                    >
                        <CardContent className="p-0 h-30 relative">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-30 h-20 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-bold text-white">{item.name}</h3>
                                <p className="text-primary font-bold">
                                    ₦{item.price.toLocaleString()}
                                </p>
                                {!item.available && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                                        Unavailable
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>    
        </div>
    );
}

export default ClientMenus;

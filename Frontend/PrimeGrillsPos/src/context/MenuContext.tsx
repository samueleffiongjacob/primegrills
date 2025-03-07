import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for a menu item
interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    description?: string;
    image?: string;
}

interface OrderItem extends MenuItem {
    quantity: number;
}

// Define the context type
interface MenuContextType {
    menuItems: MenuItem[];
    addMenuItem: (item: MenuItem) => void;
    removeMenuItem: (id: number) => void;
    updateMenuItem: (id: number, updatedItem: MenuItem) => void;
    orders: OrderItem[];
    addToOrder: (item: OrderItem) => void;
    removeFromOrder: (id: number) => void;
    updateOrderQuantity: (id: number, quantity: number) => void;
    filteredItems: MenuItem[];
    setFilteredItems: (items: MenuItem[]) => void;
}

// Create the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Create a provider component
export function MenuProvider({ children }: { children: ReactNode }) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

    const addMenuItem = (item: MenuItem) => {
        setMenuItems([...menuItems, item]);
    };

    const removeMenuItem = (id: number) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const updateMenuItem = (id: number, updatedItem: MenuItem) => {
        setMenuItems(menuItems.map(item => 
            item.id === id ? updatedItem : item
        ));
    };

    const addToOrder = (item: OrderItem) => {
        setOrders(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev;  // Don't modify existing items
            }
            // For new items, use the quantity provided (should be 1)
            return [...prev, { ...item }];
        });
    };

    const removeFromOrder = (id: number) => {
        setOrders(prev => prev.filter(item => item.id !== id));
    };

    const updateOrderQuantity = (id: number, quantity: number) => {
        setOrders(prev => 
            quantity === 0 
                ? prev.filter(item => item.id !== id)
                : prev.map(item => 
                    item.id === id ? { ...item, quantity } : item
                )
        );
    };

    const value = {
        menuItems,
        addMenuItem,
        removeMenuItem,
        updateMenuItem,
        orders,
        addToOrder,
        removeFromOrder,
        updateOrderQuantity,
        filteredItems,
        setFilteredItems,
    };

    return (
        <MenuContext.Provider value={value}>
            {children}
        </MenuContext.Provider>
    );
}

// Create a custom hook to use the menu context
// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
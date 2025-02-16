/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useContext, ReactNode } from 'react';

interface OrderItem {
    id: string | number;
    price: number;
    [key: string]: any; // for other potential item properties
}

interface Order {
    items: OrderItem[];
    total: number;
    tableNumber: number | null;
    status: 'pending' | 'completed' | 'cancelled';
}

interface OrderContextType {
    currentOrder: Order;
    addItem: (item: OrderItem) => void;
    removeItem: (itemId: string | number) => void;
    clearOrder: () => void;
    setTableNumber: (number: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useOrder(): OrderContextType {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}

interface OrderProviderProps {
    children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
    const [currentOrder, setCurrentOrder] = useState<Order>({
        items: [],
        total: 0,
        tableNumber: null,
        status: 'pending'
    });

    const addItem = (item: OrderItem) => {
        setCurrentOrder(prev => ({
            ...prev,
            items: [...prev.items, item],
            total: prev.total + item.price
        }));
    };

    const removeItem = (itemId: string | number) => {
        setCurrentOrder(prev => {
            const itemToRemove = prev.items.find(item => item.id === itemId);
            return {
                ...prev,
                items: prev.items.filter(item => item.id !== itemId),
                total: prev.total - (itemToRemove ? itemToRemove.price : 0)
            };
        });
    };

    const clearOrder = () => {
        setCurrentOrder({
            items: [],
            total: 0,
            tableNumber: null,
            status: 'pending'
        });
    };

    const setTableNumber = (number: number) => {
        setCurrentOrder(prev => ({
            ...prev,
            tableNumber: number
        }));
    };

    const value: OrderContextType = {
        currentOrder,
        addItem,
        removeItem,
        clearOrder,
        setTableNumber
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}
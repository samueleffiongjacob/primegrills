import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/UI/Card';
import { FcSupport } from 'react-icons/fc';
import { PiSealPercentFill } from 'react-icons/pi';
import { FaSearchDollar } from 'react-icons/fa';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface OrderData {
    orderType: string;
    items: OrderItem[];
    tax: number;
    discount: number;
    isProcessing: boolean;
}

const ClientOrderTemplate = () => {
    const [orderData, setOrderData] = useState<OrderData>({
        orderType: 'dineIn',
        items: [],
        tax: 10,
        discount: 20,
        isProcessing: false
    });

    useEffect(() => {
        // Create WebSocket connection
        const ws = new WebSocket('ws://your-websocket-server-url');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setOrderData(data);
        };

        return () => {
            ws.close();
        };
    }, []);

    const calculateSubtotal = () => {
        return orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = (subtotal * orderData.tax) / 100;
        const discountAmount = (subtotal * orderData.discount) / 100;
        return subtotal + taxAmount - discountAmount;
    };

    return (
        <Card className="min-w-100 min-h-screen max-w-md m-auto bg-[#171943] text-white bottom-0 p-6">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-center top-0">Order 1</CardTitle>
                <div className="flex gap-4 justify-center mt-4">
                    <div className={`px-4 py-2 rounded-2xl ${
                        orderData.orderType === 'dineIn' ? 'bg-primary' : 'bg-gray-700'
                    }`}>
                        Dine In
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                        orderData.orderType === 'takeAway' ? 'bg-primary' : 'bg-gray-700'
                    }`}>
                        Take Away
                    </div>
                </div>
            </CardHeader>
            <CardContent className="float-end">
                <div className="space-y-4 flex flex-col justify-center">
                    <div className="space-y-2 min-h-[5rem] max-h-[10rem] overflow-y-auto hide-scrollbar">
                        {orderData.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center py-2 border-b border-gray-700"
                            >
                                <p className="flex-1">{item.name}</p>
                                <div className="flex items-center space-x-4">
                                    <span className='p-2 bg-white h-10 min-w-10 text-primary font-bold text-center items-center rounded-lg'>
                                        {item.quantity}
                                    </span>
                                    <span className="w-24 text-right">
                                        ₦{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 border-b-3 border-gray-400">
                        {/* Info Icons Section */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="p-2 rounded-2xl">
                                <PiSealPercentFill className="w-7 h-10 text-white" />
                            </div>
                            Discounts
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="p-2 rounded-2xl">
                                <FcSupport className="w-7 h-10 text-white" />
                            </div>
                            Services
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="p-2 rounded-2xl">
                                <FaSearchDollar className="w-7 h-10 text-white" />
                            </div>
                            Taxes
                        </div>
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{orderData.tax}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>{orderData.discount}%</span>
                        </div>
                        <div className="flex justify-between font-bold py-2 px-2 border-2 border-dashed border-gray-500">
                            <span>Total</span>
                            <span>₦{calculateTotal().toLocaleString()}</span>
                        </div>
                    </div>

                    {orderData.isProcessing && (
                        <div className="flex items-center justify-center rounded-2xl text-gray-300 bg-primary/80 m-auto mt-6 p-4">
                            <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span>Processing Order...</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ClientOrderTemplate;
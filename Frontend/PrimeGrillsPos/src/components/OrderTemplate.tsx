import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/UI/Card';
import { Button } from '@components/UI/Button';
import { FcSupport } from 'react-icons/fc';
import { PiSealPercentFill } from 'react-icons/pi';
import { FaSearchDollar } from 'react-icons/fa';
import { useMenu } from '../context/MenuContext';
import { showToast } from '@utils/toast';

const OrderTemplate = () => {
  const [orderType, setOrderType] = useState('dineIn');
  const [tax, setTax] = useState(10);
  const [discount, setDiscount] = useState(20);
  const [Isprocess, setIsprocess] = useState(false);

  const { orders, removeFromOrder, updateOrderQuantity } = useMenu();

  const calculateSubtotal = () => {
    return orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleAddItem = (item: typeof orders[0]) => {
    updateOrderQuantity(item.id, item.quantity + 1);
  };

  const handleRemoveItem = (item: typeof orders[0]) => {
    if (item.quantity > 0) {
      updateOrderQuantity(item.id, item.quantity - 1);
    } else {
      removeFromOrder(item.id);
    }
  };

  const handleProcess = async () => {
      setIsprocess(true);
      await showToast.promise(
        new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: "Processing Order ...",
        success: "Order Completed",
        error: "Error Processing Order"
      }
    );
    setIsprocess(false)
    
  };

  return (
    <>
      <Card className="min-w-100 min-h-[calc(100vh-7.5rem)] max-w-md m-auto bg-[#171943] text-white bottom-0 p-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center top-0 ">Order OR-1425</CardTitle>
          <div className="flex gap-4 justify-center mt-4">
            <Button
              variant={orderType === 'dineIn' ? 'primary' : 'ghost'}
              onClick={() => setOrderType('dineIn')}
              className="bg-coral-pink text-white rounded-2xl"
            >
              Dine In
            </Button>
            <Button
              variant={orderType === 'takeAway' ? 'primary' : 'ghost'}
              onClick={() => setOrderType('takeAway')}
              className='text-white rounded-2xl'
            >
              Take Away
            </Button>
          </div>
        </CardHeader>
        <CardContent className="float-end mt-auto">
          <div className="space-y-4 flex flex-col justify-center  overflow-auto">
            <div className="space-y-2 min-h-[5rem] max-h-[10rem] overflow-y-auto hide-scrollbar">
              {orders.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-700 space-x-6"
                >
                  <p className="flex-1">{item.name}</p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="p-1 bg-primary -mr-1 z-10 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className='p-2 bg-white h-10 min-w-10 text-primary font-bold text-center items-center rounded-lg'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="p-1 bg-primary -ml-1 rounded"
                    >
                      <Plus size={16} />
                    </button>
                    <span className="w-24 text-right">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 border-b-3 border-gray-400">

              <div className="flex flex-col justify-center items-center">
                  <Button 
                      variant="ghost" 
                      className="flex-1 rounded-2xl p-2"
                      onClick={() => setDiscount(prev => prev === 20 ? 0 : 20)}
                  >
                      <PiSealPercentFill className="w-7 h-10 mr-2 text-white" />
                  </Button>
                  Discounts
              </div>

              <div className='flex flex-col justify-center items-center'>
                  <Button variant="ghost" className="flex-1 rounded-2xl p-2">
                  <FcSupport className="w-7 h-10 mr-2 text-white" />
                  </Button>
                  Services
              </div>
              
              <div className="flex flex-col justify-center items-center">
                  <Button 
                      variant="ghost" 
                      className="flex-1 rounded-2xl p-2"
                      onClick={() => setTax(prev => prev === 10 ? 0 : 10)}
                  >
                      <FaSearchDollar className="w-7 h-10 mr-2 text-white" />
                  </Button>
                  Taxes
              </div>

            </div>

            <div className="space-y-2 mt-2">
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{tax}%</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>{discount}%</span>
              </div>
              <div className="flex justify-between font-bold py-2 px-2 border-2 border-dashed border-gray-500">
                <span>Total</span>
                <span>₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {Isprocess ? (
              <Button className='flex items-center justify-center rounded-2xl text-gray-300 bg-primary/80 m-auto mt-6' disabled>
                <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Processing Order...</span>
              </Button>
            )
              :(<Button 
              onClick={() => handleProcess()}
              className="w-[calc(100%-20%)] rounded-2xl text-white mt-6 m-auto hover:bg-primary/85">
              Confirm Payment
            </Button>)}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderTemplate;
import { PencilIcon, ArrowDownIcon, ZoomIn } from "lucide-react";

/* import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"; */
//import { OrderModal } from "./OrderModal";
import { useState } from "react";
import { showToast } from '../utils/toast';

interface TableRow {
    img: string;
    name: string;
    amount: string;
    date: string;
    status: 'paid' | 'pending' | 'cancelled';
    account: 'visa' | 'master-card';
    accountNumber: string;
    expiry: string;
}

interface Order {
    id: string;
    customerName: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
  };

const TABLE_HEAD = ["S/N","Transaction", "Amount", "Date", "Status", "Account", ""];

const TABLE_ROWS: (TableRow & { id: number; items: Array<{ name: string; quantity: number; price: number }> })[] = [
    {
        id: 101,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
        name: "John Michael",
        amount: "₦2,500",
        date: "Wed 3:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
        items: [
            { name: "Burger", quantity: 2, price: 1000 },
            { name: "Fries", quantity: 1, price: 500 }
        ]
    },
    {
        id: 102,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
        name: "Alexa Liras", 
        amount: "₦5,000",
        date: "Wed 1:00pm",
        status: "paid",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
        items: [
            { name: "Pizza", quantity: 1, price: 3500 },
            { name: "Soda", quantity: 3, price: 500 }
        ]
    },
    {
        id: 103,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
        name: "Michael Levi",
        amount: "₦3,400",
        date: "Mon 7:40pm", 
        status: "pending",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
        items: [
            { name: "Chicken Wings", quantity: 2, price: 1700 }
        ]
    },
    {
        id: 104,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
        name: "Laurent Perrier",
        amount: "₦1,000",
        date: "Wed 5:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
        items: [
            { name: "Ice Cream", quantity: 2, price: 500 }
        ]
    },
    {
        id: 105,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
        name: "Richard Gran",
        amount: "₦14,000",
        date: "Wed 3:30am",
        status: "cancelled",
        account: "visa", 
        accountNumber: "1234",
        expiry: "06/2026",
        items: [
            { name: "Steak", quantity: 2, price: 7000 }
        ]
    },
    {
        id: 106,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
        name: "John Michael",
        amount: "₦9,990",
        date: "Thu 12:30pm",
        status: "paid",
        account: "master-card",
        accountNumber: "5678",
        expiry: "08/2025",
        items: [
            { name: "Family Pizza", quantity: 1, price: 7990 },
            { name: "Garlic Bread", quantity: 2, price: 1000 }
        ]
    },
    {
        id: 107,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
        name: "Michael Levi",
        amount: "₦12,500",
        date: "Fri 9:00am",
        status: "pending",
        account: "visa",
        accountNumber: "9012",
        expiry: "03/2024",
        items: [
            { name: "Seafood Platter", quantity: 1, price: 12500 }
        ]
    },
    {
        id: 108,
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
        name: "Richard Gran",
        amount: "₦8,400",
        date: "Sat 4:15pm",
        status: "paid",
        account: "master-card",
        accountNumber: "3456",
        expiry: "11/2025",
        items: [
            { name: "Pasta Special", quantity: 2, price: 3200 },
            { name: "Salad", quantity: 2, price: 1000 }
        ]
    }
];

function TransactionsTable() {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleDownload = () => {
        showToast.promise(
          // Your download logic here
          new Promise((resolve) => setTimeout(resolve, 2000)),
          {
            loading: 'Downloading report...',
            success: 'Report downloaded successfully!',
            error: 'Failed to download report',
          }
        );
    };

    return (
        <div className="bg-white h-[90vh] w-full ml-4 flex flex-col rounded-xl shadow-lg">
            {/* Header Section */}
            <div className="p-6 pb-0">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <h5 className="text-xl font-semibold text-gray-800">
                            Recent Orders and Transactions
                        </h5>
                        <p className="text-gray-600 mt-1">
                            These are details about the last transactions of Order
                        </p>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72 relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <ZoomIn className="h-5 w-5 absolute right-3 top-2.5 text-gray-500" />
                        </div>
                        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                            <ArrowDownIcon className="h-4 w-4" />
                            Download
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section - Now with proper scrolling */}
            <div className="flex-1 overflow-hidden px-6">
                <div className="w-full h-full overflow-x-auto">
                    <div className="overflow-y-auto h-[calc(100vh-280px)]"> {/* Adjust 280px based on your header/footer height */}
                        <table className="w-full min-w-max table-auto">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-y border-gray-200 bg-gray-50 p-4 text-left">
                                            <span className="text-lg font-semibold text-gray-600">
                                                {head}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map((row, index) => (
                                    <tr key={row.name} className={index !== TABLE_ROWS.length - 1 ? "border-b border-gray-200" : ""}>
                                        <td className="p-4">
                                            <span className="text-gray-700 font-bold">{row.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={row.img}
                                                    alt={row.name}
                                                    className="h-10 w-10 rounded-full object-contain p-1 border border-gray-200"
                                                />
                                                <span className="font-semibold text-gray-800">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-green-600 font-semibold">{row.amount}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-700">{row.date}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${row.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                    row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-12 rounded-md border border-gray-200 p-1">
                                                    <img
                                                        src={row.account === "visa" 
                                                            ? "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/visa.png"
                                                            : "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/mastercard.png"
                                                        }
                                                        alt={row.account}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-700 capitalize">
                                                        {row.account.split("-").join(" ")} {row.accountNumber}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{row.expiry}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer/Pagination - Now sticky at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-auto">
                <div className="flex items-center justify-between">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                            <button
                                key={index}
                                className={`w-8 h-8 flex items-center justify-center rounded-full
                                    ${page === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Next
                    </button>
                </div>
            </div>
            
            {/* Order Modal */}
            {/* {isOrderModalOpen && (<OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
            />)} */}
        </div>
    );
}

export default TransactionsTable;
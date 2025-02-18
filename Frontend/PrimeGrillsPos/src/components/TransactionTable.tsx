import { PencilIcon } from "@heroicons/react/24/solid";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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

const TABLE_HEAD = ["S/N","Transaction", "Amount", "Date", "Status", "Account", ""];

const TABLE_ROWS: (TableRow & { id: number })[] = [
    {
        id: 1,
        img: "https://docs.material-tailwind.com/img/logos/logo-spotify.svg",
        name: "Spotify",
        amount: "$2,500",
        date: "Wed 3:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        id: 2,
        img: "https://docs.material-tailwind.com/img/logos/logo-amazon.svg",
        name: "Amazon",
        amount: "$5,000",
        date: "Wed 1:00pm",
        status: "paid",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        id: 3,
        img: "https://docs.material-tailwind.com/img/logos/logo-pinterest.svg",
        name: "Pinterest",
        amount: "$3,400",
        date: "Mon 7:40pm",
        status: "pending",
        account: "master-card",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        id: 4,
        img: "https://docs.material-tailwind.com/img/logos/logo-google.svg",
        name: "Google",
        amount: "$1,000",
        date: "Wed 5:00pm",
        status: "paid",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        id: 5,
        img: "https://docs.material-tailwind.com/img/logos/logo-netflix.svg",
        name: "Netflix",
        amount: "$14,000",
        date: "Wed 3:30am",
        status: "cancelled",
        account: "visa",
        accountNumber: "1234",
        expiry: "06/2026",
    },
    {
        id: 6,
        img: "https://docs.material-tailwind.com/img/logos/logo-apple.svg",
        name: "Apple",
        amount: "$9,990",
        date: "Thu 12:30pm",
        status: "paid",
        account: "master-card",
        accountNumber: "5678",
        expiry: "08/2025",
    },
    {
        id: 7,
        img: "https://docs.material-tailwind.com/img/logos/logo-microsoft.svg",
        name: "Microsoft",
        amount: "$12,500",
        date: "Fri 9:00am",
        status: "pending",
        account: "visa",
        accountNumber: "9012",
        expiry: "03/2024",
    },
    {
        id: 8,
        img: "https://docs.material-tailwind.com/img/logos/logo-adobe.svg",
        name: "Adobe",
        amount: "$8,400",
        date: "Sat 4:15pm",
        status: "paid",
        account: "master-card",
        accountNumber: "3456",
        expiry: "11/2025",
    }
];

function TransactionsTable() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header Section */}
            <div className="mb-6">
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
                            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-gray-500" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-y border-gray-200 bg-gray-50 p-4 text-left">
                                    <span className="text-sm font-semibold text-gray-600">
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
                                    <span className="text-gray-700">{row.amount}</span>
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
                                <td className="p-4">
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <PencilIcon className="h-4 w-4 text-gray-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer/Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 p-4 mt-4">
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
    );
}

export default TransactionsTable;
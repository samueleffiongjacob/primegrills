import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, Calendar, Wallet } from "lucide-react";
import "../assets/styles/fade.css";



const paymentMethods = [
  { id: 1, name: "Bank Transfer" },
  { id: 2, name: "Credit/Debit Card" },
  { id: 3, name: "Cash" },
  { id: 4, name: "Mobile Wallet" },
];

const transactions = [
  { id: "TXN001", method: "Bank Transfer", amount: "$25.00", date: "2025-02-22", accountNumber: "123-456-7890", accountName: "Johnson Yemi", status: "Completed" },
  { id: "TXN002", method: "Credit/Debit Card", amount: "$15.50", date: "2025-02-21", status: "Pending" },
  { id: "TXN003", method: "Bank Transfer", amount: "$40.00", date: "2025-02-23", accountNumber: "987-654-3210", accountName: "Mustapha Adamu", status: "Pending" },
  { id: "TXN004", method: "Cash", amount: "$10.00", date: "2025-02-20", status: "Completed" },
  { id: "TXN005", method: "Mobile Wallet", amount: "$30.00", date: "2025-02-22", status: "Completed" },
  { id: "TXN006", method: "Credit/Debit Card", amount: "$12.00", date: "2025-02-19", status: "Completed" },
  { id: "TXN007", method: "Credit/Debit Card", amount: "$15.50", date: "2025-02-21", status: "Pending" },
  { id: "TXN008", method: "Bank Transfer", amount: "$40.00", date: "2025-02-23", accountNumber: "987-654-3210", accountName: "Mustaau", status: "Pending" },
  { id: "TXN009", method: "Cash", amount: "$10.00", date: "2025-02-20", status: "Completed" },
  { id: "TXN0010", method: "Mobile Wallet", amount: "$30.00", date: "2025-02-22", status: "Completed" },
  { id: "TXN0011", method: "Credit/Debit Card", amount: "$12.00", date: "2025-02-19", status: "Completed" },
  { id: "TXN0012", method: "Credit/Debit Card", amount: "$15.50", date: "2025-02-21", status: "Pending" },
  { id: "TXN0013", method: "Bank Transfer", amount: "$40.00", date: "2025-02-23", accountNumber: "987-654-3210", accountName: "yemi", status: "Pending" },
  { id: "TXN0014", method: "Cash", amount: "$10.00", date: "2025-02-20", status: "Completed" },
  { id: "TXN0015", method: "Mobile Wallet", amount: "$30.00", date: "2025-02-22", status: "Completed" },
  { id: "TXN0016", method: "Credit/Debit Card", amount: "$12.00", date: "2025-02-19", status: "Completed" },
];

// Transaction statuses for filtering
const statuses = ["All", "Pending", "Completed", "Reversed", "Failed", "To Be Paid"];

// Function to group transactions by date
interface Transaction {
  id: string;
  method: string;
  amount: string;
  date: string;
  accountNumber?: string;
  accountName?: string;
  status: string;
}

type GroupedTransactions = Record<string, Transaction[]>;
const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
  return transactions.reduce((acc: GroupedTransactions, txn) => {
    acc[txn.date] = acc[txn.date] ? [...acc[txn.date], txn] : [txn];
    return acc;
  }, {});
};


// Get icon for payment method
const getPaymentIcon = (method: string) => {
  switch (method) {
    case "Bank Transfer":
      return "🏦";
    case "Credit/Debit Card":
      return "💳";
    case "Cash":
      return "💵";
    case "Mobile Wallet":
      return "📱";
    default:
      return "💰";
  }
};

const PayPoint = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].name);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get filtered transactions
  const groupedTransactions = groupTransactionsByDate(transactions);
  const filteredDates = Object.keys(groupedTransactions)
    .filter((date) => !selectedDate || date === selectedDate)
    .sort((a, b) => (a > b ? -1 : 1));

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className=" bg-gray-50 h-[89vh] animate-fadeIn" >
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for Payment Methods */}
          <div className="md:w-1/4 sticky top-6 self-start">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <Wallet className="text-indigo-600" size={18} />
                  <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
                </div>
              </div>
              <div className="p-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`w-full flex items-center px-4 py-3 my-1 rounded-lg text-left transition-all duration-200 ${
                      selectedMethod === method.name
                        ? "bg-indigo-600 text-white shadow-md"
                        : "hover:bg-indigo-50 text-gray-700"
                    }`}
                    onClick={() => setSelectedMethod(method.name)}
                  >
                    <span className="mr-3">{getPaymentIcon(method.name)}</span>
                    <span className="font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions Area */}
          <div className="md:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto">
            {/* Header and Filters */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
              <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">{getPaymentIcon(selectedMethod)}</span>
                  <span>{selectedMethod} Transactions</span>
                </h2>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Collapsible Filters */}
              {showFilters && (
                <div className="p-4  bg-indigo-50 flex flex-wrap gap-4 items-center animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <select
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      value={selectedDate}
                    >
                      <option value="">All Dates</option>
                      {filteredDates.map((date) => (
                        <option key={date} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <select
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      value={selectedStatus}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="p-4 max-h-[65vh] bg-whitee overflow-y-auto">
              {filteredDates.length > 0 ? (
                filteredDates.map((date) => {
                  const filteredTransactions = groupedTransactions[date].filter(
                    (txn) =>
                      txn.method === selectedMethod &&
                      (selectedStatus === "All" || txn.status === selectedStatus)
                  );

                  if (filteredTransactions.length === 0) return null;

                  return (
                    <div key={date} className="mb-6">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                        <h3 className="text-sm font-medium text-gray-500">{formatDate(date)}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {filteredTransactions.map((txn) => (
                          <div 
                            key={txn.id} 
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                          >
                            {/* Transaction Header */}
                            <div 
                              className="p-4 cursor-pointer flex justify-between items-center"
                              onClick={() => setExpandedTxn(expandedTxn === txn.id ? null : txn.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                  txn.status === "Completed" ? "bg-green-500" : 
                                  txn.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                                }`}>
                                  {getPaymentIcon(txn.method)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {txn.accountName || `Transaction ID: ${txn.id}`}
                                  </p>
                                  <p className="text-xs text-gray-500">ID: {txn.id}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <p className="font-semibold text-gray-900">{txn.amount}</p>
                                {expandedTxn === txn.id ? 
                                  <ChevronUp size={18} className="text-gray-400" /> : 
                                  <ChevronDown size={18} className="text-gray-400" />
                                }
                              </div>
                            </div>
                            
                            {/* Expanded Details */}
                            {expandedTxn === txn.id && (
                              <div className="px-4 pb-4 pt-1  bg-gray-50 border-t border-gray-200 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                  <div>
                                    <p className="text-gray-500">Status</p>
                                    <p className={`font-medium ${
                                      txn.status === "Completed" ? "text-green-600" :
                                      txn.status === "Pending" ? "text-yellow-600" :
                                      "text-red-600"
                                    }`}>
                                      {txn.status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Amount</p>
                                    <p className="font-medium text-gray-900">{txn.amount}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Method</p>
                                    <p className="font-medium text-gray-900">{txn.method}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Date</p>
                                    <p className="font-medium text-gray-900">{formatDate(txn.date)}</p>
                                  </div>
                                  
                                  {txn.method === "Bank Transfer" && (
                                    <>
                                      <div className="col-span-2">
                                        <p className="text-gray-500">Account Number</p>
                                        <p className="font-medium text-gray-900 font-mono">{txn.accountNumber}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-gray-500">Account Name</p>
                                        <p className="font-medium text-gray-900">{txn.accountName}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Wallet size={24} className="text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                  <p className="text-gray-500 max-w-sm">
                    There are no transactions matching your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add some simple animation keyframes for fade in */}
      {/* <style jsx>{`
       @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
`}</style> */}
    </div>
  );
};

export default PayPoint;
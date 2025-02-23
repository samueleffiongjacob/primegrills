import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
];

// Transaction statuses for filtering
const statuses = ["All", "Pending", "Completed", "Reversed", "Failed", "To Be Paid"];

// Function to group transactions by date
const groupTransactionsByDate = (transactions: any[]) => {
  return transactions.reduce((acc: Record<string, any[]>, txn) => {
    acc[txn.date] = acc[txn.date] ? [...acc[txn.date], txn] : [txn];
    return acc;
  }, {});
};

const PayPoint = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].name);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  // Get filtered transactions
  const groupedTransactions = groupTransactionsByDate(transactions);
  const filteredDates = Object.keys(groupedTransactions)
    .filter((date) => !selectedDate || date === selectedDate)
    .sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="flex max-w-5xl mx-auto p-6 space-x-6">
      {/* Sidebar for Payment Methods */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Payment Methods</h2>
        <ul>
          {paymentMethods.map((method) => (
            <li
              key={method.id}
              className={`p-3 rounded-md cursor-pointer ${selectedMethod === method.name ? "bg-[#2f3585] text-white" : "bg-white"}
                hover:bg-orange-300 transition`}
              onClick={() => setSelectedMethod(method.name)}
            >
              {method.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Filters & Transactions */}
      <div className="w-3/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">{selectedMethod} Transactions</h2>

        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          {/* Date Filter */}
          <select
            className="border p-2 rounded-md"
            onChange={(e) => setSelectedDate(e.target.value)}
            value={selectedDate}
          >
            <option value="">All Dates</option>
            {filteredDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="border p-2 rounded-md"
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

        {/* Transactions */}
        {filteredDates.map((date) => {
          const filteredTransactions = groupedTransactions[date].filter(
            (txn) =>
              txn.method === selectedMethod &&
              (selectedStatus === "All" || txn.status === selectedStatus)
          );

          if (filteredTransactions.length === 0) return null;

          return (
            <div key={date} className="border-t pt-4">
              <h3 className="text-md font-semibold text-gray-700">{date}</h3>
              {filteredTransactions.map((txn) => (
                <div key={txn.id} className="bg-gray-50 p-3 rounded-md border border-gray-300 mt-2">
                  {/* Collapsible Header */}
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedTxn(expandedTxn === txn.id ? null : txn.id)}>
                    <p className="text-sm font-medium">{txn.accountName || `Transaction ID: ${txn.id}`}</p>
                    {expandedTxn === txn.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {/* Collapsible Details */}
                  {expandedTxn === txn.id && (
                    <div className="mt-2">
                      <p className="text-sm">Transaction ID: {txn.id}</p>
                      <p className="text-sm">Amount: {txn.amount}</p>
                      <p className="text-sm">
                        Status: 
                        <span className={`ml-1 font-semibold ${
                          txn.status === "Completed" ? "text-green-600" :
                          txn.status === "Pending" ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {txn.status}
                        </span>
                      </p>
                      {txn.method === "Bank Transfer" && (
                        <>
                          <p className="text-sm">Account Number: {txn.accountNumber}</p>
                          <p className="text-sm">Account Name: {txn.accountName}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PayPoint;

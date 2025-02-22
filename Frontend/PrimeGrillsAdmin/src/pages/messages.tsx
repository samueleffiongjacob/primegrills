import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/authContext";

const customerMessages = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Reservation Inquiry",
    content: "Hello, I would like to book a table for 4 this Friday at 7 PM. Please confirm availability.",
    timestamp: "2025-02-20 10:45 AM",
    read: false,
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Order Issue",
    content: "My takeaway order was missing an item. Can I get a refund?",
    timestamp: "2025-02-19 08:30 PM",
    read: true,
  },
  {
    id: 3,
    sender: "Michael Johnson",
    subject: "Job Application",
    content: "I’m interested in a chef position at your restaurant. My resume is attached.",
    timestamp: "2025-02-18 02:15 PM",
    read: false,
  },
];

const managerMessages = [
  {
    id: 4,
    sender: "Restaurant Manager",
    subject: "New Policy Update",
    content: "Please ensure all staff members are aware of the new COVID-19 safety measures effective next week.",
    timestamp: "2025-02-17 09:00 AM",
    read: true,
  },
  {
    id: 5,
    sender: "Restaurant Manager",
    subject: "Shift Changes",
    content: "We have updated the shift schedule for this month. Please check the latest version on the dashboard.",
    timestamp: "2025-02-16 05:45 PM",
    read: false,
  },
];

const MessagesPage = () => {
  const [openMessage, setOpenMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("customers");
  const [messages, setMessages] = useState(customerMessages);
  const [reply, setReply] = useState("");
  const { user: currentUser} = useAuth();

  const toggleMessage = (id) => {
    setOpenMessage(openMessage === id ? null : id);
  };

  const sendReply = async (messageId) => {
    const response = await fetch("/messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, content: reply }),
    });
    const data = await response.json();
    if (data.success) {
      setReply("");
    }
  };

 /*  const markAsRead = async (id) => {
    await fetch(`/messages/${id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, readBy: [...msg.readBy, currentAdminId] } : msg
    ));
  };
   */

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "customers" ? "bg-[#2f3585] text-white" : "bg-gray-300 text-gray-700"}`}
          onClick={() => {
            setActiveTab("customers");
            setMessages(customerMessages);
          }}
        >
          Messages from Customers
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "manager" ? "bg-[#2f3585] text-white" : "bg-gray-300 text-gray-700"}`}
          onClick={() => {
            setActiveTab("manager");
            setMessages(managerMessages);
          }}
        >
          Messages from Manager
        </button>
      </div>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-lg shadow-md p-4 transition ${!msg.read ? "border-l-4 border-orange-500" : ""}`}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleMessage(msg.id)}
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900">{msg.subject}</h2>
                <p className="text-sm text-gray-600">{msg.sender} - {msg.timestamp}</p>
              </div>
              {openMessage === msg.id ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
            </div>

            {openMessage === msg.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-gray-700"
              >
                <p>{msg.content}</p>
                {activeTab === "customers" && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                      onClick={() => sendReply(msg.id)}
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
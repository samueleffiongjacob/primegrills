import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
];

const managerMessages = [
  {
    id: 2,
    sender: "Restaurant Manager",
    subject: "New Policy Update",
    content: "Please ensure all staff members are aware of the new COVID-19 safety measures effective next week.",
    timestamp: "2025-02-17 09:00 AM",
    read: true,
  },
];

const staffMessages = [
  {
    id: 3,
    sender: "Head Chef",
    subject: "Inventory Request",
    content: "We are running low on ingredients. Please restock by next week.",
    timestamp: "2025-02-18 03:30 PM",
    read: false,
  },
];

const staffRoles = ["Kitchen", "Accountant", "Manager", "Waiter", "Cleaner", "Pos"];

const MessagesPage = () => {
  // const [openMessage, setOpenMessage] = useState(null);
  const [openMessage, setOpenMessage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("customers");
  const [messages, setMessages] = useState(customerMessages);
  const [reply, setReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { user: currentUser } = useAuth();

  const toggleMessage = (id: number) => {
    setOpenMessage(openMessage === id ? null : id);
  };

  const sendReply = async (messageId: number) => {
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
 
  if (!currentUser) {
    console.error("User not authenticated.");
    return;
  }
  
  // Example in `sendMessageToStaff`
  const sendMessageToStaff = async () => {
    if (!selectedStaff || !newMessage.trim() || !currentUser) return;
  
    const response = await fetch("/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientRole: selectedStaff,
        content: newMessage,
        sender: currentUser.name, // Safe to access here
      }),
    });

    const data = await response.json();
    if (data.success) {
      setNewMessage("");
      setSelectedStaff("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h1>

      <div className="flex justify-between">
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
            className={`px-4 py-2 rounded-lg ${activeTab === "staff" ? "bg-[#2f3585] text-white" : "bg-gray-300 text-gray-700"}`}
            onClick={() => {
              setActiveTab("staff");
              setMessages(staffMessages);
            }}
          >
            Messages from Staff
          </button>

          {/* Send Message Button */}
          <button
            className="px-4 py-2 lg:absolute lg:right-6 bg-[#EE7F61] text-white rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Send Message to Staff
          </button>
        </div>

        
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

      {/* Send Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 lg:absolute lg:right-6  rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Send Message to Staff</h2>
              <X className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <select
              className="w-full p-2 border rounded-md mb-2"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select Staff Role</option>
              {staffRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button
              className="px-4 py-2 bg-[#EE7F61] text-white rounded-md w-full"
              onClick={sendMessageToStaff}
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

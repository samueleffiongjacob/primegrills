# **3. PrimeGrillsPOS** (Point-of-Sale System)  

A POS system for handling in-store orders, transactions, and payments.  

## **Folder Structure**  

```bash
PrimeGrillsPOS/  
│── src/  
│   ├── components/        # POS UI elements (Keypad, Order List, Receipt)  
│   ├── pages/             # POS Dashboard, Order History  
│   ├── services/          # API services for transactions & payments 
│   ├── utils/             # Helper functions (currency formatting, etc.) , configurations  & App.ts 
│   ├── assets/            # Images, icons, and static files  
│   │   ├── styles/        # Global styles (CSS or Tailwind)
│   │   ├── images/        # All Images  
│   ├── hooks/             # Custom hooks for data handling and  state management
│   ├── context/           # Global state management (React Context or Redux/Context API) 
│── public/                # Public assets (favicon, images) 
│── .env                   # Environment variables  
│── package.json           # Dependencies & scripts  
│── tsconfig.json          # TypeScript configuration  
│── vite.config.js         # Vite configuration  
```

### **Setup & Start**  

```bash
cd PrimeGrillsPOS  
npm install  
npm run dev  
```

This system consists of two interfaces:  

1. *Merchant POS Screen* – This is where the restaurant or store staff add items to a customer’s order. It fetches products from an API hosted on *host* and updates the order in real-time.  
2. *Customer Display Screen* – This screen shows the current order to the customer as items are added.  

## **How It Works**  

- The **Merchant POS** loads available products from a backend API.  
- When the merchant adds an item to an order, the system updates instantly.  
- The **Customer Display** receives these updates through **WebSockets**, ensuring the customer sees the order changes in real-time.  
- Both screens stay in sync as long as the POS is active.  

This setup ensures a **seamless checkout experience** similar to what you see in modern **fast-food chains and retail stores**.

---

The app is built modularly, ensuring maintainability, scalability, and performance optimization. 🚀

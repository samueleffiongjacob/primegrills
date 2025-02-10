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

---
The app is built modularly, ensuring maintainability, scalability, and performance optimization. 🚀

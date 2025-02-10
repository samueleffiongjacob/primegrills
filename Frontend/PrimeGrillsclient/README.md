# **2. PrimeGrillsClient** (Customer App)  

The customer-facing app where users browse the menu, place orders, and make payments.  

## **Folder Structure**

```bash
PrimeGrillsClient/  
│── src/  
│   ├── components/        # UI elements (Menu, Cart, Order Summary)  
│   ├── pages/             # Views (Home, Order Tracking, Checkout)  
│   ├── services/          # API calls , data management 
│   ├── utils/             # Helper functions , configurations  & App.ts  
│   ├── assets/            # Images, icons, and static files  
│   │   ├── styles/        # Global styles (CSS or Tailwind)
│   │   ├── images/        # All Images 
│   ├── hooks/             # Custom React hooks for state management 
│   ├── context/           # Global state management (React Context or Redux/Context API)
│── public/                # Public assets (favicon, images)  
│── .env                   # Environment variables  
│── package.json           # Dependencies & scripts  
│── tsconfig.json          # TypeScript configuration  
│── vite.config.js         # Vite configuration  
```

### **Setup & Start**  

```bash
cd PrimeGrillsClient  
npm install  
npm run dev  
```

---
The app is built modularly, ensuring maintainability, scalability, and performance optimization. 🚀

# **1. PrimeGrillsAdmin** (Admin Panel)

The admin interface for managing users, inventory, and overall restaurant analytics.  

## **Folder Structure**  

```bash
PrimeGrillsAdmin/  
│── src/  
│   ├── components/        # Reusable UI components  
│   ├── pages/             # Dashboard views (Orders, Inventory, Reports)  
│   ├── services/          # API calls , data management  & App.ts
│   ├── utils/             # Helper functions & configurations  
│   ├── assets             # For All styles and Image & Icons
│   │   ├── styles/        # Global styles (CSS or Tailwind)
│   │   ├── images/        # All Images 
│   ├── hooks/             # Custom React hooks for state management 
│   ├── context/           # Global state management (React Context or Redux)  
│── public/                # Static assets (favicon, logo, etc.)  
│── .env                   # Environment variables  
│── package.json           # Dependencies & scripts  
│── tsconfig.json          # TypeScript configuration  
│── vite.config.js         # Vite configuration  
```

### **Setup & Start**  

```bash
cd PrimeGrillsAdmin  
npm install   # Install dependencies  
npm run dev   # Start development server  
```

The app is built modularly, ensuring maintainability, scalability, and performance optimization. 🚀

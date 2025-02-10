# **Frontend Folder Structure – Prime Grills**  

The frontend of Prime Grills is structured into four main applications, each serving a distinct role in the restaurant’s operations. Below is a detailed breakdown of each app’s folder structure and steps to set up and start them.

## **1. PrimeGrillsAdmin**  

The admin panel for managing restaurant operations, including inventory, users, and analytics.  

**Folder Structure:**  

```bash
PrimeGrillsAdmin/  
│── src/  
│   ├── components/ (Reusable UI components)  
│   ├── pages/ (Admin dashboard views)  
│   ├── services/ (API calls & data management)  
│   ├── utils/ (Helper functions & configurations)  
│   ├── styles/ (Global styles & themes)  
│── public/ (Static assets)  
│── package.json (Dependencies & scripts)  
│── tsconfig.json (TypeScript configuration)  
```

## **2. PrimeGrillsClient**  

The customer-facing application where users can browse the menu, place orders, and make payments.  

**Folder Structure:**  

```bash
PrimeGrillsClient/  
│── src/  
│   ├── components/ (UI elements like menus & carts)  
│   ├── pages/ (Homepage, order tracking, checkout)  
│   ├── hooks/ (Custom React hooks for state management)  
│   ├── context/ (Global state management)  
│   ├── assets/ (Images, icons, and static files)  
│── public/ (Public assets)  
│── package.json  
│── tsconfig.json  
```

## **3. PrimeGrillsPOS**  

The point-of-sale (POS) system for in-store transactions, order processing, and payment handling.  

**Folder Structure:**  

```bash
PrimeGrillsPOS/  
│── src/  
│   ├── components/ (POS UI elements)  
│   ├── pages/ (POS dashboard, order history)  
│   ├── services/ (Transaction & payment processing)  
│   ├── hooks/ (Custom React hooks)  
│── public/  
│── package.json  
│── tsconfig.json  
```

## **4. PrimeGrillsManager**  

The manager’s dashboard for overseeing restaurant performance, sales, and staff activities.  

**Folder Structure:**  

```bash
PrimeGrillsManager/  
│── src/  
│   ├── components/ (Reports, staff management UI)  
│   ├── pages/ (Sales dashboard, staff management)  
│   ├── services/ (Data retrieval & reporting)  
│── public/  
│── package.json  
│── tsconfig.json  
```

## **Tech Stack & Best Practices**

- **Frontend Framework:** React (with Vite for fast builds)  
- **State Management:** React Context API / Redux  
- **Styling:** Tailwind CSS or CSS Modules  
- **API Handling:** Axios for fetching data  
- **Routing:** React Router  
- **TypeScript:** Ensures type safety  

Each application is built with a modular structure, ensuring maintainability and scalability🚀.

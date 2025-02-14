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

# Folder Structure Breakdown

## 1. `api/`
- **Purpose**: Contains API-related logic and services.
- **Files**:
  - `auth.ts`: Handles authentication-related API calls (e.g., login, signup, token management).

---

## 2. `assets/`
- **Purpose**: Stores static assets like images, styles, and fonts.
- **Subfolders**:
  - `images/`: Contains image files used across the application.
  - `styles/`: Contains global styles, themes, or CSS files.

---

## 3. `components/`
- **Purpose**: Contains reusable UI components.
- **Subfolders and Files**:
  - **`BottomNavigation.tsx`**: A bottom navigation bar for mobile views.
  - **`CartIcon.tsx`**: A component for displaying the shopping cart icon.
  - **`Footer/`**: Contains footer-related components.
  - **`HeroSection/`**: Contains hero section components.
  - **`HomeCategorySection/`**: Contains components for the category section on the homepage.
  - **`HomeHeroSection/`**: Contains the hero section for the homepage.
    - `Hero.tsx`: The main hero component.
  - **`HomeSpecialSection/`**: Contains components for the special section on the homepage
  - **`HomeStorySection/`**: Contains components for the "Our Story" section.
  - **`HomeTestimonialSection/`**: Contains components for the testimonial section.
  - **`itemCard/`**: Contains components for item cards.
  - **`MealDetailsModal.tsx`**: A modal component for displaying meal details.
  - **`Navbar/`**: Contains navigation bar components.
  - **`Popular.tsx`**: A component for displaying popular items.
  - **`PromotionCard.tsx`**: A component for displaying promotional cards.
  - **`RemoveFromCartModal.tsx`**: A modal for confirming item removal from the cart.
  - **`User/`**: Contains user-related components.
    - `Login.tsx`: The login form component.
    - `ProfileSidePanel.tsx`: A side panel for user profile details.
    - `SignUp.tsx`: The signup form component.

---

## 4. `context/`
- **Purpose**: Contains React context providers for state management.
- **Files**:
  - `CartContext.tsx`: Manages the state and logic for the shopping cart.

---

## 5. `main.tsx`
- **Purpose**: The entry point of the application where the root component is rendered.

---

## 6. `Pages/`
- **Purpose**: Contains page-level components for different routes.
- **Subfolders and Files**:
  - **`Checkout/`**: Contains components for the checkout process.
    - `CartItemCard.tsx`: A card component for items in the cart.
    - `CartPage.tsx`: The cart page component.
    - `Chekout.tsx`: The checkout page component.
  - **`FeedbackPage.tsx`**: The feedback page component.
  - **`LandingPage.tsx`**: The landing page component.
  - **`Menu/`**: Contains components for the menu section.
    - `AllMenuPage.tsx`: Displays all menu items.
    - `BarsPage.tsx`: Displays bar-related items.
    - `FoodPage.tsx`: Displays food-related items.
    - `GrillsPage.tsx`: Displays grill-related items.
    - **`MenuPage/`**: Contains components for the menu page.
      - `CategorySection.tsx`: Displays menu categories.
      - `Menu.tsx`: The main menu component.
      - `MenuDrinksSection.tsx`: Displays drinks section.
      - `MenuFoodSection.tsx`: Displays food section.
      - `MenuPastries.tsx`: Displays pastries section.
      - `MenuPopularSection.tsx`: Displays popular items section.
      - `PromotionSection.tsx`: Displays promotional items section.
    - `PastriesPage.tsx`: Displays pastries-related items.
    - `PopularlMealsPage.tsx`: Displays popular meals.
    - `SpecialDishesPage.tsx`: Displays special dishes.
  - **`Offers.tsx`**: The offers page component.
  - **`ServicesPage.tsx`**: The services page component.

---

## 7. `routes/`
- **Purpose**: Contains routing logic for the application.
- **Files**:
  - `routes.tsx`: Defines the routes for the application.

---

## 8. `utils/`
- **Purpose**: Contains utility functions and helper files.
- **Files**:
  - `App.tsx`: The main application component.
  - `utils.ts`: Contains utility functions (e.g., formatters, validators).

---

## 9. `vite-env.d.ts`
- **Purpose**: Contains TypeScript type definitions for Vite-specific environment variables.

---

This structure organizes the application into logical modules, making it easier to maintain and scale.
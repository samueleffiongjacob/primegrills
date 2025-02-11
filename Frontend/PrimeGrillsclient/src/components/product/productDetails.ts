// INTERNAL IMPORTS
import product1 from "../../assets/images/product1.png";
import product2 from "../../assets/images/product2.png";
import product3 from "../../assets/images/product3.png";


interface MenuItem {
    id: number;
    image: string;
    title: string;
    description: string;
    price: number;
    rating: string;
  }

export const MENU_ITEMS: MenuItem[] = [
    {
      id: 1,
      image: product1,
      title: 'Fattoush Salad',
      description: 'Fresh Mediterranean salad with crispy pita',
      price: 3500,
      rating: '4.0'
    },
    {
        id: 2,
        image: product2,
        title: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita',
        price: 3500,
        rating: '4.0'
      },
      {
        id: 3,
        image: product3,
        title: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita',
        price: 3500,
        rating: '4.0'
      },
      {
        id: 4,
        image: product1,
        title: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita',
        price: 3500,
        rating: '4.0'
      },
      {
        id: 5,
        image: product2,
        title: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita',
        price: 3500,
        rating: '4.0'
      },
      {
        id: 6,
        image: product3,
        title: 'Fattoush Salad',
        description: 'Fresh Mediterranean salad with crispy pita',
        price: 3500,
        rating: '4.0'
      },
    // Add more menu items as needed
  ];

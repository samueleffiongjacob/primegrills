// INTERNAL IMPORTS
import menuimg1 from "../../assets/images/desert.png";
import menuimg2 from "../../assets/images/drinks.png";
import menuimg3 from "../../assets/images/menuimg3.png";
import heroimg1 from "../../assets/images/heroimg1.png";

interface MenuProps {
    id: number;
    img: string;
    title: string;
    value: string;  
    path: string;
}


export const MENU_CARD_ITEMS: MenuProps[] = [
    {
        id: 1,
        img: menuimg1,
        title: 'Food',
        value: '150 Dishes',
        path: '/menu/food'
    },
    {
        id: 1,
        img: menuimg2,
        title: 'Pastries',
        value: '150 Dishes',
        path: '/menu/pastries'
    },
    {
        id: 1,
        img: menuimg1,
        title: 'Bars/Drinks',
        value: '150 Dishes',
        path: '/menu/drinks'
    },
    {
        id: 1,
        img: menuimg3,
        title: 'Food',
        value: '150 Dishes',
        path: '/menu/food'
    },
    {
        id: 1,
        img: heroimg1,
        title: 'Barbecue',
        value: '150 Dishes',
        path: '/menu/barbecue'
    },
    {
        id: 1,
        img: menuimg2,
        title: 'Pastries',
        value: '150 Dishes',
        path: '/menu/pastries'

    },
    // Add more menu items as needed
];

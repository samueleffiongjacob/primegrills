// Function to group menu items by category
interface itemProps {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    items: string[];
   
  }
  
export const groupByCategory = (items: itemProps[]) => {
    return items.reduce((acc: { [key: string]: itemProps[] }, item) => {
      const { category } = item;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

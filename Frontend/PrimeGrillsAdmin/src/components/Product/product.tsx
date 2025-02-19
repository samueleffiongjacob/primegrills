import { useState } from 'react';
import plus from "../../assets/images/plusSign.png";
import pencil from "../../assets/images/pencil.png";
import trash from "../../assets/images/trash.png";
import ItemForm from './ProductItemForm';

interface Product {
  id: number;
  name: string;
  image?: string;
  description?: string;
  price?: number;
  items?: string[];
  barcode?: string;
  category?: string;
  status?: string;
}

const ProductDashboard = () => {
  const [productItems, setProductItems] = useState<Product[]>([
    { id: 1, name: "Chicken Pepperoni", barcode: "BC12345", category: "Meat", status: "Active" },
    { id: 2, name: "Grilled Chicken", barcode: "BC67890", category: "Meat", status: "Active" },
    { id: 3, name: "Grilled Chicken", barcode: "BC67891", category: "Meat", status: "Active" },
    { id: 4, name: "Grilled Chicken", barcode: "BC67892", category: "Meat", status: "Inactive" },
    { id: 5, name: "Grilled Chicken", barcode: "BC67893", category: "Meat", status: "Active" },
    { id: 6, name: "Grilled Chicken", barcode: "BC67894", category: "Meat", status: "Active" },
    { id: 7, name: "Grilled Chicken", barcode: "BC67895", category: "Meat", status: "Inactive" },
    { id: 8, name: "Grilled Chicken", barcode: "BC67896", category: "Meat", status: "Active" },
  ]);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<Product | null>(null);
  
  const handleFormSubmit = (formData: Omit<Product, 'id'>) => {
    if (currentItem) {
      // Edit existing item
      setProductItems(productItems.map(item => 
        item.id === currentItem.id ? { ...item, ...formData } : item
      ));
    } else {
      // Add new item
      const newId = productItems.length > 0 ? Math.max(...productItems.map(item => item.id)) + 1 : 1;
      setProductItems([...productItems, { 
        id: newId, 
        ...formData, 
        barcode: formData.barcode || `BC${Math.floor(Math.random() * 100000)}`, 
        status: formData.status || 'Active' 
      }]);
    }
    
    // Reset and close form
    closeForm();
  };
  
  const handleEdit = (item: Product) => {
    setCurrentItem(item);
    setIsFormVisible(true);
  };
  
  const closeForm = () => {
    setCurrentItem(null);
    setIsFormVisible(false);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setProductItems(productItems.filter(item => item.id !== id));
    }
  };

  const AddButton = () => {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="px-2 py-2 rounded hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <img src={plus} alt="Add Icon" className="h-10 w-10" />
      </button>
    );
  };

  return (
    <div className="flex max-h-[85vh] bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Products</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Add Button */}
            <AddButton />
            {/* Search and Pagination */}
            <div className="flex gap-4 ml-auto">
              <input
                type="number"
                placeholder="100"
                className="w-24 p-2 border rounded-lg border-[#EE7F61] bg-gray-300"
                defaultValue="100"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-72 p-1 pl-3 border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-[#EE7F61] text-white">
                  <th className="py-2 px-4 text-left">S/N</th>
                  <th className="py-2 px-4 text-left">Menu Name</th>
                  <th className="py-2 px-4 text-left">Barcode</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {productItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`shadow-lg rounded-2xl ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-4">{item.id}.</td>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.barcode}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button 
                          className="p-2 hover:text-[#bf360c] hover:bg-orange-50 rounded"
                          onClick={() => handleEdit(item)}
                        >
                          <img src={pencil} alt="pencil-icon" className="h-5 w-5"/>
                        </button>
                        {/* Delete Button */}
                        <button 
                          className="p-2 hover:text-[#bf360c] hover:bg-orange-50 rounded"
                          onClick={() => handleDelete(item.id)}
                        >
                          <img src={trash} alt="trash-icon" className="h-5 w-5"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      
      {/* Form Modal Component */}
      <ItemForm
        isVisible={isFormVisible}
        currentItem={currentItem}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        formTitle="Product" // This makes the form adapt to products
      />
    </div>
  );
};

export default ProductDashboard;
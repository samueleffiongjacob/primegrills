import { useState } from "react";
import plus from "../../assets/images/plusSign.png";
import pencil from "../../assets/images/pencil.png";
import trash from "../../assets/images/trash.png";
import CategoryForm from "./CategoryForm";
import { useAuth } from "../../context/authContext";

const Category = () => {
      interface CategoryItems {
        id: number;
        name: string;
        image?: string;
      }

    // auth context
    const { user: currentUser} = useAuth();
    const [categoryItems, setCategoryItems] = useState<CategoryItems[]>(
      [
        { id: 1, name:"Desert" },
        { id: 2, name: "Pizza" },
        { id: 3, name: "Swallows" },
        { id: 4, name: "Locals" },
        { id: 5, name: "Continental" },
        { id: 6, name: "Wine" },
        { id: 7, name:"Softdrink" },
        { id: 8, name: "Grilled" },
      ]
    );
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<CategoryItems | null>(null);
    
    const handleFormSubmit = (formData: Omit<CategoryItems, 'id'>) => {
      if (currentItem) {
        // Edit existing item
        setCategoryItems(categoryItems.map(item => 
          item.id === currentItem.id ? { ...item, ...formData } : item
        ));
      } else {
        // Add new item
        const newId = categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.id)) + 1 : 1;
        setCategoryItems([...categoryItems, { 
          id: newId, 
          ...formData, 
        }]);
      }
      
      // Reset and close form
      closeForm();
    };
    
    const handleEdit = (item: CategoryItems) => {
      setCurrentItem(item);
      setIsFormVisible(true);
    };
    
    const closeForm = () => {
      setCurrentItem(null);
      setIsFormVisible(false);
    };
    
    const handleDelete = (id: number) => {
      if (window.confirm('Are you sure you want to delete this item?')) {
        setCategoryItems(categoryItems.filter(item => item.id !== id));
      }
    };
  
    const AddButton = () => {
      return (
        <button
          onClick={() => setIsFormVisible(true)}
          className="px-1 py-1 rounded hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <img src={plus} alt="Add Icon" className="h-8 w-8" />
        </button>
      );
    }; 

  return (
    <div className="flex max-h-[85vh] bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[88px] bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Category</h1>
          {currentUser && (
            <div className="text-sm">
              Logged in as: {currentUser.email} ({currentUser.status})
            </div>
          )}
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
                className="w-24 p-2 border rounded-lg text-black border-[#EE7F61] bg-gray-300"
                defaultValue="100"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-64 p-2 border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
              />
            </div>
          </div>

          {/*  Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-[#EE7F61] text-white">
                  <th className="py-2 px-4 text-left">S/N</th>
                  <th className="py-2 px-4 text-left">Category Name</th>
                  <th className="py-2 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {categoryItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`shadow-lg rounded-2xl ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-4">{item.id}.</td>
                    <td className="py-2 px-4">{item.name}</td>
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
      <CategoryForm
        isVisible={isFormVisible}
        currentItem={currentItem}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Category;

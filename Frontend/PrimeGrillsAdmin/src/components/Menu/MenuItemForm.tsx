import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  image?: string;
  description?: string;
  price?: number;
  items?: string[];
}

interface MenuItemFormProps {
  isVisible: boolean;
  currentItem: MenuItem | null;
  onClose: () => void;
  onSubmit: (formData: Omit<MenuItem, 'id'>) => void;
}

const MenuItemForm = ({ isVisible, currentItem, onClose, onSubmit }: MenuItemFormProps) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    image: '',
    description: '',
    price: undefined,
    items: []
  });
  const [itemInput, setItemInput] = useState('');
  
  // Update form data when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name,
        image: currentItem.image || '',
        description: currentItem.description || '',
        price: currentItem.price,
        items: currentItem.items || []
      });
    } else {
      resetForm();
    }
  }, [currentItem, isVisible]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };
  
  const addItem = () => {
    if (itemInput.trim()) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), itemInput.trim()]
      });
      setItemInput('');
    }
  };
  
  const removeItem = (index: number) => {
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    setFormData({
      ...formData,
      items: newItems
    });
  };
  
  const handleSubmit = () => {
    if (!formData.name) {
      alert('Name is required');
      return;
    }
    
    onSubmit(formData);
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      description: '',
      price: undefined,
      items: []
    });
    setItemInput('');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-[#171943]  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-h-[80vh] border-orange-600 shadow-orange-600 shadow-sm  p-10 w-full max-w-[70%] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
              required
           />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items in Meal <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
                placeholder="Add an item"
                required
              />
              <button
                type="button"
                onClick={addItem}
                className="bg-[#EE7F61] text-white px-4 py-2 rounded hover:bg-[#d84315]"
              >
                Add
              </button>
            </div>
            
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {formData.items?.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#d84315] text-white px-4 py-2 rounded hover:bg-[#bf360c]"
          >
            {currentItem ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;
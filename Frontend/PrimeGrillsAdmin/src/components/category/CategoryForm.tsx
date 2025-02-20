import { useState, useEffect } from 'react';

interface CategoryItem {
  id: number;
  name: string;
  image?: string;
}

interface CategoryItemFormProps {
  isVisible: boolean;
  currentItem: CategoryItem | null;
  onClose: () => void;
  onSubmit: (formData: Omit<CategoryItem, 'id'>) => void;
}

const CategoryForm = ({ isVisible, currentItem, onClose, onSubmit }: CategoryItemFormProps) => {
  const [formData, setFormData] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    image: '',
   
  });
  
  // Update form data when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name,
        image: currentItem.image || '',
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
    });
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-[#171943]  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-1 border-orange-600 shadow-orange-600 shadow-sm  rounded-lg max-h-[80vh]   p-10 w-full max-w-lg overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {currentItem ? 'Edit Category' : 'Add New Category'}
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
              Image URL (optional)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
            />
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

export default CategoryForm;
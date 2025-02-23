import { useState, useEffect, useRef } from 'react';

interface Item {
  id: number;
  name: string;
  image?: string;
  description?: string;
  price?: number;
  items?: string[];
  category?: string;
  quantity: number;
}

interface ItemFormProps {
  isVisible: boolean;
  currentItem: Item | null;
  onClose: () => void;
  onSubmit: (formData: Omit<Item, 'id'>, file: File | null) => void;
  formTitle?: string;
}

const ItemForm = ({ 
  isVisible, 
  currentItem, 
  onClose, 
  onSubmit,
  formTitle = 'Menu Item' 
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '',
    image: '',
    description: '',
    price: undefined,
    items: [],
    category: '',
    quantity: 0
  });
  const [itemInput, setItemInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
    
  // Update form data when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name,
        image: currentItem.image || '',
        description: currentItem.description || '',
        price: currentItem.price,
        items: currentItem.items || [],
        category: currentItem.category || '',
        quantity: currentItem.quantity || 0,
      });
      setPreviewUrl(currentItem.image || '');
    } else {
      resetForm();
    }
  }, [currentItem, isVisible]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    onSubmit(formData, selectedFile);
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      description: '',
      price: undefined,
      items: [],
      category: '',
      quantity: 0,
    });
    setItemInput('');
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  
  if (!isVisible) return null;
  
  const isProduct = formTitle.toLowerCase().includes('product');
  
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-[#171943]  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-h-[80vh] border-orange-600 shadow-orange-600 shadow-sm  p-10 w-full max-w-[50%] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {currentItem ? `Edit ${formTitle}` : `Add New ${formTitle}`}
        </h2>
        
        <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
            >
              <option value="">Select a name</option>
              <option value="Meat">Jollof Rice</option>
              <option value="Vegetable">Bread</option>
              <option value="Dairy">Italian Pizza</option>
              <option value="Bakery">Fufu</option>
              <option value="Beverage">Amala</option>
            </select>
          </div>
              
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Image
            </label>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {/* Image preview area */}
            {previewUrl ? (
              <div className="mt-2 relative">
                <img 
                  src={previewUrl} 
                  alt="Category preview" 
                  className="w-full h-48 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#EE7F61]"
              >
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  Click to upload image or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 3MB
                </p>
              </div>
            )}
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
              required
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
          
          {isProduct && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Meat">Desert</option>
                  <option value="Vegetable">Swallow</option>
                  <option value="Dairy">Grilled</option>
                  <option value="Bakery">Local</option>
                  <option value="Beverage">Continental</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || 0}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#EE7F61] focus:border-transparent"
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items in {isProduct ? 'Product' : 'Meal'} (Optional)
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

export default ItemForm;
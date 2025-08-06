import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minQuantity: '5',
    supplier: '',
    location: '',
    image: 'https://via.placeholder.com/300x300?text=Product+Image'
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Food & Beverages', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity)
      };

      await axios.post('/products', productData);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                maxLength="500"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.description}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Selling Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className="pl-7 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                  Cost Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    step="0.01"
                    min="0"
                    required
                    className="pl-7 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.cost}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Current Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700">
                  Minimum Quantity *
                </label>
                <input
                  type="number"
                  id="minQuantity"
                  name="minQuantity"
                  min="0"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.minQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                Supplier *
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Storage Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.image && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Image Preview</h3>
            <div className="flex justify-center">
              <img
                src={formData.image}
                alt="Product preview"
                className="h-48 w-48 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

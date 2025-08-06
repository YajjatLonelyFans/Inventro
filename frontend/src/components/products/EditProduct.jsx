import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minQuantity: '',
    supplier: '',
    location: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState(0);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Food & Beverages', 'Other'];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      const productData = response.data;
      setProduct(productData);
      setFormData({
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.price.toString(),
        cost: productData.cost.toString(),
        quantity: productData.quantity.toString(),
        minQuantity: productData.minQuantity.toString(),
        supplier: productData.supplier,
        location: productData.location,
        image: productData.image
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert numeric fields
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity)
      };

      await axios.put(`/products/${id}`, productData);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleStockAdjustment = async () => {
    if (stockAdjustment === 0) return;

    try {
      await axios.patch(`/products/${id}/stock`, { adjustment: stockAdjustment });
      toast.success('Stock updated successfully!');
      fetchProduct(); // Refresh product data
      setStockAdjustment(0);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update stock';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600 bg-green-100';
      case 'Low Stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'Out of Stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:text-blue-500"
        >
          Back to Products
        </button>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Form */}
        <div className="lg:col-span-2">
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
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Product Info Sidebar */}
        <div className="space-y-6">
          {/* Product Image */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Image</h3>
            <img
              src={formData.image}
              alt={formData.name}
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
              }}
            />
          </div>

          {/* Current Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current Stock:</span>
                <span className="text-sm font-medium">{product.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Min Stock:</span>
                <span className="text-sm font-medium">{product.minQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Value:</span>
                <span className="text-sm font-medium text-green-600">${(product.price * product.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stock Adjustment */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stock Adjustment</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustment(prev => Math.max(prev - 1, -product.quantity))}
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                  className="w-20 text-center border border-gray-300 rounded-md px-2 py-1 text-sm"
                  min={-product.quantity}
                />
                <button
                  type="button"
                  onClick={() => setStockAdjustment(prev => prev + 1)}
                  className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleStockAdjustment}
                disabled={stockAdjustment === 0}
                className="w-full px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

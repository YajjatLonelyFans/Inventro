import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Package, User, Home, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Inventro</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link
              to="/products/add"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user.Image || 'https://www.w3schools.com/howto/img_avatar.png'}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

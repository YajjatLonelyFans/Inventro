import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    Image: user?.Image || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!profileData.phone || profileData.phone === '+91') {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileData.phone)) {
  newErrors.phone = 'Please enter a valid 10-digit phone number';
}


    if (profileData.bio && profileData.bio.length > 200) {
      newErrors.bio = 'Bio must not exceed 200 characters';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (passwordData.newPassword.length > 15) {
      newErrors.newPassword = 'Password must not exceed 15 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });

    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setProfileLoading(true);

    try {
      // Remove +91 prefix from phone number to match backend expectation
      const updatedProfileData = {
        ...profileData,
        phone: profileData.phone.replace(/^\+91/, '')
      };
      
      const result = await updateProfile(updatedProfileData);
      if (result.success) {
        setProfileData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          bio: user?.bio || '',
          Image: user?.Image || ''
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (result.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={user?.Image || 'https://www.w3schools.com/howto/img_avatar.png'}
                  alt="Profile"
                />
                <div>
                  <label htmlFor="Image" className="block text-sm font-medium text-gray-700">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="Image"
                    id="Image"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                    value={profileData.Image}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    profileErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
                {profileErrors.name && <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    profileErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                {profileErrors.email && <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                 <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none sm:text-sm ${
                    profileErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="XXXXXXXXXX"
                    value={profileData.phone ? `+91${profileData.phone.replace(/^\+91/, '')}` : '+91'}
                    onChange={(e) => {
                    let val = e.target.value.replace(/^\+91/, ''); // strip +91
                    setProfileData({ ...profileData, phone: val });
                  }}
/>

                {profileErrors.phone && <p className="mt-1 text-sm text-red-600">{profileErrors.phone}</p>}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={3}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    profileErrors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={handleProfileChange}
                />
                {profileErrors.bio && <p className="mt-1 text-sm text-red-600">{profileErrors.bio}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  {profileData.bio.length}/200 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    id="currentPassword"
                    required
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 ${
                      passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    required
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 ${
                      passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 ${
                      passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>}
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-gray-600">
                <p>Password must be:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>No more than 15 characters</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
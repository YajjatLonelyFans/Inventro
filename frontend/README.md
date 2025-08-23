# Inventro Frontend

A modern, responsive inventory management system built with React, Tailwind CSS, and Vite.

## Features

- 🔐 **User Authentication**: Secure login/register with JWT tokens
- 📊 **Dashboard**: Overview with key metrics and recent products
- 📦 **Product Management**: Full CRUD operations for inventory items
- 🔍 **Advanced Search**: Filter products by category, status, and search terms
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS
- 🔔 **Real-time Notifications**: Toast notifications for user feedback
- 🛡️ **Protected Routes**: Authentication-based access control

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful SVG icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx     # Main layout with sidebar
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx      # User login
│   ├── Register.jsx   # User registration
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Products.jsx   # Products listing
│   ├── AddProduct.jsx # Add new product
│   ├── EditProduct.jsx # Edit existing product
│   └── Profile.jsx    # User profile management
├── App.jsx            # Main app component
└── main.jsx          # App entry point
```

## API Integration

The frontend integrates with your backend API endpoints:

- **Authentication**: `/api/users/*`
- **Products**: `/api/products/*`

All API calls are configured with:
- Base URL: `http://localhost:3000/api`
- Credentials: `include` (for JWT cookies)
- Error handling with toast notifications

## Key Components

### Layout Component
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- User profile display and logout

### Authentication Context
- Global state management for user authentication
- Automatic token validation
- Protected route handling

### Product Management
- Comprehensive product forms with validation
- Real-time search and filtering
- Status-based color coding
- Stock level indicators

## Styling

The application uses Tailwind CSS for styling with:
- Consistent color scheme
- Responsive grid layouts
- Interactive hover states
- Loading animations
- Custom scrollbars

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Code Style
- Functional components with hooks
- Consistent naming conventions
- Error boundaries and loading states
- Form validation with user feedback

### Performance
- Lazy loading for routes
- Optimized re-renders
- Efficient state management
- Minimal bundle size

## Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Upload the `dist` folder contents
3. Configure your hosting service to serve the SPA

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states
4. Test on multiple devices
5. Update documentation as needed

## License

This project is part of the Inventro inventory management system.

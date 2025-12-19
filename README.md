# Product Management System

A modern, responsive product management application built with React, TypeScript, and TanStack Query. This application provides a comprehensive interface for browsing, viewing, editing, and managing products with real-time data synchronization.

## 🚀 Features

### Authentication
- **Login System**: Secure authentication with protected routes
- **Session Management**: Persistent login state using Context API
- **Route Protection**: Automatic redirection for unauthorized access

### Product Management
- **Product List View**: Display products in a responsive grid layout (10 products per page)
- **Search & Filter**: Real-time search by product name and filter by category
- **Pagination**: Navigate through products with intuitive pagination controls
- **Product Details Modal**: View complete product information on click

### CRUD Operations
- **View Product Details**: Complete description, price, rating, and reviews
- **Edit Products**: Update title, price, description, and category
- **Delete Products**: Remove products with confirmation dialog
- **Optimistic Updates**: Instant UI updates with automatic rollback on errors

### Data Management
- **Auto-refresh on Window Focus**: Data automatically revalidates when tab regains focus
- **Smart Caching**: Efficient cache management with TanStack Query
- **Error Handling**: Comprehensive error states with retry mechanisms
- **Loading States**: Skeleton loaders and loading indicators

### UI/UX
- **Modern Design**: Beautiful UI built with Shadcn/ui components
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Dark Mode Support**: Theme switching capability
- **Toast Notifications**: User-friendly feedback for all actions
- **Accessibility**: WCAG compliant components

## 🛠️ Technologies Used

### Core
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server

### State Management & Data Fetching
- **TanStack Query (React Query) 5.83** - Server state management
- **React Context API** - Authentication state management

### Routing
- **React Router DOM 6.30** - Client-side routing

### UI Components
- **Shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Headless UI components
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Form Handling
- **React Hook Form 7.61** - Form state management
- **Zod 3.25** - Schema validation

### Additional Libraries
- **Sonner** - Toast notifications
- **class-variance-authority** - Component variants
- **tailwind-merge** - Tailwind class merging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd psiborg-react-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🏃 Running the Application

### Development Mode
Start the development server with hot module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

### Build for Production
Create an optimized production build:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── ProductDetailModal.tsx
│   ├── ProductCardSkeleton.tsx
│   └── ProtectedRoute.tsx
├── context/            # React Context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── useProducts.ts  # Product data management
│   └── use-toast.ts    # Toast notifications
├── pages/              # Page components
│   ├── Index.tsx       # Main product page
│   ├── LoginPage.tsx   # Authentication page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   └── product.ts
├── lib/                # Utility functions
│   └── utils.ts
├── App.tsx             # Root component
└── main.tsx           # Application entry point
```

## 🌐 API Endpoints

The application uses the [Fake Store API](https://fakestoreapi.com/) for product data:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | Fetch all products |
| `/products/:id` | GET | Fetch single product details |
| `/products/:id` | PUT | Update product |
| `/products/:id` | DELETE | Delete product |
| `/products/categories` | GET | Fetch all categories |

## ✨ Key Features Implementation

### 1. Pagination
- Displays 10 products per page
- Previous/Next navigation
- Page number indicators
- Resets to page 1 on filter changes

### 2. Product Detail Modal
- Opens on product card click
- Fetches detailed data from `/products/:id` endpoint
- Shows loading state while fetching
- Displays complete description and rating information
- Edit and delete actions available

### 3. Edit Functionality
- Form validation for all fields (title, price, description, category)
- API call to `/products/:id` with PUT method
- Optimistic updates to cache
- Success/error toast notifications
- Changes persist until page refresh

### 4. Delete Functionality
- Confirmation dialog before deletion
- API call to `/products/:id` with DELETE method
- Immediate UI update (optimistic)
- Product removed from cache
- Reappears only on page refresh (expected behavior with mock API)

### 5. Window Focus Revalidation
- Automatically refetches data when tab regains focus
- Ensures users always see up-to-date information
- Configurable stale time and cache time
- Smart caching to prevent excessive requests

### 6. State Management
- TanStack Query for server state
- Optimistic updates for better UX
- Automatic error rollback
- Efficient cache invalidation

## 🔐 Authentication

### Default Credentials
- **Username**: `test@example.com`
- **Password**: `password123`

The authentication is implemented using React Context API and persists across page refreshes using localStorage.

## 🎨 UI Components

The application uses Shadcn/ui components for a consistent and modern design:
- **Dialog**: Product detail modal
- **Button**: Action buttons with variants
- **Input**: Form inputs with validation
- **Select**: Category filter dropdown
- **Badge**: Category tags
- **Alert Dialog**: Delete confirmation
- **Toast**: User feedback notifications
- **Skeleton**: Loading states

## 🚀 Deployment

The application is configured for deployment on Vercel with proper routing support via `vercel.json`.

### Deploy to Vercel
```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

## 📝 Environment Variables

Currently, the application uses the public Fake Store API and doesn't require environment variables. For production, you may want to add:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
```

## 🧪 Testing the Application

1. **Login**: Use credentials `test@example.com` / `password123`
2. **Browse Products**: Scroll through the paginated product list
3. **Search**: Type in the search box to filter products
4. **Filter**: Select a category from the dropdown
5. **View Details**: Click any product card to see detailed information
6. **Edit Product**: Click "Edit Product" button, modify fields, and save
7. **Delete Product**: Click "Delete" button and confirm
8. **Window Focus**: Switch tabs and return to see data refresh

## 🐛 Known Limitations

- The Fake Store API is a mock API, so:
  - Edit and Delete operations don't persist on the server
  - Changes are maintained in the cache until page refresh
  - This is expected behavior for demonstration purposes

## 📄 License

This project is created as an assignment for Psiborg.

## 🤝 Contributing

This is an assignment project, but suggestions and feedback are welcome.

## 📧 Contact

For any queries regarding this project, please reach out through the appropriate channels.

---

**Built with ❤️ using React, TypeScript, and TanStack Query**

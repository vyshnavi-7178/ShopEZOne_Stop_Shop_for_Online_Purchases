import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Authentication from './pages/Authentication';

// Customer Pages
import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';
import SearchResults from './pages/customer/SearchResults';

// Admin Pages
import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<IndividualProduct />} />
        <Route path="/search-results" element={<SearchResults />} />

        {/* Customer Routes */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all-products" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AllProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all-users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AllUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all-orders" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AllOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-product" 
          element={
            <ProtectedRoute requiredRole="admin">
              <NewProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/update-product/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <UpdateProduct />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
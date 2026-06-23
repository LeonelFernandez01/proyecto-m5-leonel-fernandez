import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { UserGuard } from './routes/UserGuard'
import { AdminGuard } from './routes/AdminGuard'
import { ClientLayout } from './layouts/ClientLayout'
import { AdminLayout } from './layouts/AdminLayout'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/products/pages/Home'
import { AdminProducts } from './features/products/components/AdminProducts'
import Cart from './features/cart/pages/Cart'
import Checkout from './features/cart/pages/Checkout'
import Orders from './features/cart/pages/Orders'


function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg font-medium animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
      
      
      <Route path="/" element={<Navigate to="/home" />} />

      
      <Route element={<UserGuard />}>
        <Route element={<ClientLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>

      
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminProducts />} />
        </Route>
      </Route>

      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
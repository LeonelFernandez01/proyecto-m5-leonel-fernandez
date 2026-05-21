import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { UserGuard } from './routes/UserGuard'
import { AdminGuard } from './routes/AdminGuard'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import { AdminProducts } from './components/AdminProducts'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    )
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* ================= RUTAS PÚBLICAS (SÓLO SI NO ESTÁ LOGUEADO) ================= */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
        
        {/* Redirección inicial por defecto */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* ================= RUTAS PROTEGIDAS PARA CLIENTES LOGUEADOS ================= */}
        <Route element={<UserGuard />}>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* ================= RUTAS EXCLUSIVAS PARA EL ADMINISTRADOR ================= */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route index element={<AdminProducts />} />
        </Route>

        {/* Catcher global por si mandan fruta en la URL */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App
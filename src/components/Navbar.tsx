import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { logout } from '../services/authService'

export default function Navbar() {
  const { user } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/home" className="text-xl font-bold text-blue-600">
        ECommerce
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/home" className="text-gray-600 hover:text-blue-600">
          Catálogo
        </Link>
        <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
          🛒 Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
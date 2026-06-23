import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
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

  // Get user initial for avatar bubble
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <Link to="/home" className="flex items-center gap-2 group">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight group-hover:opacity-90 transition-opacity">
          Aura<span className="gradient-text">Market</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/home" className="text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
          Catálogo
        </Link>
        
        <Link to="/cart" className="relative text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2.5 -right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-900 animate-pulse-soft shadow-md shadow-red-500/25">
              {totalItems}
            </span>
          )}
        </Link>

        <Link to="/orders" className="text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Mis órdenes
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 border border-purple-500/30 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-inner">
                {userInitial}
              </div>
              <span className="text-slate-300 text-sm font-semibold max-w-[100px] truncate hidden sm:inline">{user?.displayName || 'Usuario'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../hooks/useCart'
import ChatBot from '../components/ChatBot'

export function ClientLayout() {
  const { toast } = useCart()

  return (
    <div className="min-h-screen flex flex-col gradient-bg text-slate-100 relative">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Asistente ChatBot flotante */}
      <ChatBot />

      <footer className="border-t border-slate-800/80 bg-slate-950/40 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} AuraMarket. Todos los derechos reservados. Hecho con pasión.</p>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-pulse-soft w-max max-w-[90vw] ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : toast.type === 'warning'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-450'
        }`}>
          {toast.type === 'success' && (
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'warning' && (
            <svg className="w-5 h-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5 flex-shrink-0 text-rose-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-xs sm:text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
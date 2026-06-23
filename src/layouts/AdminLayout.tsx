import { Outlet, Link } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-extrabold text-white tracking-tight">
            Panel <span className="text-purple-400">Admin</span>
          </h1>
        </div>
        <Link 
          to="/home" 
          className="border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Volver a la Tienda
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
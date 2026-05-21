import { Outlet, Link } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Barra de navegación exclusiva de Admin */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide text-indigo-400">
          ⚙️ Panel de Control Admin
        </h1>
        <Link 
          to="/home" 
          className="bg-slate-700 hover:bg-slate-600 text-sm px-4 py-2 rounded-md transition-colors"
        >
          Volver a la Tienda
        </Link>
      </header>

      {/* Contenedor del formulario o tablas del Admin (AdminProducts) */}
      <main className="flex-grow p-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
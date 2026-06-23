import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // 👈 Importamos desde su nueva carpeta hooks!

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Verificando credenciales de administrador...</h3>
      </div>
    )
  }

  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  
  return <Outlet />
}
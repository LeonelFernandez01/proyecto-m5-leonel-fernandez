import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Verificando credenciales de administrador...</h3>
      </div>
    )
  }

  // Si no está logueado o si está logueado pero NO es administrador, rebote masivo
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Si es admin verificado por el servidor, pasa al panel de control
  return <Outlet />
}
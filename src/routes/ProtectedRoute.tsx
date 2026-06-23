import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 

export function ProtectedRoute() {
  const { user, loading } = useAuth() 

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
        <h3>Verificando permisos de administrador...</h3>
        <p>Acuñando credenciales, bancá un cachito.</p>
      </div>
    )
  }

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
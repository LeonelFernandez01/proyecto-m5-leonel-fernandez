import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // 👈 Importamos desde su nueva carpeta hooks!

export function ProtectedRoute() {
  const { user, loading } = useAuth() // 👈 Sacamos el usuario y el loading limpios de acá

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>
        <h3>Verificando permisos de administrador...</h3>
        <p>Acuñando credenciales, bancá un cachito.</p>
      </div>
    )
  }

  // Si el usuario existe y su rol en Firestore es 'admin', pasa al formulario (Outlet).
  // Si no, lo saca zumbando de patitas a la calle al catálogo ("/")
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
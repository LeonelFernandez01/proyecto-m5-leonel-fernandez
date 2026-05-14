import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

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
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={
        user
          ? <div className="p-8">
              <h1 className="text-2xl font-bold">Bienvenido, {user.displayName} 👋</h1>
            </div>
          : <Navigate to="/login" />
      } />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
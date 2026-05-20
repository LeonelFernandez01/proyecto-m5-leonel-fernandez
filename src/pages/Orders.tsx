import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getOrdersByUser, getAllOrders, updateOrderStatus } from '../services/orderService'
import type { Order } from '../types'

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: '⏳ Pendiente',
  processing: '🔄 En proceso',
  completed: '✅ Completada',
  cancelled: '❌ Cancelada'
}

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Detectamos de forma segura si el usuario actual es Administrador
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      try {
        setLoading(true)
        // SI ES ADMIN: Trae absolutamente todo. SI ES CUSTOMER: Trae solo las suyas.
        const data = isAdmin 
          ? await getAllOrders() 
          : await getOrdersByUser(user.uid)
        setOrders(data)
      } catch (err) {
        console.error("Error al cargar órdenes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user, isAdmin])

  // Función que gatilla el Admin para cambiar el estado desde la UI
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      // Actualizamos el estado local para que la UI cambie al toque sin recargar la página
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      console.error("No se pudo actualizar el estado de la orden:", err)
      alert("Error al cambiar el estado")
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 font-medium">Cargando panel de órdenes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título dinámico según quién mira la pantalla */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdmin ? '🛡️ Panel de Control: Órdenes Globales' : 'Mis órdenes'}
        </h1>
        {isAdmin && (
          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Modo Admin
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No hay órdenes registradas en el sistema.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">ID: {order.id}</p>
                  {isAdmin && <p className="text-sm font-semibold text-purple-700">Cliente UID: {order.userId}</p>}
                  <p className="text-sm text-gray-500">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : 'Fecha no disponible'}
                  </p>
                </div>

                {/* Si es Admin muestra el selector para cambiar estado. Si es cliente, solo texto plano. */}
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Estado:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${STATUS_COLORS[order.status]}`}
                    >
                      <option value="pending">⏳ Pendiente</option>
                      <option value="processing">🔄 En proceso</option>
                      <option value="completed">✅ Completada</option>
                      <option value="cancelled">❌ Cancelada</option>
                    </select>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-1.5 border-b border-gray-50 border-dashed last:border-none">
                    <span className="text-gray-600">{item.product.name} <strong className="text-gray-800">x{item.quantity}</strong></span>
                    <span className="font-medium text-gray-700">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
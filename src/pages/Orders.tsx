import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getOrdersByUser } from '../services/orderService'
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

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      try {
        const data = await getOrdersByUser(user.uid)
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Cargando órdenes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Mis órdenes</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No tenés órdenes todavía.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-400 font-mono">{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : 'Fecha no disponible'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="border-t pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-1">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span className="font-medium">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
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
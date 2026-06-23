import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth"; 
import {
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../../../services/orderService";
import type { Order } from "../../../types";
import Spinner from "../../../components/Spinner";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "⏳ Pendiente",
  processing: "🔄 En proceso",
  completed: "✅ Completada",
  cancelled: "❌ Cancelada",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  processing: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-450 border border-rose-500/20",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        setLoading(true);
        const data = isAdmin
          ? await getAllOrders()
          : await getOrdersByUser(user.uid);
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, isAdmin]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error("No se pudo actualizar el estado de la orden:", err);
      alert("Error al cambiar el estado");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner message="Cargando tus pedidos..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isAdmin ? "Control de Órdenes Globales" : "Mis Órdenes"}
          </h1>
        </div>
        {isAdmin && (
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Panel Administrador
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-900/60">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <p className="text-slate-400 font-semibold">No hay órdenes registradas en el sistema.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 shadow-md hover:border-slate-750 transition-all duration-200"
            >
              {/* Order Info Row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ID Pedido:</span>
                    <span className="text-xs text-indigo-300 font-mono font-semibold">{order.id}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cliente UID:</span>
                      <span className="text-xs text-purple-400 font-mono font-semibold">{order.userId}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-450 font-medium">
                    Fecha:{" "}
                    <span className="text-slate-350">
                      {typeof (order.createdAt as { toDate?: () => Date }).toDate === 'function'
                        ? (order.createdAt as { toDate: () => Date }).toDate().toLocaleDateString()
                        : "Fecha no disponible"}
                    </span>
                  </p>
                </div>

                {/* Status selector or badge */}
                {isAdmin ? (
                  <div className="flex items-center gap-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Estado:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as Order["status"],
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border bg-slate-950 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all ${STATUS_COLORS[order.status]}`}
                    >
                      <option value="pending" className="bg-slate-900 text-amber-400">⏳ Pendiente</option>
                      <option value="processing" className="bg-slate-900 text-indigo-400">🔄 En proceso</option>
                      <option value="completed" className="bg-slate-900 text-emerald-400">✅ Completada</option>
                      <option value="cancelled" className="bg-slate-900 text-rose-450">❌ Cancelada</option>
                    </select>
                  </div>
                ) : (
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-3 pl-1">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-xs py-2 border-b border-slate-800/40 border-dashed last:border-none"
                  >
                    <span className="text-slate-350 font-medium">
                      {item.product.name}{" "}
                      <strong className="text-indigo-450 ml-1.5">
                        x{item.quantity}
                      </strong>
                    </span>
                    <span className="font-bold text-slate-200">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-slate-800/80 mt-5 pt-4 flex justify-between font-extrabold text-lg text-slate-100">
                <span>Total abonado</span>
                <span className="gradient-text">${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
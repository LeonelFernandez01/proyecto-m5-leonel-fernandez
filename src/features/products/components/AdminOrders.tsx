import { useEffect, useState } from "react";
import { db } from "../../../config/firebase"; // Ajustá si hace falta
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import Spinner from "../../../components/Spinner";
// 👇 Importamos tu tipo real directamente desde tu index
import type { Order } from "../../../types"; 

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Order[]; // Lo casteamos a tu interfaz real

      setOrders(ordersData);
    } catch (error) {
      console.error("Error al traer las órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert("No se pudo actualizar el estado de la orden");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Spinner message="Cargando historial de ventas..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Control de Ventas (Órdenes)</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Todavía no se registró ninguna venta.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            // Manejo seguro por si Firebase devuelve Timestamp
            const orderDate = order.createdAt && typeof (order.createdAt as any).toDate === "function"
              ? (order.createdAt as any).toDate()
              : new Date(order.createdAt);

            return (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow border flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-mono text-gray-400">ID: {order.id}</span>
                    <span className="text-sm text-gray-500">
                      {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>ID Usuario:</strong> {order.userId}
                  </p>

                  <div className="border-t pt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Detalle del pedido:</p>
                    {order.items?.map((item, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        • {item.product?.name} <span className="text-gray-400">x{item.quantity}</span> — ${item.product?.price} c/u
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                  <p className="text-xl font-bold text-gray-900">Total: ${order.total}</p>
                  
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Estado:</label>
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`w-full p-2 rounded border font-medium focus:outline-none ${
                        order.status === "completed" ? "bg-green-50 border-green-300 text-green-700" :
                        order.status === "cancelled" ? "bg-red-50 border-red-300 text-red-700" :
                        order.status === "processing" ? "bg-blue-50 border-blue-300 text-blue-700" :
                        "bg-yellow-50 border-yellow-300 text-yellow-700"
                      }`}
                    >
                      <option value="pending">⏳ Pendiente</option>
                      <option value="processing">⚙️ Procesando</option>
                      <option value="completed">✅ Completado</option>
                      <option value="cancelled">❌ Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
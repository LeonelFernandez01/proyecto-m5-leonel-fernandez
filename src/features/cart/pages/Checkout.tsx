import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";
import { createOrder } from "../../../services/orderService";

type ModalState = "hidden" | "success" | "error";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>("hidden");
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleConfirmOrder() {
    if (!user) return;
    setLoading(true);
    try {
      const id = await createOrder(user.uid, items, total);
      setOrderId(id);
      clearCart();
      setModal("success");
    } catch (err) {
      setModal("error");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && modal === "hidden") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-xl">No hay productos en el carrito</p>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Resumen */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center py-3 border-b"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    item.product.imageUrl || "https://via.placeholder.com/60"
                  }
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold">${item.product.price * item.quantity}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* Confirmar */}
        <div className="bg-white rounded-lg shadow p-6 h-fit w-full lg:w-80">
          <h2 className="text-xl font-bold mb-4">Confirmar pedido</h2>
          <p className="text-gray-500 text-sm mb-6">
            Al confirmar se creará tu orden. El pago es simulado.
          </p>
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Procesando..." : "Confirmar orden"}
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full border border-gray-300 text-gray-600 py-2 rounded mt-2 hover:bg-gray-50"
          >
            Volver al carrito
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal !== "hidden" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            {modal === "success" ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">¡Orden confirmada!</h2>
                <p className="text-gray-500 mb-2">
                  Tu pedido fue procesado correctamente.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  ID: <span className="font-mono text-gray-600">{orderId}</span>
                </p>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                  Seguir comprando
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-500 mb-6">
                  No se pudo procesar la orden. Intentá de nuevo.
                </p>
                <button
                  onClick={() => setModal("hidden")}
                  className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

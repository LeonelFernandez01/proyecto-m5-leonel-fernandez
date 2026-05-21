import { useCart } from "../../../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-xl">Tu carrito está vacío</p>
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
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lista de items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => {
            // Aseguramos que lea el stock de forma segura
            const maxStock = item.product.stock ?? 0;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow p-4 flex gap-4 items-center"
              >
                <img
                  src={item.product.imageUrl || "https://via.placeholder.com/100"}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-blue-600 font-bold">${item.product.price}</p>
                  <p className="text-xs text-gray-400">Disponibles: {maxStock} u.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  
                  {/* 🛑 Botón + controlado por stock real */}
                  <button
                    onClick={() => {
                      if (item.quantity >= maxStock) return;
                      updateQuantity(item.product.id, item.quantity + 1);
                    }}
                    disabled={item.quantity >= maxStock}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-lg w-24 text-right">
                  ${item.product.price * item.quantity}
                </p>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl ml-2"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow p-6 h-fit w-full lg:w-80">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-blue-600 text-white py-3 rounded mt-6 hover:bg-blue-700 font-medium"
          >
            Ir al checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full border border-red-400 text-red-500 py-2 rounded mt-2 hover:bg-red-50"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
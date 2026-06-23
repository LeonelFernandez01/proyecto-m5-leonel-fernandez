import { useCart } from "../../../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-20 h-20 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
          <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1.5">Tu carrito está vacío</h2>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Agrega algunos artículos geniales del catálogo para comenzar tu compra.</p>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all duration-200 text-sm"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Tu Carrito</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items List */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {items.map((item) => {
            const maxStock = item.product.stock ?? 0;

            return (
              <div
                key={item.product.id}
                className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center hover:border-slate-700/80 transition-all duration-200 shadow-md"
              >
                <img
                  src={item.product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0"
                />
                
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="font-bold text-slate-100 text-lg truncate">{item.product.name}</h3>
                  <p className="text-indigo-400 font-extrabold mt-0.5">${item.product.price}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                    Disponibles: <span className="text-slate-400">{maxStock} u.</span>
                  </p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-slate-950/60 rounded-xl p-1.5 border border-slate-800/80">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                    className="w-8 h-8 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg flex items-center justify-center font-bold transition-all border border-slate-800 active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (item.quantity >= maxStock) return;
                      updateQuantity(item.product.id, item.quantity + 1);
                    }}
                    disabled={item.quantity >= maxStock}
                    className="w-8 h-8 bg-slate-900 hover:bg-slate-850 text-slate-300 disabled:text-slate-650 rounded-lg flex items-center justify-center font-bold transition-all border border-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    +
                  </button>
                </div>
                
                {/* Item Total Price */}
                <div className="text-center sm:text-right min-w-[90px]">
                  <p className="text-slate-100 font-extrabold text-lg">
                    ${item.product.price * item.quantity}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary Panel */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 w-full lg:w-80 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Resumen de Compra</h2>
          
          <div className="space-y-3.5">
            <div className="flex justify-between text-sm text-slate-400 font-medium">
              <span>Subtotal</span>
              <span className="text-slate-200 font-semibold">${total}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400 font-medium">
              <span>Envío</span>
              <span className="text-emerald-400 font-semibold">Gratis</span>
            </div>
            <div className="border-t border-slate-800/80 pt-4 flex justify-between font-extrabold text-lg text-slate-100">
              <span>Total</span>
              <span className="gradient-text">${total}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] text-sm uppercase tracking-wider"
            >
              Ir al checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 py-2.5 rounded-xl font-semibold transition-all duration-200 text-xs active:scale-[0.98]"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
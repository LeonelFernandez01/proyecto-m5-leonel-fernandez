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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-20 h-20 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
          <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1.5">No hay productos en el carrito</h2>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Vuelve al catálogo para añadir los productos que quieras antes de hacer el checkout.</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Order Summary list */}
        <div className="flex-1 w-full bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>Resumen del Pedido</span>
            <span className="text-xs bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-full font-semibold">{items.length} Artículos</span>
          </h2>
          
          <div className="divide-y divide-slate-800/60 max-h-[450px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-950 border border-slate-800"
                  />
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{item.product.name}</p>
                    <p className="text-slate-400 text-xs mt-1 font-semibold">
                      Cantidad: <span className="text-slate-200">{item.quantity}</span>
                    </p>
                  </div>
                </div>
                <p className="font-extrabold text-slate-200 text-sm">${item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between font-extrabold text-xl pt-5 border-t border-slate-800 text-slate-100">
            <span>Total</span>
            <span className="gradient-text">${total}</span>
          </div>
        </div>

        {/* Confirm Order Action Sidebar */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 w-full lg:w-80 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Finalizar Orden</h2>
          
          <div className="space-y-4">
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Al confirmar se registrará tu orden en la base de datos de AuraMarket. El pago es simulado para fines del proyecto.
            </p>
            
            <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-800/50 flex items-start gap-2.5">
              <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-[11px] text-slate-500 font-medium">
                Soporte en línea disponible 24/7 para cambios en la dirección de entrega.
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-[0.98] text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                "Confirmar orden"
              )}
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full border border-slate-800 bg-slate-900/20 hover:bg-slate-800 text-slate-350 py-2.5 rounded-xl font-semibold transition-all duration-200 text-xs active:scale-[0.98]"
            >
              Volver al carrito
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Glass Modals */}
      {modal !== "hidden" && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            {/* Glowing spot background */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
              modal === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"
            }`}></div>

            {modal === "success" ? (
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">¡Orden confirmada!</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Tu pedido fue procesado correctamente y ya se encuentra registrado.
                  </p>
                </div>
                
                <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-850">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Identificador de Pedido</p>
                  <span className="font-mono text-xs text-indigo-350 font-semibold">{orderId}</span>
                </div>
                
                <button
                  onClick={() => navigate("/home")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all active:scale-[0.98] shadow-md shadow-indigo-600/15 text-sm"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Error al procesar</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    No se pudo procesar la orden en este momento. Por favor intenta de nuevo.
                  </p>
                </div>
                
                <button
                  onClick={() => setModal("hidden")}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold transition-all active:scale-[0.98] shadow-md shadow-rose-600/15 text-sm"
                >
                  Cerrar y Reintentar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

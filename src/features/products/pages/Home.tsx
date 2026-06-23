import { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useCart } from "../../../hooks/useCart";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Product } from "../../../types";
import Spinner from "../../../components/Spinner";

const CATEGORIES = ["Todos", "Ropa", "Electrónica", "Accesorios", "Hogar"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { products, loading, error } = useProducts(selectedCategory);
  const { addItem } = useCart();
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner message="Trayendo el catálogo..." />
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error al cargar productos</h3>
        <p className="text-slate-400 max-w-sm text-sm">No pudimos conectar con el servidor. Intente refrescar la página.</p>
      </div>
    );

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 shadow-2xl shadow-indigo-500/5">
        {/* Glow decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-widest animate-pulse-soft">
            🔥 Colección de Verano
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Descubre Productos <span className="gradient-text">Premium</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
            Explora una amplia selección de las mejores marcas con envío rápido garantizado y soporte especializado.
          </p>
        </div>
      </div>

      {/* Search and Category Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Category Filter Chips */}
        <div className="flex gap-2.5 flex-wrap order-2 md:order-1">
          {CATEGORIES.map((cat) => {
            const isActive = (cat === "Todos" && !selectedCategory) || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(cat === "Todos" ? undefined : cat)
                }
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]"
                    : "bg-slate-900/50 hover:bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:max-w-xs order-1 md:order-2">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-semibold"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-900/60">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-slate-400 font-semibold">No hay productos disponibles con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addItem}
              onViewDetails={setDetailProduct}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-905 border border-slate-800/80 rounded-3xl max-w-2xl w-full relative overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-950/60 border border-slate-800/85 text-slate-400 hover:text-white flex items-center justify-center z-30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left: Product Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-950 relative">
              <img
                src={detailProduct.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-slate-900/10 pointer-events-none"></div>
            </div>

            {/* Right: Product Content */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-slate-900">
              <div className="space-y-4">
                <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  {detailProduct.category}
                </span>
                
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {detailProduct.name}
                </h2>

                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">(5.0 / 5.0)</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {detailProduct.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-white">${detailProduct.price}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    (detailProduct.stock ?? 0) > 0
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                  }`}>
                    {(detailProduct.stock ?? 0) > 0 ? `En Stock: ${detailProduct.stock} u.` : "Agotado"}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addItem(detailProduct);
                    setDetailProduct(null);
                  }}
                  disabled={(detailProduct.stock ?? 0) <= 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:border-slate-800 text-white disabled:text-slate-600 py-3 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-600/15"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}) {
  const productStock = product.stock ?? 0;

  return (
    <div className="group bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:border-indigo-500/30 shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-300 p-4 flex flex-col relative overflow-hidden">
      {/* Product Image Container */}
      <div 
        onClick={() => onViewDetails(product)}
        className="w-full h-48 overflow-hidden rounded-xl bg-slate-950 mb-4 relative cursor-pointer group/img"
      >
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
          alt={product.name}
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
        />
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Ratings Placeholder */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-500">(5.0)</span>
      </div>

      {/* Product Details */}
      <h3 
        onClick={() => onViewDetails(product)}
        className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1 cursor-pointer"
      >
        {product.name}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{product.description}</p>

      {/* Pricing & Stock */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-white font-extrabold text-xl">${product.price}</p>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wide uppercase ${
          productStock > 0 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        }`}>
          {productStock > 0 ? `Stock: ${productStock} u.` : "Agotado"}
        </span>
      </div>

      {/* Add To Cart Action */}
      <button
        onClick={() => onAddToCart(product)}
        disabled={productStock <= 0}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:border-slate-800 text-white disabled:text-slate-600 py-2.5 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:shadow-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
    </div>
  );
}
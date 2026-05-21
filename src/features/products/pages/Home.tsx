import { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useCart } from "../../../hooks/useCart";
import type { Product } from "../../../types";
import Spinner from "../../../components/Spinner";

const CATEGORIES = ["Todos", "Ropa", "Electrónica", "Accesorios", "Hogar"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [search, setSearch] = useState("");
  const { products, loading, error } = useProducts(selectedCategory);
  const { addItem } = useCart();

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );
  if (loading) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Spinner message="Trayendo el catálogo..." />
    </div>
  );
}

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner message="Error al cargar los productos." />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Categorías */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(cat === "Todos" ? undefined : cat)
            }
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              (cat === "Todos" && !selectedCategory) || selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Productos */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  // Manejo seguro del stock si viene indefinido desde la base de datos
  const productStock = product.stock ?? 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2 flex-1">{product.description}</p>
      
      {/* 📊 Bloque visual de Stock */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-blue-600 font-bold text-xl">${product.price}</p>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          productStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {productStock > 0 ? `Stock: ${productStock} u.` : "Agotado"}
        </span>
      </div>

      <button
        onClick={() => onAddToCart(product)}
        disabled={productStock <= 0}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
      >
        {productStock > 0 ? "Agregar al carrito" : "Sin stock"}
      </button>
    </div>
  );
}
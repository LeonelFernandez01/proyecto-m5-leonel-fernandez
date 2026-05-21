import { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useCart } from "../../../hooks/useCart";
import type { Product } from "../../../types";

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
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
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
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2 flex-1">{product.description}</p>
      <p className="text-blue-600 font-bold text-xl mb-4">${product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Agregar al carrito
      </button>
    </div>
  );
}

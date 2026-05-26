import { useState, useEffect } from "react";
import { uploadImageToS3 } from '../../../services/s3Service';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../../../config/firebase';
import type { Product } from "../../../types";

const CATEGORIES = ["Ropa", "Electrónica", "Accesorios", "Hogar"];

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategory(product.category);
    setStock(String(product.stock));
    setImageFile(null);
    setMessage("");
  }

  function handleCancel() {
    setEditingId(null);
    setName(""); setPrice(""); setDescription("");
    setCategory(""); setStock(""); setImageFile(null);
    setMessage("");
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", id));
    setMessage("Producto eliminado.");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = "";

      if (imageFile) {
        setMessage("Subiendo imagen a S3...");
        imageUrl = await uploadImageToS3(imageFile);
      }

      if (editingId) {
        const updateData: Partial<Product> = {
          name, price: Number(price), description, category, stock: Number(stock)
        };
        if (imageUrl) updateData.imageUrl = imageUrl;
        await updateDoc(doc(db, "products", editingId), updateData);
        setMessage("¡Producto actualizado! ✅");
        setEditingId(null);
      } else {
        if (!imageFile) { setMessage("Seleccioná una imagen."); return; }
        await addDoc(collection(db, "products"), {
          name, price: Number(price), description, category,
          stock: Number(stock), imageUrl, createdAt: new Date()
        });
        setMessage("¡Producto creado con éxito en Firebase con su foto en S3! 🚀");
      }

      setName(""); setPrice(""); setDescription("");
      setCategory(""); setStock(""); setImageFile(null);
    } catch (error) {
     setMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? "✏️ Editar Producto" : "➕ Cargar Producto"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio ($)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccioná una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} required
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Foto {editingId && "(opcional — dejá vacío para mantener la actual)"}
            </label>
            <input type="file" accept="image/*"
              onChange={e => e.target.files && setImageFile(e.target.files[0])}
              className="w-full text-gray-300" required={!editingId} />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium">
              {loading ? "Procesando..." : editingId ? "Actualizar" : "Guardar Producto"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}
                className="flex-1 border border-gray-500 text-gray-300 py-2 rounded hover:bg-gray-700">
                Cancelar
              </button>
            )}
          </div>

          {message && <p className="text-blue-400 font-medium">{message}</p>}
        </form>

        <div>
          <h3 className="text-lg font-bold mb-4">Productos existentes</h3>
          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            {products.map(p => (
              <div key={p.id} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-400">${p.price} — Stock: {p.stock}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(p)}
                    className="text-xs bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
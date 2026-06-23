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
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {editingId ? "Editar Producto Existente" : "Crear Nuevo Producto"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-5 shadow-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Ej: Camiseta de Algodón Premium"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-medium" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Precio ($)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                placeholder="0"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Stock</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} required
                placeholder="0"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-medium" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3}
              placeholder="Detalla las características del producto..."
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-medium resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} required
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-500 font-medium cursor-pointer">
              <option value="" className="bg-slate-950 text-slate-400">Seleccioná una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-950 text-white">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">
              Foto {editingId && <span className="text-slate-500 lowercase">(opcional — vacío mantiene la actual)</span>}
            </label>
            <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center hover:border-purple-500/40 transition-colors duration-250 cursor-pointer bg-slate-950/20">
              <input type="file" accept="image/*"
                onChange={e => e.target.files && setImageFile(e.target.files[0])}
                className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 file:cursor-pointer hover:file:bg-purple-500/20" 
                required={!editingId} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 text-sm shadow-md shadow-purple-500/15">
              {loading ? "Procesando..." : editingId ? "Actualizar" : "Guardar Producto"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}
                className="flex-1 border border-slate-800 bg-slate-900/25 hover:bg-slate-800 text-slate-300 py-3 rounded-xl font-semibold transition-all duration-200 text-xs active:scale-[0.98]">
                Cancelar
              </button>
            )}
          </div>

          {message && (
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-850 text-center">
              <p className="text-xs text-purple-400 font-bold">{message}</p>
            </div>
          )}
        </form>

        {/* Existing Products Listing */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>Catálogo Activo</span>
            <span className="text-xs bg-slate-800 text-purple-400 px-2 py-0.5 rounded-full font-semibold">{products.length} Productos</span>
          </h3>
          
          <div className="flex flex-col gap-3.5 max-h-[580px] overflow-y-auto pr-2">
            {products.map(p => (
              <div key={p.id} className="bg-slate-950/40 rounded-xl p-3.5 flex items-center gap-4 hover:border-purple-500/20 border border-slate-850/80 transition-all duration-200">
                <img src={p.imageUrl} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-slate-950 border border-slate-850 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-100 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-slate-450 mt-0.5">
                    Precio: <span className="text-indigo-400 font-bold">${p.price}</span> — Stock: <span className="text-slate-300 font-semibold">{p.stock} u.</span>
                  </p>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(p)}
                    className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 px-2.5 py-1.5 rounded-lg transition-all active:scale-95">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-450 px-2.5 py-1.5 rounded-lg transition-all active:scale-95">
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
import { useState } from "react";
import { uploadImageToS3 } from "../services/s3Service"; // 👈 Importamos la función que sube a S3
import { db } from "../config/firebase"; // 👈 Importamos tu base de datos de Firebase
import { collection, addDoc } from "firebase/firestore"; // 👈 Funciones oficiales de Firebase para guardar

export function AdminProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Por favor, seleccioná una imagen.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Subiendo imagen a AWS S3... Esperá un cachito.");

      // 1. Subimos la foto a Amazon S3 y nos da la URL
      const finalImageUrl = await uploadImageToS3(imageFile);

      setMessage("Imagen subida joya. Guardando producto en Firebase...");

      // 2. Armamos el objeto tal cual como lo espera Firestore
      const newProduct = {
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock),
        imageUrl: finalImageUrl, // La URL de Amazon
        createdAt: new Date(),
      };

      // 3. PASO CLAVE: Guardamos en la colección "products" de Firestore
      await addDoc(collection(db, "products"), newProduct);

      setMessage(
        "¡Producto creado con éxito en Firebase con su foto en S3! 🚀",
      );

      // Limpiamos los campos del formulario
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setImageFile(null);
    } catch (error: any) {
      console.error(error);
      setMessage(`Uh, falló algo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Panel de Administración - Cargar Producto</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block" }}>Nombre del Producto:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block" }}>Precio ($):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block" }}>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block" }}>Categoría:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block" }}>Stock disponible:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Foto del Producto:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Procesando..." : "Guardar Producto"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", fontWeight: "bold", color: "#0070f3" }}>
          {message}
        </p>
      )}
    </div>
  );
}

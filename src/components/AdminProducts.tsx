import { useState } from 'react'
import { uploadImageToS3 } from '../services/s3Service'

export function AdminProducts() {
  // Estados para los datos del formulario
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  
  // Estado para guardar el archivo de la foto seleccionado
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // Estados para controlar lo que pasa en la pantalla (cargas y errores)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Función que se ejecuta cuando el admin le da al botón "Guardar Producto"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validamos que haya elegido una foto obligatoriamente
    if (!imageFile) {
      setMessage('Por favor, seleccioná una imagen para el producto.')
      return
    }

    try {
      setLoading(true)
      setMessage('Subiendo imagen a AWS S3... Esperá un cachito.')

      // 1. LLAMAMOS A TU FUNCIÓN DE S3SERVICE
      const finalImageUrl = await uploadImageToS3(imageFile)
      
      setMessage('Imagen subida joya. Guardando producto en la base de datos...')

      // 2. ARMAMOS EL OBJETO FINAL CON LA URL QUE NOS DEVOLVIÓ AMAZON
      const newProduct = {
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock),
        imageUrl: finalImageUrl, // 👈 Acá queda la URL pública de tu S3
        createdAt: new Date()
      }

      console.log('¡Producto listo para mandar a Firebase!:', newProduct)
      
      // TODO: Acá abajo meteremos el "addDoc" de Firebase en el próximo paso
      
      setMessage('¡Producto creado con éxito con su foto en S3!')
      
      // Limpiamos el formulario para poder cargar otro
      setName('')
      setPrice('')
      setDescription('')
      setCategory('')
      setStock('')
      setImageFile(null)

    } catch (error: any) {
      console.error(error)
      setMessage(`Uh, falló algo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Panel de Administración - Cargar Producto</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Nombre del Producto:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Precio ($):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Descripción:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Categoría:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Stock disponible:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ width: '100%' }} />
        </div>

        {/* INPUT CLAVE PARA SELECCIONAR EL ARCHIVO MULTIMEDIA */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Foto del Producto:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]) // Guardamos el archivo binario en el estado
              }
            }} 
            required 
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Procesando...' : 'Guardar Producto'}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#0070f3' }}>{message}</p>}
    </div>
  )
}
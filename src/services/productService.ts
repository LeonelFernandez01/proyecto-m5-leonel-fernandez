import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from '../types'

// Traer todos los productos
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
}

// Traer productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('category', '==', category))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
}

// Traer un producto por id
export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Product
}

// Crear producto (admin)
export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), product)
  return docRef.id
}

// Actualizar producto (admin)
export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), data)
}

// Eliminar producto (admin)
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id))
}
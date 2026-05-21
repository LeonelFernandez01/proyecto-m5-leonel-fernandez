import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
  runTransaction, // 👈 Sumamos el motor de transacciones de Firebase
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Order, CartItem } from "../types";

// ============================================================================
// 1. Crear una orden con descuento de stock automatizado (Transacción Atómica)
// ============================================================================
export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
): Promise<string> {
  
  // runTransaction asegura que si no hay stock de algún producto, no se cree la orden ni se reste nada
  return await runTransaction(db, async (transaction) => {
    const productUpdates: { docRef: any; newStock: number }[] = [];

    // Paso A: Chequear el stock de cada producto en el carrito
    for (const item of items) {
      const productRef = doc(db, "products", item.product.id);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error(`El producto ${item.product.name} no existe en la base de datos.`);
      }

      const productData = productSnap.data();
      const currentStock = productData.stock ?? 0; // Si no está definido el campo, asume 0

      // Si el cliente pide más de lo que hay, frena el proceso acá tirando un error
      if (currentStock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.product.name}. Quedan ${currentStock} unidades.`);
      }

      // Guardamos la info para actualizarla en el paso siguiente
      productUpdates.push({
        docRef: productRef,
        newStock: currentStock - item.quantity,
      });
    }

    // Paso B: Si todos tienen stock disponible, restamos las unidades correspondientes
    for (const update of productUpdates) {
      transaction.update(update.docRef, { stock: update.newStock });
    }

    // Paso C: Creamos el documento de la orden con su ID seguro de Firebase
    const order = {
      userId,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
    };
    
    const ordersRef = collection(db, "orders");
    const newOrderDocRef = doc(ordersRef); // Genera la referencia con un ID único autogenerado
    transaction.set(newOrderDocRef, order);

    return newOrderDocRef.id; // Devolvemos el ID al Checkout para el modal de éxito
  });
}

// ============================================================================
// 2. Traer órdenes de un usuario específico (Historial Cliente)
// ============================================================================
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

// ============================================================================
// 3. Traer todas las órdenes del sistema (Panel Admin)
// ============================================================================
export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

// ============================================================================
// 4. Actualizar el estado de una orden (Panel Admin)
// ============================================================================
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), { status });
}
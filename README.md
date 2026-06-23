
# 🛒 AuraMarket — Proyecto Integrador Premium M5

Aplicación de e-commerce completa y de diseño premium construida con React 18 + TypeScript, desplegada en Vercel con autenticación Firebase, base de datos Firestore y almacenamiento de imágenes en AWS S3. Rediseñada con una estética oscura moderna, efectos de vidrio esmerilado (*glassmorphism*) y validación de experiencia de usuario en tiempo real.

**🔗 Demo en producción:** https://proyecto-m5-leonel-fernandez.vercel.app

---

## 📋 Descripción del proyecto

E-commerce full stack con flujo completo de compra rediseñado bajo una estética premium moderna y oscura (*dark theme* con *glassmorphism*). Incluye catálogo con buscador y filtros dinámicos por categorías, modal de vista rápida para productos, carrito de compras con control y validación estricta de stock en tiempo real, notificaciones flotantes (*toasts*) centradas e intuitivas para el usuario, checkout simulado con modales inmersivos de éxito/error, y panel de administración CRUD completamente integrado al sistema de diseño.

---

## 🏗️ Arquitectura y decisiones técnicas

### ¿Por qué Context API + useReducer y no Redux?
El proyecto usa Context API para el estado global porque la escala de la aplicación no justifica la complejidad de Redux. Se eligió `useReducer` para el carrito específicamente porque tiene múltiples acciones que modifican el mismo estado (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`), lo que hace que un reducer sea más predecible y testeable que múltiples `useState`.

### ¿Por qué AWS S3 para imágenes?
Firebase Storage tiene limitaciones en el plan gratuito. S3 con presigned URLs es más escalable y seguro: el frontend nunca tiene las credenciales de AWS — las solicita a una Serverless Function que genera una URL temporal firmada, y el cliente sube directamente a S3.

### Estructura de carpetas
El proyecto sigue una arquitectura en capas con separación clara de responsabilidades:
- `features/auth` — páginas de Login y Register rediseñadas con tarjetas de vidrio
- `features/products` — catálogo interactivo, modal de vista rápida y panel admin moderno
- `features/cart` — carrito con alertas de stock, checkout y gestión de órdenes coloreadas
- `contexts/` — estado global (AuthContext, CartContext + cartReducer con seguridad de stock)
- `hooks/` — lógica reutilizable (useAuth, useCart, useProducts, useDebounce)
- `services/` — acceso a APIs externas (authService, productService, orderService, s3Service)
- `routes/` — protección de rutas (UserGuard, AdminGuard)
- `layouts/` — layouts premium (ClientLayout con notificaciones centralizadas, AdminLayout)
- `types/` — contratos de datos TypeScript
- `tests/` — tests unitarios e integración
- `api/` — Vercel Serverless Functions (upload a S3)
- `config/` — configuración de Firebase
---

## 🚀 Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS (con fuentes de Google y animaciones personalizadas), React Router v6

**Backend/Servicios:** Firebase Authentication, Firebase Firestore, AWS S3, Vercel Serverless Functions

**Testing:** Vitest, React Testing Library

**Deploy:** Vercel + GitHub CI/CD

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/LeonelFernandez01/proyecto-m5-leonel-fernandez.git
cd proyecto-m5-leonel-fernandez
npm install
```

### 2. Variables de entorno
Copiá el archivo de ejemplo y completá con tus credenciales:
```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION_NAME=
AWS_BUCKET_NAME=
```

### 3. Correr en desarrollo
```bash
npm run dev
```

---

## 📤 Flujo de upload de imágenes a S3

1. El admin selecciona una imagen en el panel
2. El frontend llama a `/api/upload` (Vercel Serverless Function)
3. La función genera una presigned URL usando las credenciales de AWS (nunca expuestas al cliente)
4. El frontend sube la imagen directamente a S3 usando esa URL temporal
5. La URL pública de S3 se guarda en Firestore junto con los datos del producto

---

## 🤖 Bitácora de uso de IA

| # | Momento | Herramienta | Prompt / Consulta | Resultado / Aprendizaje |
|---|---------|-------------|-------------------|------------------------|
| 1 | Diseño de arquitectura inicial | Claude | "Tengo que hacer un ecommerce con React, Firebase y S3. ¿Cómo organizo las carpetas siguiendo buenas prácticas?" | Definí la arquitectura en capas (types, services, contexts, hooks, components, pages) con separación clara de responsabilidades |
| 2 | Implementación del CartContext | Claude | "¿Por qué usar useReducer en vez de useState para el carrito?" | Entendí que useReducer centraliza múltiples acciones sobre el mismo estado, haciéndolo más predecible y testeable |
| 3 | Debug de error CORS en S3 | Claude | "Me tira este error: Access to fetch blocked by CORS policy" | Aprendí a configurar la política CORS del bucket S3 para permitir requests desde el dominio de producción |
| 4 | Configuración de onSnapshot | Claude | "¿Qué diferencia hay entre getDocs y onSnapshot en Firestore?" | Reemplacé getDocs por onSnapshot para tener actualizaciones en tiempo real sin recargar la página |
| 5 | Implementación del debounce | Claude | "¿Cómo implemento debounce en el buscador para no filtrar en cada tecla?" | Creé el custom hook useDebounce que espera 400ms después de que el usuario deja de escribir |
| 6 | Resolución de error de deploy en Vercel | Claude | "El build falla con: Cannot find name process. Do you need @types/node?" | Instalé @types/node y lo agregué al tsconfig para que TypeScript reconozca las variables de entorno de Node |
| 7 | Tests de integración | Claude | "¿Cómo mockeo Firebase en Vitest para testear el componente Home sin llamadas reales?" | Aprendí a usar vi.mock para interceptar los módulos de Firebase y simular respuestas controladas |
| 8 | Rediseño estético y correcciones de UX/UI | Antigravity (Gemini) | "Quiero mejorar cómo se ve el estilo de la app, el login y catálogo se ven feos, y arreglar que al agregar productos no notifique y permita agregar sin límites de stock." | Rediseñamos la aplicación completa con una estética oscura premium, glassmorphism, notificaciones Toasts centradas, modal de vista rápida y validación estricta de stock en reducer/context. |

---

## 🔐 Seguridad

- Las credenciales de Firebase y AWS están en variables de entorno (`.env`) nunca commiteadas
- El archivo `.env` está en `.gitignore`
- Las imágenes se suben a S3 mediante presigned URLs — las credenciales de AWS nunca llegan al cliente
- Las rutas de admin están protegidas por `AdminGuard` que verifica el rol en Firestore

---

## 📁 Scripts disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run test     # Correr tests con Vitest
npm run preview  # Preview del build
```

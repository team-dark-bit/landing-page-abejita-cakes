# Especificación de backend: Abejita Cakes

> Contrato de API para reemplazar la persistencia mock/localStorage del panel admin.
> Se basa en lo que el código ya define (`lib/admin/types.ts`, `lib/admin/schemas.ts`, `lib/admin/repository.ts`, `lib/auth/*`), así que los nombres de campos y las validaciones coinciden con la UI actual.

## Índice

0. [Convenciones generales](#0-convenciones-generales)
1. [Lista de endpoints](#1-lista-de-endpoints)
2. [Detalle por endpoint](#2-detalle-por-endpoint)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Permisos](#4-permisos)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Plan de integración](#6-plan-de-integración)
7. [Decisiones pendientes](#7-decisiones-pendientes)

---

## 0. Convenciones generales

| Aspecto | Convención |
|---|---|
| Base URL | `/api/v1` (mismo origen si se usan Route Handlers de Next.js; si no, el valor de `NEXT_PUBLIC_API_BASE_URL`) |
| Formato | JSON, `Content-Type: application/json; charset=utf-8` (los uploads usan `multipart/form-data`) |
| Nombres | `camelCase` en la API y `snake_case` en la base de datos. El mapeo se hace en el repositorio |
| IDs | UUID v4 (`string`) |
| Fechas | ISO 8601 en UTC (`2026-10-22T15:04:05.000Z`) |
| Moneda | `priceFrom` es un número en soles (PEN) con 2 decimales. La API nunca envía el símbolo |
| Rutas públicas | `/api/v1/{recurso}`: solo lectura y solo registros activos o publicados |
| Rutas admin | `/api/v1/admin/{recurso}`: requieren sesión y devuelven todos los registros |

### Paginación, búsqueda y orden (todos los `GET` de listas en admin)

| Param | Tipo | Default | Regla |
|---|---|---|---|
| `page` | int | `1` | ≥ 1 |
| `pageSize` | int | `20` | 1–100 |
| `q` | string | — | 0–100 caracteres. Busca sin distinguir mayúsculas ni acentos (`unaccent ILIKE`) |
| `sort` | string | depende del recurso | `campo` asc, `-campo` desc. Solo se aceptan campos de una lista permitida |

**Envoltura de una lista**

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 20, "total": 37, "totalPages": 2 }
}
```

**Envoltura de un recurso individual**

```json
{ "data": {} }
```

### Estructura de error (única para toda la API)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos marcados.",
    "details": {
      "name": ["Mínimo 3 caracteres"],
      "priceFrom": ["El precio debe ser mayor a 0"]
    },
    "requestId": "req_01JBX4M8Q2"
  }
}
```

| HTTP | `code` | Cuándo |
|---|---|---|
| 400 | `BAD_REQUEST` | JSON mal formado o query param inválido |
| 401 | `UNAUTHENTICATED` | No hay sesión o expiró |
| 401 | `INVALID_CREDENTIALS` | Login fallido (mensaje genérico) |
| 403 | `FORBIDDEN` | Hay sesión pero el rol no tiene permiso, o el origen/CSRF no coincide |
| 404 | `NOT_FOUND` | El ID no existe |
| 409 | `CONFLICT` | Slug duplicado, o categoría con productos asociados |
| 413 | `PAYLOAD_TOO_LARGE` | La imagen supera 5 MB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | El archivo no es JPEG/PNG/WebP |
| 422 | `VALIDATION_ERROR` | Falla la validación del body (`details` por campo) |
| 429 | `RATE_LIMITED` | Demasiados intentos. Incluye el header `Retry-After` |
| 500 | `INTERNAL_ERROR` | Error inesperado. Nunca expone stack traces |

`details` usa las mismas claves y mensajes que los esquemas Zod del frontend, así que la UI puede mostrar el error en cada campo sin transformarlo.

---

## 1. Lista de endpoints

| Recurso | Método | Ruta | Acceso |
|---|---|---|---|
| **Auth** | POST | `/api/v1/auth/login` | Público (con rate limit) |
| | POST | `/api/v1/auth/logout` | Admin |
| | GET | `/api/v1/auth/session` | Admin |
| **Productos** | GET | `/api/v1/products` | Público |
| | GET | `/api/v1/products/{id}` | Público |
| | GET | `/api/v1/admin/products` | Admin |
| | GET | `/api/v1/admin/products/{id}` | Admin |
| | POST | `/api/v1/admin/products` | Admin |
| | PATCH | `/api/v1/admin/products/{id}` | Admin |
| | DELETE | `/api/v1/admin/products/{id}` | Admin |
| **Categorías** | GET | `/api/v1/categories` | Público |
| | GET | `/api/v1/admin/categories` | Admin |
| | GET | `/api/v1/admin/categories/{id}` | Admin |
| | POST | `/api/v1/admin/categories` | Admin |
| | PATCH | `/api/v1/admin/categories/{id}` | Admin |
| | DELETE | `/api/v1/admin/categories/{id}` | Admin |
| **Testimonios** | GET | `/api/v1/testimonials` | Público |
| | GET / POST | `/api/v1/admin/testimonials` | Admin |
| | GET / PATCH / DELETE | `/api/v1/admin/testimonials/{id}` | Admin |
| **FAQs** | GET | `/api/v1/faqs` | Público |
| | GET / POST | `/api/v1/admin/faqs` | Admin |
| | GET / PATCH / DELETE | `/api/v1/admin/faqs/{id}` | Admin |
| | PUT | `/api/v1/admin/faqs/order` | Admin |
| **Uploads** | POST | `/api/v1/admin/uploads` | Admin |
| | DELETE | `/api/v1/admin/uploads` | Admin |
| **Dashboard** | GET | `/api/v1/admin/stats` | Admin |

---

## 2. Detalle por endpoint

### 2.1 Auth admin

#### `POST /api/v1/auth/login`

**Body**

```json
{ "email": "admin@abejitacakes.pe", "password": "••••••••••" }
```

| Campo | Regla |
|---|---|
| `email` | Requerido, formato email, se normaliza a minúsculas, máximo 254 |
| `password` | Requerido, 1–128 caracteres |

**200 OK.** Además envía `Set-Cookie: abejita_admin_session=…; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`

```json
{
  "data": {
    "user": { "id": "5d1c…", "email": "admin@abejitacakes.pe", "name": "Rosa Quispe", "role": "owner" },
    "expiresAt": "2026-10-22T23:04:05.000Z"
  }
}
```

**Errores:** `401 INVALID_CREDENTIALS` (el mismo mensaje si falla el email o la contraseña), `422 VALIDATION_ERROR`, `429 RATE_LIMITED` (5 intentos cada 15 min por IP + email).

#### `POST /api/v1/auth/logout`

Sin body. **204 No Content**. Borra la cookie e invalida la sesión en el servidor.

#### `GET /api/v1/auth/session`

**200** `{ "data": { "user": { … }, "expiresAt": "…" } }` · **401** `UNAUTHENTICATED`

---

### 2.2 Productos

**Objeto `Product` (respuesta)**

```json
{
  "id": "3f6a2b1e-8c4d-4e9a-9b7f-1a2b3c4d5e6f",
  "name": "Torta Tres Leches",
  "categoryId": "c1a7…",
  "category": { "id": "c1a7…", "name": "Tortas clásicas", "slug": "tortas-clasicas" },
  "description": "Bizcocho húmedo bañado en tres leches con merengue italiano.",
  "size": "20 porciones",
  "priceFrom": 85.00,
  "image": "https://cdn.abejitacakes.pe/products/tres-leches-7f3a.webp",
  "featured": true,
  "active": true,
  "createdAt": "2026-09-01T14:00:00.000Z",
  "updatedAt": "2026-10-20T18:32:11.000Z"
}
```

#### `GET /api/v1/products` (público)

Devuelve solo productos con `active = true` cuya categoría también está activa. No pagina (el catálogo es chico); se cachea con el tag `products`.

| Query | Tipo | Descripción |
|---|---|---|
| `category` | slug | Filtra por el slug de la categoría |
| `featured` | `true` | Solo los destacados |

```json
{
  "data": [
    {
      "id": "…",
      "name": "Torta Tres Leches",
      "category": { "slug": "tortas-clasicas", "name": "Tortas clásicas" },
      "description": "…",
      "size": "20 porciones",
      "priceFrom": 85,
      "image": "…",
      "featured": true
    }
  ]
}
```

La vista pública **omite** `active`, `createdAt` y `updatedAt`.

#### `GET /api/v1/admin/products`

| Query | Tipo | Default | Descripción |
|---|---|---|---|
| `q` | string | — | Busca en `name` y `description` |
| `categoryId` | uuid | — | Filtro de categoría (el select de la tabla) |
| `status` | `active` \| `inactive` \| `all` | `all` | Filtro de estado |
| `featured` | `true` \| `false` | — | |
| `page`, `pageSize` | int | 1, 20 | |
| `sort` | `name`, `priceFrom`, `updatedAt`, `createdAt` | `-updatedAt` | |

Devuelve la envoltura de lista con objetos `Product` completos.

#### `POST /api/v1/admin/products`

```json
{
  "name": "Torta Selva Negra",
  "categoryId": "c1a7…",
  "description": "Bizcocho de chocolate, crema chantilly y cerezas al marrasquino.",
  "size": "15 porciones",
  "priceFrom": 95,
  "image": "https://cdn.abejitacakes.pe/products/selva-negra-91bc.webp",
  "featured": false,
  "active": true
}
```

**201 Created** + header `Location`, `{ "data": Product }`

#### `PATCH /api/v1/admin/products/{id}`

Body parcial: cualquier subconjunto de los campos. **200** `{ "data": Product }`. Si el producto no existe, `404`.

#### `DELETE /api/v1/admin/products/{id}`

**204**. Si la imagen está en el storage propio, se borra en segundo plano.

**Validaciones**

| Campo | Tipo | Req. | Regla |
|---|---|---|---|
| `name` | string | Sí | trim, 3–80 caracteres |
| `categoryId` | uuid | Sí | Debe existir. Si no existe, `422` en `categoryId` |
| `description` | string | Sí | trim, 10–240 caracteres |
| `size` | string | Sí | trim, 2–60 caracteres |
| `priceFrom` | number | Sí | > 0, ≤ 10000, máximo 2 decimales |
| `image` | string | Sí | Ruta `/images/...` o URL `https://` de un host permitido |
| `featured` | boolean | Sí | Default `false` |
| `active` | boolean | Sí | Default `true` |

---

### 2.3 Categorías

**Objeto `Category`**

```json
{
  "id": "c1a7…",
  "name": "Tortas clásicas",
  "slug": "tortas-clasicas",
  "description": "Nuestros sabores de siempre, para cualquier ocasión.",
  "active": true,
  "productCount": 6,
  "createdAt": "2026-09-01T14:00:00.000Z",
  "updatedAt": "2026-09-01T14:00:00.000Z"
}
```

| Endpoint | Notas |
|---|---|
| `GET /categories` | Solo las activas, ordenadas por `name`. Omite `productCount` y la auditoría |
| `GET /admin/categories` | `q` (busca en name/slug), `status`, `page`, `pageSize`, `sort` (`name`, `updatedAt`) |
| `POST /admin/categories` | Si el `slug` ya existe, `409 CONFLICT` con `details.slug` |
| `PATCH /admin/categories/{id}` | Parcial. Si se desactiva, sus productos dejan de verse en la landing |
| `DELETE /admin/categories/{id}` | Si tiene productos, `409 CONFLICT` ("Mueve o elimina sus 6 productos primero") |

**Body (POST)**

```json
{ "name": "Bocaditos salados", "slug": "bocaditos-salados", "description": "Empanaditas, tequeños y causitas.", "active": true }
```

| Campo | Req. | Regla |
|---|---|---|
| `name` | Sí | trim, 3–50 caracteres |
| `slug` | Sí | 2–50 caracteres, `^[a-z0-9]+(?:-[a-z0-9]+)*$`, único (sin distinguir mayúsculas) |
| `description` | No | trim, 0–160 caracteres, default `""` |
| `active` | Sí | boolean |

---

### 2.4 Testimonios

**Objeto `Testimonial`**

```json
{
  "id": "t9e2…",
  "name": "Lucía Pérez",
  "occasion": "Cumpleaños de mi hija",
  "rating": 5,
  "text": "La torta llegó perfecta y el sabor encantó a todos. ¡Ya estoy pidiendo la próxima!",
  "image": "https://cdn.abejitacakes.pe/testimonials/lucia-2b7c.webp",
  "published": true,
  "createdAt": "2026-10-02T12:00:00.000Z",
  "updatedAt": "2026-10-02T12:00:00.000Z"
}
```

| Endpoint | Notas |
|---|---|
| `GET /testimonials` | Solo `published = true`, orden `-createdAt`, `limit` (default 6, máximo 20) |
| `GET /admin/testimonials` | `q` (busca en name/occasion/text), `status` = `published` \| `draft` \| `all`, `rating` (1–5), paginación, `sort` (`createdAt`, `rating`, `name`) |
| `POST` / `PATCH` / `DELETE` | Igual que productos |

| Campo | Req. | Regla |
|---|---|---|
| `name` | Sí | trim, 3–60 caracteres |
| `occasion` | Sí | trim, 3–60 caracteres |
| `rating` | Sí | entero 1–5 |
| `text` | Sí | trim, 20–400 caracteres. Se guarda como texto plano (sin HTML) |
| `image` | No | `null` o una URL válida (la misma regla que en productos). Si es `null`, la UI muestra la inicial del nombre |
| `published` | Sí | boolean |

---

### 2.5 FAQs

**Objeto `Faq`**

```json
{
  "id": "f3b1…",
  "question": "¿Con cuánta anticipación debo hacer mi pedido?",
  "answer": "Recomendamos 3 días para tortas clásicas y 7 días para tortas temáticas o de boda.",
  "order": 1,
  "published": true,
  "createdAt": "2026-09-01T14:00:00.000Z",
  "updatedAt": "2026-09-15T09:10:00.000Z"
}
```

| Endpoint | Notas |
|---|---|
| `GET /faqs` | Solo las publicadas, orden `order` ascendente |
| `GET /admin/faqs` | `q` (busca en question/answer), `status` = `published` \| `draft` \| `all`, paginación, `sort` (default `order`) |
| `PUT /admin/faqs/order` | Reordenamiento masivo en una transacción |

**`PUT /admin/faqs/order`**

```json
{ "items": [ { "id": "f3b1…", "order": 1 }, { "id": "a8c2…", "order": 2 } ] }
```

**200** `{ "data": [Faq, …] }`. Si algún ID no existe, `422`.

| Campo | Req. | Regla |
|---|---|---|
| `question` | Sí | trim, 8–140 caracteres |
| `answer` | Sí | trim, 20–600 caracteres |
| `order` | Sí | entero 1–999. Puede repetirse; en caso de empate se ordena por `createdAt` |
| `published` | Sí | boolean |

---

### 2.6 Upload de imágenes

#### `POST /api/v1/admin/uploads`

`multipart/form-data`

| Campo | Req. | Regla |
|---|---|---|
| `file` | Sí | `image/jpeg`, `image/png` o `image/webp` (se verifican los magic bytes, no solo la extensión). Máximo 5 MB. Máximo 4000×4000 px |
| `folder` | Sí | `products` \| `testimonials` |

**201 Created**

```json
{
  "data": {
    "url": "https://cdn.abejitacakes.pe/products/torta-boda-4e1a9c.webp",
    "path": "products/torta-boda-4e1a9c.webp",
    "width": 1600,
    "height": 1200,
    "size": 284512,
    "contentType": "image/webp"
  }
}
```

El servidor renombra el archivo (`slug-hash.ext`) y elimina los metadatos EXIF. El `url` devuelto se guarda en `image`.

**Errores:** `413`, `415`, `422` (folder inválido), `401`.

#### `DELETE /api/v1/admin/uploads`

```json
{ "path": "products/torta-boda-4e1a9c.webp" }
```

**204**. Si la imagen la usa algún registro, `409`.

> Alternativa con Supabase o Firebase: `POST /admin/uploads/sign` devuelve una URL firmada y el navegador sube el archivo directo al bucket. Así las imágenes grandes no pasan por la función serverless.

---

### 2.7 Dashboard

#### `GET /api/v1/admin/stats`

```json
{
  "data": {
    "products": { "total": 14, "active": 12, "featured": 4 },
    "categories": { "total": 4, "active": 4 },
    "testimonials": { "total": 9, "published": 6 },
    "faqs": { "total": 7, "published": 7 }
  }
}
```

---

## 3. Modelo de datos

```text
categories 1 ──── N products
admin_users 1 ──── N (created_by / updated_by en todas las tablas)
testimonials, faqs: independientes
```

### `categories`

| Columna | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | uuid PK | Sí | `gen_random_uuid()` |
| `name` | varchar(50) | Sí | |
| `slug` | varchar(50) | Sí | `UNIQUE (lower(slug))` |
| `description` | varchar(160) | No | default `''` |
| `active` | boolean | Sí | default `true` |
| auditoría | — | — | ver abajo |

### `products`

| Columna | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | uuid PK | Sí | |
| `category_id` | uuid FK → `categories.id` | Sí | `ON DELETE RESTRICT` |
| `name` | varchar(80) | Sí | |
| `description` | varchar(240) | Sí | |
| `size` | varchar(60) | Sí | |
| `price_from` | numeric(10,2) | Sí | `CHECK (price_from > 0)` |
| `image_url` | text | Sí | |
| `image_path` | text | No | Clave en el storage, para poder borrarla |
| `featured` | boolean | Sí | default `false` |
| `active` | boolean | Sí | default `true` |
| Índices | | | `(category_id)`, `(active, featured)`, índice trigram en `name` |

### `testimonials`

| Columna | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | uuid PK | Sí | |
| `name` | varchar(60) | Sí | |
| `occasion` | varchar(60) | Sí | |
| `rating` | smallint | Sí | `CHECK (rating BETWEEN 1 AND 5)` |
| `text` | varchar(400) | Sí | |
| `image_url` | text | No | |
| `image_path` | text | No | |
| `published` | boolean | Sí | default `false` |

### `faqs`

| Columna | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | uuid PK | Sí | |
| `question` | varchar(140) | Sí | |
| `answer` | varchar(600) | Sí | |
| `sort_order` | smallint | Sí | `CHECK (sort_order BETWEEN 1 AND 999)`. Se expone como `order` |
| `published` | boolean | Sí | default `true` |

### `admin_users`

| Columna | Tipo | Req. | Notas |
|---|---|---|---|
| `id` | uuid PK | Sí | Con Supabase es `auth.users.id` |
| `email` | citext | Sí | `UNIQUE` |
| `name` | varchar(80) | Sí | |
| `role` | enum `owner` \| `editor` | Sí | |
| `password_hash` | text | Sí* | *Solo si la auth es propia (argon2id/bcrypt) |
| `last_login_at` | timestamptz | No | |

### Campos de auditoría (en todas las tablas de contenido)

| Columna | Tipo | Notas |
|---|---|---|
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | Lo actualiza un trigger `BEFORE UPDATE` |
| `created_by` | uuid FK → `admin_users` | nullable (los datos semilla no tienen autor) |
| `updated_by` | uuid FK → `admin_users` | nullable |

### Estados

| Recurso | Campo | Efecto en la landing |
|---|---|---|
| Producto | `active` | Si es `false`, no aparece |
| Producto | `featured` | Aparece primero o en la sección de destacados |
| Categoría | `active` | Si es `false`, se ocultan la categoría, su filtro y todos sus productos |
| Testimonio | `published` | Si es `false`, queda como borrador |
| FAQ | `published` | Si es `false`, queda como borrador |

Eliminar es **definitivo** (hard delete). Si más adelante quieres una papelera, se agrega `deleted_at timestamptz` y se filtra `deleted_at IS NULL`.

---

## 4. Permisos

| Recurso | Público (anónimo) | `editor` | `owner` |
|---|---|---|---|
| Productos | Leer activos | CRUD | CRUD |
| Categorías | Leer activas | Crear, editar | CRUD (incluye eliminar) |
| Testimonios | Leer publicados | CRUD | CRUD |
| FAQs | Leer publicadas | CRUD + reordenar | CRUD + reordenar |
| Uploads | — (las imágenes se sirven públicamente desde el CDN) | Subir, borrar | Subir, borrar |
| Stats | — | Leer | Leer |
| Admin users | — | — | Gestionar (fase futura) |

Reglas:

- Todas las rutas `/api/v1/admin/*` verifican la sesión **en el servidor** de cada handler. El `proxy.ts` solo redirige páginas; no reemplaza esa verificación.
- Las mutaciones validan el header `Origin`, y la cookie `SameSite=Lax` protege contra CSRF.
- Con Supabase, las políticas RLS son las equivalentes: `SELECT` anónimo con `active` o `published`, y escritura solo si `auth.uid()` está en `admin_users`.
- La `service_role key` nunca llega al navegador.

---

## 5. Variables de entorno

### Expuestas al navegador (`NEXT_PUBLIC_*`)

| Variable | Valor esperado | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio, sin `/` al final | `https://abejitacakes.pe` |
| `NEXT_PUBLIC_API_BASE_URL` | Base de la API. Vacía = mismo origen (`/api/v1`) | `https://api.abejitacakes.pe/v1` |
| `NEXT_PUBLIC_IMAGES_HOST` | Host del CDN de imágenes (para `next/image` y para validar URLs) | `cdn.abejitacakes.pe` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número en formato E.164 sin `+` (hoy está hardcodeado en `lib/whatsapp.ts`) | `51987654321` |
| `NEXT_PUBLIC_DATA_SOURCE` | `local` \| `api`. Elige qué repositorio usa el admin durante la migración | `api` |

### Solo servidor

| Variable | Valor esperado |
|---|---|
| `ADMIN_SESSION_SECRET` | Ya existe. Cadena aleatoria de ≥ 32 bytes (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Ya existen. Solo hasta migrar a la tabla `admin_users` |
| `DATABASE_URL` | Cadena Postgres (si usas Neon o Postgres propio) |

### Si eliges Supabase

| Variable | Expuesta | Valor |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | anon/publishable key (protegida por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Solo para tareas del servidor (seed, limpieza de storage) |
| `SUPABASE_STORAGE_BUCKET` | No | `abejita-images` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Sí | Ya está configurada en el proyecto. Es la URL de redirección de auth en el preview |

### Si eliges Firebase

| Variable | Expuesta |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Sí |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Sí |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Sí |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Sí |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Sí |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | **No** |
| `FIREBASE_ADMIN_PRIVATE_KEY` | **No** |

---

## 6. Plan de integración

### Fase 1: reemplazar mocks por lecturas reales

| Tarea | Impacto en el frontend |
|---|---|
| Crear las tablas, cargar los datos de `lib/admin/seed.ts` y activar RLS de lectura pública | — |
| Implementar los `GET` públicos | La landing deja de importar `lib/data.ts` y lee en el servidor (RSC) con `"use cache"` y tags `products` / `testimonials` / `faqs` |
| Implementar los `GET /admin/*` | Ampliar el contrato `Repository.list()` a `list(query) → { data, meta }` para que la búsqueda, los filtros y la paginación se hagan en el servidor |
| Crear `createApiRepository()` | Se elige con `NEXT_PUBLIC_DATA_SOURCE`. Las escrituras siguen yendo a localStorage |

**Criterio de salida:** la landing y las tablas del admin muestran datos reales, con los estados de loading y vacío funcionando.

### Fase 2: CRUD completo

| Tarea | Detalle |
|---|---|
| `POST` / `PATCH` / `DELETE` de los 4 recursos, más `PUT /faqs/order` | Validar con los **mismos esquemas Zod** de `lib/admin/schemas.ts`, compartidos entre cliente y servidor |
| Mapear `error.details` a los errores del formulario | `useZodForm` ya trabaja con mensajes por campo |
| Reglas de negocio | Slug único (`409`), categoría con productos (`409`), categoría inactiva oculta sus productos |
| Revalidación | Cada mutación llama `revalidateTag('products', 'max')`, etc., y la landing se actualiza |
| Migrar auth a `admin_users` | Contraseñas con hash y sesión invalidable. Se eliminan los fallbacks de desarrollo |

**Criterio de salida:** se elimina el repositorio de localStorage y el botón "Restablecer datos".

### Fase 3: upload de imágenes

| Tarea | Detalle |
|---|---|
| Crear el bucket y `POST/DELETE /admin/uploads` | Validar tipo y tamaño, renombrar, convertir a WebP |
| Componente de subida | Se reemplaza el input de URL de `ImageField` por dropzone + preview + progreso, manteniendo "pegar URL" como opción |
| Limpieza | Al reemplazar o eliminar la imagen de un registro, se borra el archivo anterior |
| `next.config` | `images.remotePatterns` con `NEXT_PUBLIC_IMAGES_HOST` |

### Fase 4: hardening

| Área | Acción |
|---|---|
| Seguridad | Rate limit en login y uploads (Upstash), headers (`X-Frame-Options: SAMEORIGIN` en `/admin`, HSTS, CSP enforcing), verificación de `Origin` |
| Validación | Límites de tamaño del body (1 MB en JSON), sanitizar texto plano, lista blanca de `sort` |
| Errores | `requestId` en todas las respuestas, logs estructurados, Sentry, mensajes en español sin datos internos |
| Datos | Backups diarios, migraciones versionadas, tabla `audit_log` (quién cambió qué) |
| Calidad | Tests de contrato de cada endpoint contra esta especificación (OpenAPI generado desde Zod con `zod-openapi`) |

---

## 7. Decisiones pendientes

1. **Proveedor:** con Supabase obtienes auth, base de datos, storage y RLS en un solo servicio, así que encaja mejor con este plan. Con Firebase cambian las secciones 3 y 5.
2. **Roles:** ¿bastan `owner` y `editor`, o habrá un solo administrador?
3. **Imagen en testimonios:** confirmar que el campo `image` opcional vuelve al formulario.

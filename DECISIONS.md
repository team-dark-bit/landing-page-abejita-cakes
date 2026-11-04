# Decisiones técnicas — Abejita Cakes (landing)

Registro breve de decisiones de arquitectura. Cada entrada responde: contexto →
decisión → alternativas → consecuencia → cuándo revisarla.

No documentar aquí detalles de funcionalidades ni el mapeo de datos: esta landing
está migrando de data mock a servicios reales y ese detalle ya se conoce por el código.

---

## D-001 · Landing en Next.js App Router con Server Components por defecto

**Fecha:** 2026-11

**Contexto:** landing pública con necesidades de SEO y pocas zonas realmente
interactivas (acordeón de FAQ, menú, botón flotante de WhatsApp).

**Decisión:** usar Server Components por defecto; `'use client'` solo en componentes
con interacción o estado real.

**Alternativas:** SPA con Vite/CRA (peor SEO y más JS inicial); renderizar todo del
lado cliente dentro de Next (pierde el beneficio del framework).

**Consecuencia:** el HTML llega con contenido real desde el primer byte y se envía
menos JavaScript al navegador.

---

## D-002 · Consumo de la API desde el servidor, no desde el navegador

**Fecha:** 2026-11

**Contexto:** `API_URL` es una variable de servidor (sin prefijo `NEXT_PUBLIC_`) y el
endpoint público de FAQs no requiere token.

**Decisión:** el fetch vive en el servidor (`app/page.tsx` → `lib/api/faqs.ts`) y la
data baja al componente como prop.

**Alternativas:** SWR/fetch en cliente (obligaría a exponer la URL y a resolver CORS);
API route propia en Next como proxy (una capa extra sin beneficio actual).

**Consecuencia:** sin CORS, la URL del backend no se expone y el SEO mejora.

**Efecto secundario aceptado:** las llamadas al API no aparecen en DevTools → Network,
porque no las hace el navegador sino el servidor.

---

## D-003 · Sin caché por ahora (decisión explícita, no por omisión)

**Fecha:** 2026-11

**Contexto:** durante el desarrollo, el ISR de 5 minutos (`revalidate: 300`) servía
datos viejos y volvía confusas las pruebas. El tráfico actual es bajo.

**Decisión:** `cache: 'no-store'` en el fetch y `export const dynamic = 'force-dynamic'`
en la página. Cada visita consulta la API.

**Alternativas consideradas:** ISR de 300 s (descartado por el motivo anterior);
ISR corto tipo 60 s (sigue sirviendo datos stale al primer visitante tras expirar).

**Consecuencia:** datos siempre frescos; a cambio, una request al backend por visita y
exposición a los cold starts de Render.

**Cuándo revisar:** si el tráfico crece, si aparecen límites de rate o si los cold
starts afectan la experiencia.

**Plan previsto:** volver a ISR con `next: { revalidate: N, tags: ['faqs'] }` más un
endpoint `POST /api/revalidate` protegido por secret, invocado por el backend en cada
escritura. Así el cambio se refleja de inmediato sin depender del TTL.

---

## D-004 · Tolerancia a fallos del backend

**Fecha:** 2026-11

**Contexto:** la API corre en Render, con cold starts y disponibilidad variable.

**Decisión:** timeout de 30 s en el fetch; si la llamada falla, se registra el error y
la sección de FAQs muestra un mensaje con CTA a WhatsApp. El build no depende de la API.

**Alternativas:** dejar que el error rompa el render (mala UX y builds frágiles).

**Consecuencia:** la landing nunca se cae por el backend; el fallo es visible pero no
bloqueante.

---

## D-005 · Data mock retirada de las FAQs

**Fecha:** 2026-11

**Contexto:** las FAQs del sitio público pasaron de `lib/data.ts` a la API real, y luego
también el panel admin.

**Decisión:** se eliminó el array mock de FAQs (`lib/data.ts`) y después el seed de FAQs
(`lib/admin/seed.ts`), al migrar `/admin/faqs` a la API.

**Consecuencia:** una sola fuente de verdad para las FAQs: la API.

**Cuándo revisar:** ya aplicado; no queda deuda pendiente en este punto.

---

## D-006 · Panel admin desacoplado por la interfaz `Repository`

**Fecha:** 2026-11

**Contexto:** el admin persiste productos, categorías y testimonios en `localStorage`,
pero el destino es el backend real.

**Decisión:** la UI consume la interfaz `Repository` (`lib/admin/repository.ts`); cambiar
la implementación no requiere tocar componentes. `reset()` es opcional, para que los
repositorios respaldados por API no expongan una restauración local inexistente.

**Consecuencia:** migrar los recursos restantes es reemplazar las instancias en
`lib/admin/repositories.ts`. Las FAQs ya usan API y no implementan `reset`.

---

## D-007 · Proxy server-side para las escrituras del admin

**Fecha:** 2026-11

**Contexto:** los endpoints `/api/v1/admin/**` exigen un access token de Supabase, y el
panel es interactivo (Client Components con SWR).

**Decisión:** el navegador llama a rutas propias (`/api/admin/faqs`, `/api/admin/faqs/[id]`)
y un handler común (`lib/api/admin-proxy.ts`) lee la sesión de Supabase, adjunta
`Authorization: Bearer …` y reenvía al backend.

**Alternativas:** llamar al backend directo desde el cliente (expondría la URL y el token
a JavaScript, y requeriría CORS); Server Actions (acoplaría el CRUD al formulario, sin
reutilizar la interfaz `Repository`).

**Consecuencia:** el token nunca llega al navegador; las llamadas visibles en DevTools son
al propio origen y no llevan `Authorization`. Los errores del backend se normalizan a
`{ error: { code, message, details } }`.

---

## Pendientes vinculados a decisiones

- **D-003:** definir el umbral de tráfico o de cold starts que justifique reintroducir caché.
- **D-003:** implementar el tag `faqs` y el endpoint de revalidación cuando se retome.
- **D-006:** migrar productos, categorías y testimonios a la API; luego retirar
  `lib/admin/seed.ts` y `createLocalStorageRepository`, que quedarían sin uso.
- **FAQs:** implementar `PUT /api/v1/admin/faqs/order` si se agrega reordenamiento en la UI.
- **Higiene:** `docs/` está en `.gitignore`; decidir si la documentación auxiliar debe versionarse.
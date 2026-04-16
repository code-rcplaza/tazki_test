# Tazki — Prueba Técnica Frontend

## ¿Dónde revisar la pantalla?

```bash
npm install
npm run dev
```

Navegar a `http://localhost:5173/requests`

---

## Solución

### Stack utilizado

React 18 · Vite · TypeScript (strict) · Material UI · React Query v5 · i18next · Moment · Vitest · React Testing Library

### Estructura

```
src/
├── api/
│   ├── requests.types.ts        # Tipos de dominio (Request, Status, RequestFilters)
│   ├── requests.api.ts          # API simulada con localStorage + pipe + filtros curried
│   └── RequestsApiContext.tsx   # Contrato DI + Provider + hook de consumo
├── features/requests/
│   ├── components/
│   │   ├── StatusChip.tsx       # Chip reutilizable status → color/label
│   │   ├── RequestsFilters.tsx  # Filtro por estado + búsqueda con debounce
│   │   └── RequestsTable.tsx    # Tabla con estados loading / error / vacío / datos
│   ├── helpers/
│   │   └── statusConfig.ts      # Mapeo puro status → color/label (testeable sin DOM)
│   ├── hooks/
│   │   └── useRequests.ts       # React Query wiring — useGetRequests + useUpdateRequestStatus
│   ├── locales/
│   │   ├── es.json
│   │   └── en.json
│   ├── RequestsPage.tsx         # Composición y estado local — sin lógica de negocio
│   └── index.ts                 # Barrel export
├── i18n/index.ts
├── router/index.tsx
├── App.tsx                      # Providers — único lugar que conoce la implementación concreta
└── main.jsx
```

### Decisiones técnicas destacadas

**Programación funcional + TypeScript strict**
Datos inmutables con `readonly`. Sin mutación directa — `updateRequestStatus` usa `map` en lugar de asignación por índice. Un `pipe` propio de 3 líneas (sin librerías extra) compone los filtros del API.

**Filtros curried**
`filterByStatus` y `filterBySearch` son funciones puras curried que se componen con `pipe`. Agregar un nuevo filtro = agregar una función, sin tocar las existentes (Open/Closed).

**Dependency Inversion via Context**
Los hooks consumen `useRequestsApi()` — nunca importan la implementación directamente. `App.tsx` es el único lugar que ensambla la implementación concreta. Para swappear por una API real con Axios: cambiar solo `requests.api.ts` y el prop `api` en `App.tsx`.

**Optimistic updates con rollback**
`useMutation` captura todos los buckets del cache con `getQueriesData` (plural) antes de mutar — cubre el caso donde el usuario cambia filtro mientras una mutación está en vuelo. `onError` hace rollback completo. `onSettled` invalida y refetch.

**Persistencia en localStorage**
La capa API es la única que conoce `localStorage`. React Query no sabe que existe storage — solo llama `getRequests()`. Los datos persisten entre recargas.

### Bonus implementados

- ✅ `StatusChip` — componente reutilizable con color por estado
- ✅ `statusConfig.ts` — helper puro testeable sin DOM
- ✅ Tests unitarios para helpers, lógica de API y hooks (29 tests en 3 archivos)
- ✅ Optimistic updates con React Query
- ✅ Persistencia en localStorage

---

## Resultados

### `npm test`

```BASH
Test Files  3 passed (3)
Tests       29 passed (29)
```

### `npm run lint`

```BASH
0 errors · 0 warnings
```

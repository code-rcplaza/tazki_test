import type { Request, RequestFilters, Status } from './requests.types';

// ---------------------------------------------------------------------------
// Pipe utility — compone funciones de izquierda a derecha
// ---------------------------------------------------------------------------
const pipe =
  <T>(...fns: ReadonlyArray<(x: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'tazki_requests';

const SEED_DATA: ReadonlyArray<Request> = [
  { id: '1', title: 'Actualizar documentación',    requester: 'María Pérez',    status: 'pending',  created_at: '2026-04-01T09:00:00Z' },
  { id: '2', title: 'Revisar acceso a sistema',    requester: 'Juan Soto',      status: 'approved', created_at: '2026-04-03T11:30:00Z' },
  { id: '3', title: 'Corregir información personal', requester: 'Ana Torres',   status: 'rejected', created_at: '2026-04-05T14:00:00Z' },
  { id: '4', title: 'Solicitar vacaciones',         requester: 'Carlos López',  status: 'pending',  created_at: '2026-04-06T08:00:00Z' },
  { id: '5', title: 'Actualizar datos bancarios',   requester: 'Laura Gómez',   status: 'pending',  created_at: '2026-04-07T10:00:00Z' },
  { id: '6', title: 'Cambio de jornada laboral',    requester: 'Pedro Martínez', status: 'approved', created_at: '2026-04-08T09:00:00Z' },
  { id: '7', title: 'Solicitar equipo de trabajo',  requester: 'Sofía Rodríguez', status: 'pending', created_at: '2026-04-09T12:00:00Z' },
  { id: '8', title: 'Revisión de contrato',         requester: 'Diego Fernández', status: 'rejected', created_at: '2026-04-10T15:00:00Z' },
];

const getStoredData = (): Request[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Request[];
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  return [...SEED_DATA];
};

const saveData = (data: Request[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ---------------------------------------------------------------------------
// Filtros — funciones puras y curried, se componen con pipe
// ---------------------------------------------------------------------------
const filterByStatus =
  (status: Status | 'all' | undefined) =>
  (requests: Request[]): Request[] =>
    status && status !== 'all'
      ? requests.filter((r) => r.status === status)
      : requests;

const filterBySearch =
  (search: string | undefined) =>
  (requests: Request[]): Request[] => {
    const term = search?.trim().toLowerCase();
    return term
      ? requests.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.requester.toLowerCase().includes(term)
        )
      : requests;
  };

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------
const FINAL_STATUSES: ReadonlyArray<Status> = ['approved', 'rejected'];

// Dev helper — activar desde consola: localStorage.setItem('tazki_simulate_error', '1')
const shouldSimulateError = () => localStorage.getItem('tazki_simulate_error') === '1';

export const getRequests = ({ status, search }: RequestFilters = {}): Promise<Request[]> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateError()) return reject(new Error('Simulated network error'));

      try {
        const data = pipe<Request[]>(
          filterByStatus(status),
          filterBySearch(search)
        )(getStoredData());

        resolve(data);
      } catch (err) {
        reject(err);
      }
    }, 600);
  });

export const updateRequestStatus = (id: string, newStatus: Status): Promise<Request> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = getStoredData();
        const index = data.findIndex((r) => r.id === id);

        if (index === -1) {
          return reject(new Error(`Request ${id} not found`));
        }

        if (FINAL_STATUSES.includes(data[index].status)) {
          return reject(new Error(`Request ${id} is already in a final state`));
        }

        const updated: Request = { ...data[index], status: newStatus };
        const newData = data.map((r) => (r.id === id ? updated : r));
        saveData(newData);
        resolve(updated);
      } catch (err) {
        reject(err);
      }
    }, 400);
  });

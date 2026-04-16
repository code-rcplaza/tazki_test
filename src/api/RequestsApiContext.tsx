import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Request, RequestFilters, Status } from './requests.types';

// ---------------------------------------------------------------------------
// Contrato — cualquier implementación debe cumplir este tipo
// ---------------------------------------------------------------------------
export type RequestsApi = {
  readonly getRequests: (filters: RequestFilters) => Promise<Request[]>;
  readonly updateRequestStatus: (id: string, newStatus: Status) => Promise<Request>;
};

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------
const RequestsApiContext = createContext<RequestsApi | null>(null);

// ---------------------------------------------------------------------------
// Provider — recibe la implementación concreta como prop
// ---------------------------------------------------------------------------
type RequestsApiProviderProps = {
  readonly api: RequestsApi;
  readonly children: ReactNode;
};

export const RequestsApiProvider = ({ api, children }: RequestsApiProviderProps) => (
  <RequestsApiContext.Provider value={api}>{children}</RequestsApiContext.Provider>
);

// ---------------------------------------------------------------------------
// Hook de consumo — lanza si se usa fuera del provider
// ---------------------------------------------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useRequestsApi = (): RequestsApi => {
  const ctx = useContext(RequestsApiContext);
  if (!ctx) throw new Error('useRequestsApi must be used within a RequestsApiProvider');
  return ctx;
};

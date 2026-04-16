import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { RequestsApiProvider } from '../../../api/RequestsApiContext';
import type { RequestsApi } from '../../../api/RequestsApiContext';
import { useGetRequests, useUpdateRequestStatus } from './useRequests';
import type { Request } from '../../../api/requests.types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_REQUESTS: Request[] = [
  { id: '1', title: 'Actualizar documentación', requester: 'María Pérez', status: 'pending', created_at: '2026-04-01T09:00:00Z' },
  { id: '2', title: 'Revisar acceso', requester: 'Juan Soto', status: 'approved', created_at: '2026-04-03T11:00:00Z' },
];

// ---------------------------------------------------------------------------
// Wrapper — inyecta QueryClient + ApiContext con mock
// ---------------------------------------------------------------------------
const createWrapper = (api: RequestsApi) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RequestsApiProvider api={api}>
        {children}
      </RequestsApiProvider>
    </QueryClientProvider>
  );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useGetRequests', () => {
  let mockApi: RequestsApi;

  beforeEach(() => {
    mockApi = {
      getRequests: vi.fn().mockResolvedValue(MOCK_REQUESTS),
      updateRequestStatus: vi.fn(),
    };
  });

  it('llama a getRequests con los filtros correctos', async () => {
    const { result } = renderHook(
      () => useGetRequests({ status: 'pending', search: 'docs' }),
      { wrapper: createWrapper(mockApi) }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApi.getRequests).toHaveBeenCalledWith({ status: 'pending', search: 'docs' });
  });

  it('retorna los datos del API', async () => {
    const { result } = renderHook(
      () => useGetRequests({}),
      { wrapper: createWrapper(mockApi) }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(MOCK_REQUESTS);
  });

  it('expone isError cuando el API falla', async () => {
    mockApi.getRequests = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(
      () => useGetRequests({}),
      { wrapper: createWrapper(mockApi) }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateRequestStatus', () => {
  let mockApi: RequestsApi;

  beforeEach(() => {
    mockApi = {
      getRequests: vi.fn().mockResolvedValue(MOCK_REQUESTS),
      updateRequestStatus: vi.fn().mockResolvedValue({ ...MOCK_REQUESTS[0], status: 'approved' }),
    };
  });

  it('llama a updateRequestStatus con id y newStatus correctos', async () => {
    const { result } = renderHook(
      () => useUpdateRequestStatus(),
      { wrapper: createWrapper(mockApi) }
    );

    result.current.mutate({ id: '1', newStatus: 'approved' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApi.updateRequestStatus).toHaveBeenCalledWith('1', 'approved');
  });

  it('expone isError cuando la mutación falla', async () => {
    mockApi.updateRequestStatus = vi.fn().mockRejectedValue(new Error('Final state'));

    const { result } = renderHook(
      () => useUpdateRequestStatus(),
      { wrapper: createWrapper(mockApi) }
    );

    result.current.mutate({ id: '2', newStatus: 'rejected' });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestsApi } from '../../../api/RequestsApiContext';
import type { RequestFilters, Status } from '../../../api/requests.types';

const REQUESTS_KEY = 'requests' as const;

export const useGetRequests = ({ status, search }: RequestFilters) => {
  const { getRequests } = useRequestsApi();

  return useQuery({
    queryKey: [REQUESTS_KEY, { status, search }],
    queryFn: () => getRequests({ status, search }),
    staleTime: 30_000,
  });
};

export const useUpdateRequestStatus = () => {
  const { updateRequestStatus } = useRequestsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: Status }) =>
      updateRequestStatus(id, newStatus),

    onMutate: async ({ id, newStatus }) => {
      // Cancela cualquier refetch en vuelo para que no pise el update optimista
      await queryClient.cancelQueries({ queryKey: [REQUESTS_KEY] });

      // Captura el estado actual de TODOS los buckets de cache (por filtro)
      const previousData = queryClient.getQueriesData({ queryKey: [REQUESTS_KEY] });

      // Actualiza el cache optimistamente antes de que responda el API
      queryClient.setQueriesData({ queryKey: [REQUESTS_KEY] }, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Rollback — restaura todos los buckets al estado previo
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      // Invalida el cache para que React Query haga un refetch real desde el API
      queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
    },
  });
};

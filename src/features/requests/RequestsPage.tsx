import { useState, useCallback } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Status } from '../../api/requests.types';
import { useGetRequests, useUpdateRequestStatus } from './hooks/useRequests';
import RequestsFilters from './components/RequestsFilters';
import RequestsTable from './components/RequestsTable';

type StatusOption = Status | 'all';

export default function RequestsPage() {
  const { t } = useTranslation('requests');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusOption>('all');

  const { data, isLoading, isError, refetch } = useGetRequests({ status: statusFilter, search });
  const { mutate: updateStatus } = useUpdateRequestStatus();

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: Status) => updateStatus({ id, newStatus }),
    [updateStatus]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t('title')}
        </Typography>
      </Box>
      <RequestsFilters
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <RequestsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onUpdateStatus={handleUpdateStatus}
        onRetry={refetch}
      />
    </Container>
  );
}

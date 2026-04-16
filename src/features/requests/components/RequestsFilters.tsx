import { useState, useEffect } from 'react';
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Status } from '../../../api/requests.types';

type StatusOption = Status | 'all';

const STATUS_OPTIONS: ReadonlyArray<StatusOption> = ['all', 'pending', 'approved', 'rejected'];

type Props = {
  readonly onSearchChange: (value: string) => void;
  readonly statusFilter: StatusOption;
  readonly onStatusFilterChange: (value: StatusOption) => void;
};

export default function RequestsFilters({ onSearchChange, statusFilter, onStatusFilterChange }: Props) {
  const { t } = useTranslation('requests');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const handleStatusChange = (e: SelectChangeEvent) =>
    onStatusFilterChange(e.target.value as StatusOption);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        label={t('search.placeholder')}
        variant="outlined"
        size="small"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        sx={{ minWidth: 280 }}
      />
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>{t('filter.label')}</InputLabel>
        <Select value={statusFilter} label={t('filter.label')} onChange={handleStatusChange}>
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt === 'all' ? t('filter.all') : t(`status.${opt}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, Alert, Box, LinearProgress, Tooltip, Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import type { Request, Status } from '../../../api/requests.types';
import StatusChip from './StatusChip';
import { isFinalStatus } from '../helpers/statusConfig';

type Props = {
  readonly data: Request[] | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly onUpdateStatus: (id: string, newStatus: Status) => void;
  readonly onRetry: () => void;
};

export default function RequestsTable({ data, isLoading, isError, onUpdateStatus, onRetry }: Props) {
  const { t } = useTranslation('requests');

  if (isLoading && !data?.length) {
    return (
      <Box sx={{ mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('states.loading')}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" size="small" onClick={onRetry}>{t('states.retry')}</Button>}
        sx={{ mt: 2 }}
      >
        {t('states.error')}
      </Alert>
    );
  }

  if (!data?.length) {
    return <Alert severity="info" sx={{ mt: 2 }}>{t('states.empty')}</Alert>;
  }

  return (
    <Box>
      {isLoading && <LinearProgress sx={{ mb: 1 }} />}
      <TableContainer component={Paper} elevation={2}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{t('table.id')}</TableCell>
              <TableCell>{t('table.title')}</TableCell>
              <TableCell>{t('table.requester')}</TableCell>
              <TableCell>{t('table.status')}</TableCell>
              <TableCell>{t('table.created_at')}</TableCell>
              <TableCell align="center" sx={{ minWidth: 180 }}>{t('table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.requester}</TableCell>
                <TableCell><StatusChip status={row.status} /></TableCell>
                <TableCell>{moment(row.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                <TableCell align="center">
                  <Box sx={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isFinalStatus(row.status) ? (
                      <Tooltip title={t('actions.final')}>
                        <span><CheckCircleOutlineIcon color="disabled" fontSize="small" /></span>
                      </Tooltip>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="contained" color="success"
                          onClick={() => onUpdateStatus(row.id, 'approved')}>
                          {t('actions.approve')}
                        </Button>
                        <Button size="small" variant="contained" color="error"
                          onClick={() => onUpdateStatus(row.id, 'rejected')}>
                          {t('actions.reject')}
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

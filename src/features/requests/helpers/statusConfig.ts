import type { Status } from '../../../api/requests.types';

type StatusConfig = {
  readonly labelKey: string;
  readonly color: 'warning' | 'success' | 'error' | 'default';
};

const STATUS_CONFIG: Readonly<Record<Status, StatusConfig>> = {
  pending:  { labelKey: 'requests:status.pending',  color: 'warning' },
  approved: { labelKey: 'requests:status.approved', color: 'success' },
  rejected: { labelKey: 'requests:status.rejected', color: 'error'   },
};

const FALLBACK_CONFIG: StatusConfig = { labelKey: 'requests:status.unknown', color: 'default' };

export const getStatusConfig = (status: string | undefined): StatusConfig =>
  (status && status in STATUS_CONFIG)
    ? STATUS_CONFIG[status as Status]
    : FALLBACK_CONFIG;

export const FINAL_STATUSES: ReadonlyArray<Status> = ['approved', 'rejected'];

export const isFinalStatus = (status: string | undefined): boolean =>
  FINAL_STATUSES.includes(status as Status);

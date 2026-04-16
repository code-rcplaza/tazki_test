export type Status = 'pending' | 'approved' | 'rejected';

export type Request = {
  readonly id: string;
  readonly title: string;
  readonly requester: string;
  readonly status: Status;
  readonly created_at: string;
};

export type RequestFilters = {
  readonly status?: Status | 'all';
  readonly search?: string;
};

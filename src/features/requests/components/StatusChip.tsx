import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getStatusConfig } from '../helpers/statusConfig';

type Props = {
  readonly status: string;
};

export default function StatusChip({ status }: Props) {
  const { t } = useTranslation('requests');
  const { color, labelKey } = getStatusConfig(status);

  return <Chip label={t(labelKey)} color={color} size="small" />;
}

import { format } from 'date-fns';

export const formatTs = (ts: number) => {
  return format(new Date(ts), 'yyyy.MM.dd. H:mm:ss');
};

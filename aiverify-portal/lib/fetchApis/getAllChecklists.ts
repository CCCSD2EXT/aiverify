import { Checklist } from '@/app/inputs/utils/types';

export async function getChecklists(): Promise<Checklist[]> {
  const res = await fetch(`http://127.0.0.1:4000/input_block_data/`, {
    //extract to /lib/fetchapis/
    cache: 'no-store', //might no need this
  });

  if (!res.ok) {
    throw new Error('Failed to fetch inputs');
  }

  return res.json();
}

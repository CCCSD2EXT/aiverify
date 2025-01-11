import { useQuery } from '@tanstack/react-query';
import { Checklist } from '../../utils/types';

// Fetch function
const fetchChecklistById = async (id: string): Promise<Checklist> => {
  const response = await fetch(`/api/input_block_data/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch checklist');
  }
  return response.json();
};

// Custom hook using Tanstack Query
export const useChecklist = (id: string) => {
  return useQuery({
    queryKey: ['checklist', id],
    queryFn: () => fetchChecklistById(id),
  });
};

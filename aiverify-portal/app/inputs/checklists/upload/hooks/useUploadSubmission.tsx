import { useState } from 'react';
import { Checklist } from '@/app/inputs/utils/types';

export function useChecklistSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitChecklist = async (checklist: Checklist) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('api/input_block_data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checklist),
      });

      if (!response.ok) {
        throw new Error('Failed to submit checklist');
      }

      return await response.json();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit checklist'
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitChecklist, isSubmitting, error };
}

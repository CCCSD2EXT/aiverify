import { useQueries } from '@tanstack/react-query';
import { Checklist } from '@/app/inputs/utils/types';

const fetchChecklistConfig = async (gid: string, cid: string) => {
  try {
    const response = await fetch(`/api/plugins/${gid}/bundle/${cid}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch checklist config for ${gid}/${cid}`);
    }

    const bundle = await response.json();

    // Include React in the context
    const reactRuntime = `const React = require('react');`;

    // Create a function that wraps the bundle code and returns the component
    const getComponent = new Function(`
      ${bundle.code} 
      return React.createElement(Component);
    `);

    // Execute the function to get the component and extract config
    const component = getComponent();
    return component.default.config;
  } catch (error) {
    console.error(`Error fetching checklist config for ${gid}/${cid}:`, error);
    return null;
  }
};

export function useChecklistConfigs(checklists: Checklist[]) {
  const queries = useQueries({
    queries: checklists.map((checklist) => ({
      queryKey: ['checklistConfig', checklist.gid, checklist.cid],
      queryFn: () => fetchChecklistConfig(checklist.gid, checklist.cid),
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: false,
      enabled: Boolean(checklist.gid && checklist.cid),
    })),
  });

  const configMap = checklists.reduce(
    (acc, checklist, index) => {
      const query = queries[index];
      if (query.data) {
        acc[checklist.id] = query.data;
      }
      return acc;
    },
    {} as Record<number, any>
  );

  return {
    configs: configMap,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    errors: queries.filter((query) => query.error).map((query) => query.error),
  };
}

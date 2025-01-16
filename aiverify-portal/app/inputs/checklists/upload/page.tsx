'use client';
import React from 'react';
import { ChecklistsProvider } from '@/app/inputs/checklists/upload/context/ChecklistsContext';
import GroupDetail from './components/GroupDetail';
import ProgressBar from './components/ProgressSidebar';
import { GroupNameInput } from './components/GroupNameInput';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplitPane from './components/SplitPane';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ChecklistsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChecklistsProvider>
        <div className="h-[calc(100vh-200px)] p-4">
          <GroupNameInput />
          <div className="scrollbar-hidden h-full overflow-y-auto rounded bg-secondary-950">
            <SplitPane
              leftPane={<ProgressBar />}
              rightPane={<GroupDetail />}
            />
          </div>
          {/* Save Button at the Bottom */}
          <div className="mt-4 flex justify-end">
            <button className="rounded bg-primary-700 px-4 py-2 text-white hover:bg-primary-600">
              Save All Changes
            </button>
          </div>
        </div>
      </ChecklistsProvider>
    </QueryClientProvider>
  );
}

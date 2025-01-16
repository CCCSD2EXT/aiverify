'use client';

import { Suspense, useMemo, useState } from 'react';
import GroupDetail from './components/GroupDetail';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';
import { usePathname } from 'next/navigation';
import { Icon, IconName } from '@/lib/components/IconSVG';
import ActionButtons from '../components/ActionButtons';
import Link from 'next/link';
import { ChevronLeftIcon } from '@/app/inputs/utils/icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplitPane from './components/SplitPane';
import ProgressBar from './components/ProgressSidebar';
import GroupHeader from './components/GroupNameHeader';
import ChecklistsFilters from '../../components/FilterButtons';
import Fuse from 'fuse.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function GroupDetailPage() {
  const { selectedGroup, checklists } = useChecklists();
  const pathname = usePathname();

  // Get group ID from URL
  const groupIdFromURL = useMemo(() => {
    const urlParams = new URLSearchParams(pathname.split('?')[1]);
    return urlParams.get('groupId');
  }, [pathname]);

  const groupName = selectedGroup ?? decodeURIComponent(groupIdFromURL ?? '');

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Initialize Fuse search
  const fuse = useMemo(() => {
    const options = {
      keys: ['name'],
      includeScore: true,
      threshold: 0.5,
    };
    return new Fuse(checklists, options);
  }, [checklists]);

  // Filter and sort checklists
  const filteredChecklists = useMemo(() => {
    // First, filter by search query
    let filtered = searchQuery
      ? fuse.search(searchQuery).map((result) => result.item)
      : checklists;

    // Then sort the results
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        case 'date-desc':
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [checklists, searchQuery, sortBy, fuse]);

  // Handler functions
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (newSortBy: string) => setSortBy(newSortBy);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        {groupName ? (
          <div className="h-[calc(100vh-200px)] p-6">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center">
                <Icon
                  name={IconName.File}
                  size={40}
                  color="#FFFFFF"
                />
                <div className="ml-3">
                  <div className="flex">
                    <Link href="/inputs/">
                      <h1 className="text-2xl font-bold text-white hover:underline">
                        User Inputs
                      </h1>
                    </Link>
                    <ChevronLeftIcon
                      size={28}
                      color="#FFFFFF"
                    />
                    <Link href="/inputs/checklists">
                      <h1 className="text-2xl font-bold text-white hover:underline">
                        AI Verify Process Checklists
                      </h1>
                    </Link>
                    <ChevronLeftIcon
                      size={28}
                      color="#FFFFFF"
                    />
                    <h1 className="text-2xl font-bold text-white hover:underline">
                      {groupName}
                    </h1>
                  </div>
                  <h3 className="text-white">
                    Manage and view AI Verify Process Checklists
                  </h3>
                </div>
              </div>
              <ActionButtons />
            </div>
            <div className="scrollbar-hidden mt-6 h-full overflow-y-auto rounded bg-secondary-950">
              <GroupHeader groupName={groupName} />
              <SplitPane
                leftPane={<ProgressBar groupName={groupName} />}
                rightPane={
                  <div className="flex h-full flex-col">
                    <ChecklistsFilters
                      onSearch={handleSearch}
                      onSort={handleSort}
                    />
                    <GroupDetail
                      groupChecklists={filteredChecklists}
                      groupName={groupName}
                    />
                  </div>
                }
              />
            </div>
          </div>
        ) : (
          <div>No group selected.</div>
        )}
      </Suspense>
    </QueryClientProvider>
  );
}

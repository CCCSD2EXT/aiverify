// /app/inputs/checklists/components/GroupList.tsx
'use client';
import React, { useMemo } from 'react';
import { Card } from '@/lib/components/card/card';
import { Checklist, GroupedChecklists } from '@/app/inputs/utils/types';
import ChecklistsFilters from '../../components/FilterButtons';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';

type GroupListProps = {
  checklists: Checklist[];
};

const GroupList: React.FC<GroupListProps> = ({ checklists }) => {
  const { setChecklists, setSelectedGroup } = useChecklists();
  const router = useRouter();

  const fuse = useMemo(() => {
    const options = {
      keys: ['group'],
      includeScore: true,
      threshold: 0.5,
    };
    return new Fuse(checklists, options);
  }, [checklists]);

  const handleSearch = (query: string) => {
    // Filter checklists logic here if needed
  };

  const handleSort = (newSortBy: string) => {
    // Sort checklists logic here if needed
  };

  const groupedChecklists = useMemo(() => {
    return checklists.reduce((groups, checklist) => {
      const groupName = checklist.group;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(checklist);
      return groups;
    }, {} as GroupedChecklists);
  }, [checklists]);

  const handleGroupClick = (groupName: string) => {
    setSelectedGroup(groupName);
    const groupChecklists = groupedChecklists[groupName];
    setChecklists(groupChecklists);
    router.push(`/inputs/checklists/${encodeURIComponent(groupName)}`);
  };

  return (
    <div className="mt-6 flex h-full flex-col">
      <ChecklistsFilters
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <div className="scrollbar-hidden mt-2 flex-1 overflow-y-auto p-1">
        {Object.entries(groupedChecklists).map(
          ([groupName, groupChecklists]) => (
            <Card
              key={groupName}
              size="md"
              className="mb-4 w-full cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-lg"
              style={{
                border: '1px solid var(--color-secondary-300)',
                borderRadius: '0.5rem',
                padding: '1rem',
                width: '100%',
                height: 'auto',
              }}
              cardColor="var(--color-secondary-950)"
              enableTiltEffect={false}
              onClick={() => handleGroupClick(groupName)}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{groupName}</h3>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default GroupList;

// display list of groups
'use client';
import React, { useState, useMemo } from 'react';
import { Card } from '@/lib/components/card/card';
import { Checklist, GroupedChecklists } from '@/app/inputs/utils/types';
import ChecklistsFilters from './FilterButtons';
import Fuse from 'fuse.js';

type GroupListProps = {
  checklists: Checklist[];
};

const GroupList: React.FC<GroupListProps> = ({ checklists }) => {
  const [filteredChecklists, setFilteredChecklists] = useState(checklists);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [selectedResult, setSelectedResult] = useState<Checklist | null>(
    checklists[0] || null
  );
  const [results, setResults] = useState<Checklist[]>(checklists);

  // Group checklists by group name
  const groupedChecklists = filteredChecklists.reduce((groups, checklist) => {
    const groupName = checklist.group;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(checklist);
    return groups;
  }, {} as GroupedChecklists);

  const fuse = useMemo(() => {
    const options = {
      keys: [],
      includeScore: true,
      threshold: 0.5, // lower threshold = more accurate
    };
    return new Fuse(checklists, options);
  }, [checklists]);

  const filteredResults = useMemo(() => {
    let searchPlugins = searchQuery
      ? fuse.search(searchQuery).map((plugin) => plugin.item)
      : results;

    if (sortBy === 'date-asc') {
      searchPlugins = searchPlugins.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === 'date-desc') {
      searchPlugins = searchPlugins.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === 'name') {
      searchPlugins = searchPlugins.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return searchPlugins;
  }, [searchQuery, activeFilters, sortBy, fuse, results]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleSort = (newSortBy: string) => setSortBy(newSortBy);

  return (
    <div className="mt-6 flex h-full flex-col">
      <ChecklistsFilters
        onSearch={handleSearch}
        onSort={handleSort}
      />
      <div className="scrollbar-hidden mt-2 flex-1 overflow-y-auto p-1">
        {Object.keys(groupedChecklists).map((groupName) => (
          <Card
            key={groupName}
            size="md"
            className="mb-4 w-full shadow-md transition-shadow duration-200 hover:shadow-lg"
            style={{
              border: '1px solid var(--color-secondary-300)',
              borderRadius: '0.5rem',
              padding: '1rem',
              width: '100%',
              height: 'auto',
            }}
            cardColor="var(--color-secondary-950)"
            enableTiltEffect={false}>
            <div>{groupName}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupList;

import React from 'react';
import { useChecklists } from '@/app/inputs/checklists/upload/context/ChecklistsContext';

export function GroupNameInput() {
  const { selectedGroup, setSelectedGroup } = useChecklists();

  return (
    <div className="mb-1">
      <label
        htmlFor="groupName"
        className="mb-2 block text-sm font-medium">
        Group Name
      </label>
      <input
        id="groupName"
        type="text"
        value={selectedGroup || ''}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="w-[300px] rounded-md border border-secondary-300 bg-secondary-950 px-3 py-2"
        placeholder="Enter group name"
        required
      />
    </div>
  );
}

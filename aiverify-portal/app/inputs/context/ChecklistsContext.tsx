// /app/inputs/context/ChecklistsContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Checklist } from '@/app/inputs/utils/types';

type ChecklistsContextType = {
  checklists: Checklist[];
  selectedGroup: string | null;
  setChecklists: (checklists: Checklist[]) => void;
  setSelectedGroup: (groupName: string) => void;
  setSelectedChecklist: (checklist: Checklist) => void;
};

const ChecklistsContext = createContext<ChecklistsContextType | undefined>(
  undefined
);

export const ChecklistsProvider = ({ children }: { children: ReactNode }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const setSelectedChecklist = (checklist: Checklist) => {
    // logic to set selected checklist
  };

  return (
    <ChecklistsContext.Provider
      value={{
        checklists,
        selectedGroup,
        setChecklists,
        setSelectedGroup,
        setSelectedChecklist,
      }}>
      {children}
    </ChecklistsContext.Provider>
  );
};

export const useChecklists = (): ChecklistsContextType => {
  const context = useContext(ChecklistsContext);
  if (!context) {
    throw new Error('useChecklists must be used within a ChecklistsProvider');
  }
  return context;
};

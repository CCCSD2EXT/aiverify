'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

// Types
interface Checklist {
  cid: string;
  gid: string;
  name: string;
  data: Record<string, any>;
  group: string;
  updated_at?: string;
}

interface ChecklistContextState {
  checklists: Checklist[];
  selectedGroup: string | null;
  selectedChecklist: Checklist | null;
  isLoading: boolean;
  error: Error | null;
}

interface ChecklistContextActions {
  setSelectedGroup: (groupName: string) => void;
  setSelectedChecklist: (checklist: Checklist) => void;
  updateChecklistData: (cid: string, data: Record<string, any>) => void;
  saveAllChecklists: () => Promise<void>;
  clearAllChecklists: () => void;
  setChecklists: (checklists: Checklist[]) => void;
}

type ChecklistContextValue = ChecklistContextState & ChecklistContextActions;

// Default checklist definitions
const DEFAULT_CHECKLISTS: Checklist[] = [
  {
    cid: 'accountability_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'Accountability Process Checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'data_governance_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'data_governance_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'explainability_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'explainability_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'fairness_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'fairness_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'human_agency_oversight_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'human_agency_oversight_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'inclusive_growth_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'inclusive_growth_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'organisational_considerations_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'organisational_considerations_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'reproducibility_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'reproducibility_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'robustness_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'robustness_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'safety_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'safety_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'security_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'security_process_checklist',
    data: {},
    group: 'default',
  },
  {
    cid: 'transparency_process_checklist',
    gid: 'aiverify.stock.process_checklist',
    name: 'transparency_process_checklist',
    data: {},
    group: 'default',
  },
];

// Context creation
const ChecklistsContext = createContext<ChecklistContextValue | undefined>(
  undefined
);

// Provider component
export const ChecklistsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ChecklistContextState>({
    checklists: DEFAULT_CHECKLISTS,
    selectedGroup: 'default',
    selectedChecklist: null,
    isLoading: false,
    error: null,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checklistData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setState((prev) => ({
        ...prev,
        checklists: parsedData.checklists || DEFAULT_CHECKLISTS,
        selectedGroup: parsedData.selectedGroup || 'default',
      }));
    }
  }, []);

  // Actions
  const setSelectedGroup = useCallback((groupName: string) => {
    setState((prev) => ({
      ...prev,
      selectedGroup: groupName,
      checklists: prev.checklists.map((checklist) => ({
        ...checklist,
        group: checklist.group || groupName, // Retain group if already set
      })),
    }));
  }, []);

  const setSelectedChecklist = useCallback((checklist: Checklist) => {
    setState((prev) => ({
      ...prev,
      selectedChecklist: checklist,
    }));
  }, []);

  // Make sure the context properly updates the checklists data
  const updateChecklistData = useCallback(
    (cid: string, data: Record<string, any>) => {
      setState((prev) => {
        const updatedChecklists = prev.checklists.map((checklist) =>
          checklist.cid === cid
            ? {
                ...checklist,
                data: data, // Direct assignment instead of spreading
                updated_at: new Date().toISOString(),
              }
            : checklist
        );

        // Immediately save to localStorage
        localStorage.setItem(
          'checklistData',
          JSON.stringify({
            checklists: updatedChecklists,
            selectedGroup: prev.selectedGroup,
          })
        );

        return {
          ...prev,
          checklists: updatedChecklists,
        };
      });
    },
    []
  );

  const saveAllChecklists = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const promises = state.checklists.map((checklist) =>
        fetch('/api/input_block_data/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cid: checklist.cid,
            gid: checklist.gid,
            data: checklist.data,
            name: checklist.name,
            group: state.selectedGroup,
          }),
        })
      );

      await Promise.all(promises);

      // Save to localStorage
      localStorage.setItem(
        'checklistData',
        JSON.stringify({
          checklists: state.checklists,
          selectedGroup: state.selectedGroup,
        })
      );

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [state.checklists, state.selectedGroup]);

  const clearAllChecklists = useCallback(() => {
    setState((prev) => ({
      ...prev,
      checklists: DEFAULT_CHECKLISTS.map((checklist) => ({
        ...checklist,
        data: {},
        group: prev.selectedGroup || 'default',
      })),
    }));
  }, []);

  const setChecklists = useCallback((newChecklists: Checklist[]) => {
    setState((prev) => ({
      ...prev,
      checklists: newChecklists,
    }));
  }, []);

  const contextValue: ChecklistContextValue = {
    ...state,
    setSelectedGroup,
    setSelectedChecklist,
    updateChecklistData,
    saveAllChecklists,
    clearAllChecklists,
    setChecklists,
  };

  return (
    <ChecklistsContext.Provider value={contextValue}>
      {children}
    </ChecklistsContext.Provider>
  );
};

// Custom hook
export const useChecklists = () => {
  const context = useContext(ChecklistsContext);
  if (!context) {
    throw new Error('useChecklists must be used within a ChecklistsProvider');
  }
  return context;
};

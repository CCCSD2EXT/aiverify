'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useChecklists } from '@/app/inputs/checklists/upload/context/ChecklistsContext';
import { useMDXBundle } from '../../../[groupId]/[checklistId]/hooks/useMDXBundle';
import { Modal } from '@/lib/components/modal';
import { useRouter } from 'next/navigation';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { Skeleton } from '../../../[groupId]/[checklistId]/utils/Skeletion';
import dynamic from 'next/dynamic';
import styles from './ChecklistDetail.module.css';

interface ChecklistDetailProps {
  id: string; // Ensure 'id' corresponds to 'checklistId'
}

interface MDXProps {
  data: Record<string, string>;
  onChangeData: (key: string, value: string) => void;
}

const ChecklistDetail: React.FC<ChecklistDetailProps> = ({ id }) => {
  const { checklists, updateChecklistData } = useChecklists();
  const checklist = checklists.find((c) => c.cid === id);
  const [localData, setLocalData] = useState<Record<string, any>>({});

  // Load data on mount and when checklist changes
  useEffect(() => {
    if (checklist) {
      setLocalData(checklist.data || {});
    }
  }, [checklist]);

  const handleDataChange = (key: string, value: string) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    updateChecklistData(id, newData); // Immediately sync with context
  };

  const router = useRouter();
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showClearModal, setShowClearModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  console.log('detail data', checklist);

  const { data: mdxBundle, isLoading: isLoadingMDX } = useMDXBundle(
    checklist?.gid,
    checklist?.cid
  );

  // Load persisted data
  useEffect(() => {
    if (checklist && isInitialLoad) {
      const savedData = localStorage.getItem(`checklist_${id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setLocalData(parsedData);
        updateChecklistData(id, parsedData); // Sync saved data to context
      }
      setIsInitialLoad(false);
    }
  }, [checklist, id, isInitialLoad, updateChecklistData]);

  // Autosave functionality
  useEffect(() => {
    if (isInitialLoad) return; // Skip autosave during the initial load

    const saveDataLocally = () => {
      // Save only to localStorage
      localStorage.setItem(`checklist_${id}`, JSON.stringify(localData));
      // Push changes to context to ensure context data stays in sync
      updateChecklistData(id, localData);
      // Update the "last saved" timestamp
      setLastSaved(new Date());
    };

    const timeout = setTimeout(saveDataLocally, 3000); // Autosave with a 3-second debounce

    return () => clearTimeout(timeout); // Clear the timeout on cleanup
  }, [localData, id, isInitialLoad, updateChecklistData]);

  const handleClearFields = () => {
    setLocalData({});
    if (checklist) {
      updateChecklistData(checklist.cid, {});
    }
    setShowClearModal(false);
  };

  const handleBack = () => {
    router.push(`/inputs/checklists/upload/`);
  };

  const MDXComponent = useMemo(() => {
    if (!mdxBundle?.code) return null;

    try {
      const context = { React, _jsx_runtime: ReactJSXRuntime };
      const componentFn = new Function(...Object.keys(context), mdxBundle.code);
      const Component = componentFn(
        ...Object.values(context)
      ) as React.ComponentType<MDXProps>;

      return dynamic(() => Promise.resolve(Component), {
        loading: () => <Skeleton className="h-64 w-full" />,
        ssr: false,
      });
    } catch (error) {
      console.error('Error creating MDX component:', error);
      return null;
    }
  }, [mdxBundle]);

  if (!checklist || !MDXComponent) {
    return <div>No checklist data available</div>;
  }

  return (
    <div className={styles['mdx-wrapper']}>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{checklist.name}</h1>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-secondary-500">
                Last saved: {lastSaved.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {MDXComponent && typeof MDXComponent === 'function' ? (
          <MDXComponent
            data={localData}
            onChangeData={handleDataChange}
          />
        ) : (
          <div>Invalid MDX content</div>
        )}

        {showClearModal && (
          <Modal
            heading="Confirm Clear"
            onCloseIconClick={() => setShowClearModal(false)}
            primaryBtnLabel="Yes, Clear"
            secondaryBtnLabel="Cancel"
            onPrimaryBtnClick={handleClearFields}
            onSecondaryBtnClick={() => setShowClearModal(false)}
            enableScreenOverlay>
            <p className="text-center text-lg">
              Are you sure you want to clear all fields? This action cannot be
              undone.
            </p>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ChecklistDetail;

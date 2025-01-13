'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useChecklist } from '../hooks/useChecklist';
import { useMDXBundle } from '../hooks/useMDXBundle';
import { useChecklistMutation } from '../hooks/useChecklistMutation';
import { Skeleton } from '../utils/Skeletion';
import { Alert, AlertDescription } from '../utils/Alert';
import { Card } from '@/lib/components/card/card';
import type { MDXProps } from '../utils/types';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import styles from './ChecklistDetail.module.css';
import useUpdateChecklist from '../hooks/useUpdateChecklist';

interface ChecklistDetailProps {
  id: string;
}

const ChecklistDetail: React.FC<ChecklistDetailProps> = ({ id }) => {
  const {
    data: checklistData,
    isLoading: isLoadingChecklist,
    error: checklistError,
  } = useChecklist(id);

  const {
    data: mdxBundle,
    isLoading: isLoadingMDX,
    error: mdxError,
  } = useMDXBundle(checklistData?.gid, checklistData?.cid);

  const updateMutation = useUpdateChecklist();
  const [localData, setLocalData] = useState(checklistData?.data || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  useEffect(() => {
    setLocalData(checklistData?.data || {});
  }, [checklistData]);

  // Clean up timeout on unmount
  useEffect(() => {
    setLocalData(checklistData?.data || {});
  }, [checklistData]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  const saveChanges = async () => {
    if (!checklistData) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          data: localData,
          name: checklistData.name,
        },
      });
      setLastSaved(new Date());
      hasUnsavedChanges.current = false;
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (key: string, value: string) => {
    if (!checklistData) return;

    const newData = {
      ...localData,
      [key]: value,
    };

    setLocalData(newData);
    hasUnsavedChanges.current = true;

    // Auto-save logic
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    autoSaveTimeout.current = setTimeout(() => {
      saveChanges();
    }, 2000); // 2 second debounce delay
  };

  const handleClearFields = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      // Create a new object with the same keys but empty string values
      const clearedData = Object.keys(localData).reduce(
        (acc, key) => {
          acc[key] = '';
          return acc;
        },
        {} as Record<string, string>
      );

      setLocalData(clearedData);
      hasUnsavedChanges.current = true;

      // Clear any pending auto-save
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    }
  };

  const MDXComponent = React.useMemo(() => {
    if (!mdxBundle?.code) return null;

    try {
      const context = {
        React,
        _jsx_runtime: ReactJSXRuntime,
      };

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

  if (isLoadingChecklist || isLoadingMDX) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (checklistError || mdxError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {checklistError?.message || mdxError?.message || 'An error occurred'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!MDXComponent || !checklistData) {
    return (
      <Alert>
        <AlertDescription>No checklist data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={styles['mdx-wrapper']}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{checklistData.name}</h1>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-seconday-500 text-sm">
                Last saved: {lastSaved.toLocaleString()}
              </span>
            )}
            <button
              className="rounded bg-[#392348] px-4 py-2 font-semibold text-white hover:bg-[#392348]"
              onClick={saveChanges}
              disabled={isSaving || !hasUnsavedChanges.current}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="rounded border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-secondary-400"
              onClick={handleClearFields}>
              Clear Fields
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(checklistData.updated_at).toLocaleString()}
        </p>
      </div>

      <MDXComponent
        data={localData}
        onChangeData={handleDataChange}
      />
    </div>
  );
};

export default ChecklistDetail;

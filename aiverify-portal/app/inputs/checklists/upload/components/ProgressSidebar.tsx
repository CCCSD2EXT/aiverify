'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useChecklists } from '@/app/inputs/checklists/upload/context/ChecklistsContext';
import {
  WarningCircleIcon,
  CheckCircleIcon,
} from '../../[groupId]/utils/icons';
import { useMDXSummaryBundle } from '../../[groupId]/hooks/useMDXSummaryBundle';
import * as ReactJSXRuntime from 'react/jsx-runtime';

const ProgressBar: React.FC = () => {
  const { checklists, selectedGroup } = useChecklists();

  if (!selectedGroup) {
    return <div>Please select or create a group to view progress.</div>; // Add a prompt for group selection
  }

  const groupChecklists = useMemo(
    () => checklists.filter((c) => c.group === selectedGroup),
    [checklists, selectedGroup]
  );

  return (
    <div className="mt-6 rounded border border-secondary-300 bg-secondary-950 p-4">
      <h3 className="mb-4 text-lg font-semibold">
        Process Checklists Progress
      </h3>
      {groupChecklists.map((checklist) => {
        const {
          data: mdxSummaryBundle,
          isLoading,
          error,
        } = useMDXSummaryBundle(checklist.gid, checklist.cid);

        const progressData = useMemo(() => {
          if (!mdxSummaryBundle?.code) return null;
          try {
            const context = {
              React,
              jsx: ReactJSXRuntime.jsx,
              jsxs: ReactJSXRuntime.jsxs,
              _jsx_runtime: ReactJSXRuntime,
              Fragment: ReactJSXRuntime.Fragment,
            };

            const moduleFactory = new Function(
              ...Object.keys(context),
              `${mdxSummaryBundle.code}`
            );
            const moduleExports = moduleFactory(...Object.values(context));
            const progressFn = moduleExports.progress;
            return progressFn ? progressFn(checklist.data) : 0;
          } catch (error) {
            console.error('Error parsing MDX code:', error);
            return null;
          }
        }, [mdxSummaryBundle, checklist.data]);

        const isCompleted = progressData === 100;

        return (
          <div
            key={checklist.cid}
            className="flex cursor-pointer items-center justify-between rounded bg-secondary-950 p-1 hover:bg-secondary-900">
            <div className="flex items-center gap-1">
              {isCompleted ? (
                <CheckCircleIcon
                  color="#3BB140"
                  size={20}
                />
              ) : (
                <WarningCircleIcon
                  color="#EE914E"
                  size={20}
                />
              )}
              <span className="text-sm font-medium text-white">
                {checklist.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;

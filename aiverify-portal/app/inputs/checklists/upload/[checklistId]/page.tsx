'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChecklistDetail from './components/ChecklistDetail';
import Link from 'next/link';
import { Icon, IconName } from '@/lib/components/IconSVG';
import { Modal } from '@/lib/components/modal';
import { useChecklists } from '@/app/inputs/checklists/upload/context/ChecklistsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

type PageParams = {
  checklistId: string; // Ensure this matches the dynamic param in the file path
  groupId: string;
  [key: string]: string | string[];
};

export default function ChecklistDetailPage() {
  const params = useParams<PageParams>();
  const { updateChecklistData } = useChecklists();
  const [showClearModal, setShowClearModal] = React.useState(false);

  const handleBack = () => {
    window.history.back(); // Use browser history to navigate back
  };

  const handleClearFields = () => {
    updateChecklistData(params.checklistId, {}); // Clear the data for the current checklist
    setShowClearModal(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto h-[calc(100vh-200px)] px-4 py-6">
        {/* Breadcrumb navigation */}
        <div className="flex">
          <Icon
            name={IconName.File}
            size={35}
            color="#FFFFFF"
          />
          <div className="ml-3 items-end">
            <nav className="breadcrumbs mb-6 text-sm">
              <span className="text-2xl text-white">
                <Link href="/inputs">Inputs</Link>
              </span>
              <span className="mx-2 text-2xl text-white">/</span>
              <span className="text-2xl text-white">
                <Link href={`/inputs/checklists/`}>Checklists</Link>
              </span>
              <span className="mx-2 text-2xl text-white">/</span>
              <span className="text-2xl text-white">
                <Link href={`/inputs/checklists/${params.groupId}`}>
                  {decodeURIComponent(params.checklistId)}
                </Link>
              </span>
              <span className="mx-2 text-2xl text-white">/</span>
              <span className="text-2xl text-primary-300 text-white">
                Details
              </span>
            </nav>
          </div>
        </div>

        {/* Buttons for Back and Clear */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="rounded bg-secondary-700 px-4 py-2 text-white">
            Back to Group
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="rounded border border-gray-300 px-4 py-2">
            Clear Fields
          </button>
        </div>

        {/* Checklist detail content */}
        <div className="scrollbar-hidden h-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <ChecklistDetail id={params.checklistId} />
        </div>

        {/* Clear modal */}
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
    </QueryClientProvider>
  );
}

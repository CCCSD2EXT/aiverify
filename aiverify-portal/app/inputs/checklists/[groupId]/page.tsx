'use client';

import { Suspense, useMemo } from 'react';
import GroupDetail from './components/GroupDetail';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';
import { usePathname } from 'next/navigation';
import { Icon, IconName } from '@/lib/components/IconSVG';
import ActionButtons from '@/app/inputs/components/ActionButtons';
import Link from 'next/link';
import { ChevronLeftIcon } from '@/app/inputs/utils/icons';

export default function GroupDetailPage() {
  const { selectedGroup } = useChecklists();
  const pathname = usePathname();

  const groupIdFromURL = useMemo(() => {
    const urlParams = new URLSearchParams(pathname.split('?')[1]);
    return urlParams.get('groupId');
  }, [pathname]);

  const groupName = selectedGroup ?? decodeURIComponent(groupIdFromURL ?? '');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {groupName ? (
        <div className="h-full p-6">
          <div className="mb-1 flex items-center justify-between">
            {/* Left section: Icon + Text */}
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
                  <h1 className="text-2xl font-bold text-white">
                    AI Verify Process Checklists
                  </h1>
                </div>
                <h3 className="text-white">
                  Manage and view AI Verify Process Checklists
                </h3>
              </div>
            </div>
            <ActionButtons />
          </div>
          <GroupDetail groupName={groupName} />
        </div>
      ) : (
        <div>No group selected.</div>
      )}
    </Suspense>
  );
}

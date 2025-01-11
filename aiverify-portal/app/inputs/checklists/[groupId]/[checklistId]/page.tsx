import { Suspense, useMemo } from 'react';
import DisplayChecklist from './components/DisplayChecklist';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';
import { usePathname } from 'next/navigation';

export default function ChecklistDetailPage() {
  const { selectedGroup } = useChecklists();
  const pathname = usePathname();

  const groupIdFromURL = useMemo(() => {
    const urlParams = new URLSearchParams(pathname.split('?')[1]);
    return urlParams.get('groupId');
  }, [pathname]);

  const checklistId = selectedGroup ?? decodeURIComponent(groupIdFromURL ?? '');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {checklist && <DisplayChecklist checklist={checklist} />}
    </Suspense>
  );
}

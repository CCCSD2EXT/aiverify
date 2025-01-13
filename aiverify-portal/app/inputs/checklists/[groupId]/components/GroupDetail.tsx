// /app/inputs/checklists/[groupId]/components/GroupDetail.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/lib/components/card/card';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';
import { Icon, IconName } from '@/lib/components/IconSVG';

type GroupDetailProps = {
  groupName: string;
};

const GroupDetail: React.FC<GroupDetailProps> = ({ groupName }) => {
  const { checklists, setSelectedChecklist } = useChecklists();
  const router = useRouter();

  const groupChecklists = checklists.filter(
    (checklist) => checklist.group.toLowerCase() === groupName.toLowerCase()
  );

  const handleChecklistClick = (checklistId: number) => {
    const selectedChecklist = groupChecklists.find(
      (checklist) => checklist.id === checklistId
    );
    if (selectedChecklist) {
      setSelectedChecklist(selectedChecklist);
      router.push(`/inputs/checklists/${groupName}/${checklistId}`);
    }
  };

  return (
    <div className="mt-6 flex h-[calc(100vh-200px)] flex-col gap-4 bg-secondary-950">
      <div className="flex justify-between p-6">
        <h1 className="mb-4 text-3xl font-bold">{groupName}</h1>
        <div className="flex justify-between gap-2">
          <Icon
            name={IconName.Pencil}
            color="#FFFFFF"
          />
          <Icon
            name={IconName.Delete}
            color="#FFFFFF"
          />
        </div>
      </div>
      {groupChecklists.map((checklist) => (
        <Card
          key={checklist.id}
          size="md"
          className="mb-4 w-full cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-lg"
          style={{
            border: '1px solid var(--color-secondary-300)',
            borderRadius: '0.5rem',
            padding: '1rem',
            width: '100%',
            height: 'auto',
          }}
          cardColor="var(--color-secondary-950)"
          enableTiltEffect={false}
          onClick={() => handleChecklistClick(checklist.id)}>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">{checklist.name}</div>
            <div className="text-sm text-gray-500">
              Last updated:{' '}
              {new Date(checklist.updated_at).toLocaleDateString()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupDetail;

// display list of checklists for selected group of checklist
'use client';
import React from 'react';
import { Card } from '@/lib/components/card/card';
import { Checklist } from '@/app/inputs/utils/types';

type GroupDetailProps = {
  checklists: Checklist[];
  onChecklistSelect: (checklistId: number) => void;
};

const GroupDetail: React.FC<GroupDetailProps> = ({
  checklists,
  onChecklistSelect,
}) => {
  return (
    <div>
      {checklists.map((checklist) => (
        <Card
          key={checklist.id}
          size="sm"
          onClick={() => onChecklistSelect(checklist.id)}>
          <div>{checklist.name}</div>
          <div>{checklist.updated_at}</div>
        </Card>
      ))}
    </div>
  );
};

export default GroupDetail;

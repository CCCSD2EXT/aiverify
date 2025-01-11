// components/DisplayChecklist.tsx
'use client';
import React from 'react';
import { Checklist } from '@/app/inputs/utils/types';

interface DisplayChecklistProps {
  checklist: Checklist;
}

const DisplayChecklist: React.FC<DisplayChecklistProps> = ({ checklist }) => {
  return (
    <div className="display-checklist">
      <h2>{checklist.name}</h2>
      <div>
        <h3>Testable Criteria</h3>
      </div>
    </div>
  );
};

export default DisplayChecklist;

import React from 'react';

interface ProgressSidebarListProps {
  checklists: { name: string; progress: number }[];
}

const ProgressSidebarList: React.FC<ProgressSidebarListProps> = ({
  checklists,
}) => {
  return (
    <div className="progress-sidebar">
      {checklists.map((checklist) => (
        <div
          key={checklist.name}
          className="progress-item">
          <span>{checklist.name}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${checklist.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSidebarList;

// components/DisplayChecklist.tsx
import React from 'react';

interface DisplayChecklistProps {
  checklist: { name: string; criteria: string[]; processes: string[] };
}

const DisplayChecklist: React.FC<DisplayChecklistProps> = ({ checklist }) => {
  return (
    <div className="display-checklist">
      <h2>{checklist.name}</h2>
      <div>
        <h3>Testable Criteria</h3>
        <ul>
          {checklist.criteria.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Processes</h3>
        <ul>
          {checklist.processes.map((process, index) => (
            <li key={index}>{process}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisplayChecklist;

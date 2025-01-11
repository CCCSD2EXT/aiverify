// components/DisplayChecklistForm.tsx
import React, { useState } from 'react';

interface DisplayChecklistFormProps {
  checklist: { name: string; criteria: string[]; processes: string[] };
  onSave: (updatedChecklist: any) => void;
}

const DisplayChecklistForm: React.FC<DisplayChecklistFormProps> = ({
  checklist,
  onSave,
}) => {
  const [editedChecklist, setEditedChecklist] = useState(checklist);

  const handleSave = () => {
    onSave(editedChecklist);
  };

  return (
    <div className="display-checklist-form">
      <h2>Edit Checklist: {editedChecklist.name}</h2>
      <div>
        <h3>Testable Criteria</h3>
        <ul>
          {editedChecklist.criteria.map((item, index) => (
            <li key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  setEditedChecklist({
                    ...editedChecklist,
                    criteria: [
                      ...editedChecklist.criteria.slice(0, index),
                      e.target.value,
                      ...editedChecklist.criteria.slice(index + 1),
                    ],
                  })
                }
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Processes</h3>
        <ul>
          {editedChecklist.processes.map((process, index) => (
            <li key={index}>
              <input
                type="text"
                value={process}
                onChange={(e) =>
                  setEditedChecklist({
                    ...editedChecklist,
                    processes: [
                      ...editedChecklist.processes.slice(0, index),
                      e.target.value,
                      ...editedChecklist.processes.slice(index + 1),
                    ],
                  })
                }
              />
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default DisplayChecklistForm;

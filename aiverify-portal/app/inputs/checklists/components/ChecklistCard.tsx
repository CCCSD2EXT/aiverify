import { ChecklistMeta } from "@/app/inputs/utils/types";
import { Card } from '@/lib/components/card/card';

type Props = {
  checklist: ChecklistMeta;
};

export default function ChecklistCard({ checklist }: Props) {
  return (
    <Card
      size="md"
      className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 w-full"
      style={{
        border: '1px solid var(--color-secondary-300)',
        borderRadius: '0.5rem',
        padding: '1rem',
        width: '100%',
        height: 'auto',
      }}
      cardColor="var(--color-secondary-950)"
      enableTiltEffect={false}
    >
      <Card.Content className="h-auto">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">{checklist.name}</h3>

        {/* Metadata and Description */}
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          <div>
            <span className="font-semibold text-white">Group:</span> {checklist.group}
          </div>
          <div>
            <span className="font-semibold text-white">Description:</span> {checklist.description}
          </div>
          <div>
            <span className="font-semibold text-white">Width:</span> {checklist.width}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

import React from 'react';
import { Button, ButtonVariant } from '@/lib/components/button';
import Link from 'next/link';

const ActionButtons: React.FC = () => (
  <div className="flex">
    <Link href="/inputs/fairnesstree/upload">
      <Button
        pill
        textColor="white"
        variant={ButtonVariant.OUTLINE}
        size="sm"
        text="ADD FAIRNESS TREE"
      />
    </Link>
  </div>
);

export default ActionButtons;

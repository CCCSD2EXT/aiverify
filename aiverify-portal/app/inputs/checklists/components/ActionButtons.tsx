import React from 'react';
import { Button, ButtonVariant } from '@/lib/components/button';
import Link from 'next/link';

const ActionButtons: React.FC = () => (
  <div className="flex">
    <Link href="/inputs">
      <Button
        pill
        textColor="white"
        variant={ButtonVariant.OUTLINE}
        size="sm"
        text="ADD USER INPUT"
      />
    </Link>
  </div>
);

export default ActionButtons;
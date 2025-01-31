'use client';

import React, { useMemo } from 'react';
import { Modal } from '@/lib/components/modal';
import { useMDXBundle } from '@/app/inputs/fairnesstree/hooks/useMDXBundle';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { FairnessTree } from '@/app/inputs/utils/types';
import dynamic from 'next/dynamic';
import { DecisionTree } from 'aiverify-shared-library/graph';

const FairnessTreeMDXModal: React.FC<{
  tree: FairnessTree;
  isOpen: boolean;
  onClose: () => void;
}> = ({ tree, isOpen, onClose }) => {
  const {
    data: mdxBundle,
    isLoading,
    error,
  } = useMDXBundle(tree.gid, tree.cid);

  const MDXComponent = useMemo(() => {
    if (!mdxBundle?.code) return null;

    try {
      const context = {
        React,
        jsx: ReactJSXRuntime.jsx,
        jsxs: ReactJSXRuntime.jsxs,
        _jsx_runtime: ReactJSXRuntime,
        Fragment: ReactJSXRuntime.Fragment,
      };

      const moduleFactory = new Function(
        ...Object.keys(context),
        `${mdxBundle.code}`
      );
      const moduleExports = moduleFactory(...Object.values(context));

      console.log(moduleExports.default);

      return moduleExports;
    } catch (error) {
      console.error('Error creating MDX component:', error);
      return null;
    }
  }, [mdxBundle]);

  if (isLoading) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-400">Error loading content</div>;
  }

  if (!MDXComponent) {
    return <div className="text-sm text-gray-400">No content available</div>;
  }

  return (
    <Modal
      heading={tree.name}
      enableScreenOverlay={true}
      onCloseIconClick={onClose}
      width={800}
      height={600}>
      <div className="h-full overflow-auto">
        {React.createElement(MDXComponent.default, {
          data: tree.data,
        })}
      </div>
    </Modal>
  );
};

export default FairnessTreeMDXModal;

import React from 'react';
import { Icon, IconName } from '@/lib/components/IconSVG';
import { getTestResults } from '@/lib/fetchApis/getTestResults';
import ActionButtons from './components/ActionButton';
import TestResultsList from './components/TestResultsList';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
  const testResults = await getTestResults();

  return (
    <div className="p-6">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center">
          <Icon
            name={IconName.Lightning}
            size={40}
            color="#FFFFFF"
          />
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-white">Test Results</h1>
            <h3 className="text-white">View and manage test results</h3>
          </div>
        </div>
        <ActionButtons />
      </div>
      <TestResultsList testResults={testResults} />
    </div>
  );
}

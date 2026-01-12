// @ts-nocheck

import React, { useState, Suspense, lazy } from 'react';

const HeavyChart = lazy(() => import('./components/HeavyChart'));

function AnalyticsPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Analytics</h1>
      <button onClick={() => setShowChart(true)}>View Report</button>

      {showChart && (
        <Suspense fallback={<p>Loading Chart Engine...</p>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
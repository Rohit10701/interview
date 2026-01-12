// @ts-nocheck
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

const NikeProductList = ({ products }) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Height of one product card
    overscan: 5, // Pre-render 5 items to prevent "flashing"
  });

  return (
    <div
      ref={parentRef}
      style={{ height: '600px', overflow: 'auto', border: '1px solid #ccc' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {/* Render Nike Product Card */}
            Product: {products[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
};
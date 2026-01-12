// @ts-nocheck
import { useState, useRef, useMemo } from 'react';

const CustomVirtualList = ({ items, itemHeight, windowHeight }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + windowHeight) / itemHeight)
  );

  const buffer = 2;
  const visibleStartIndex = Math.max(0, startIndex - buffer);
  const visibleEndIndex = Math.min(items.length - 1, endIndex + buffer);

  const visibleItems = useMemo(() => {
    const slice = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      slice.push({ ...items[i], index: i });
    }
    return slice;
  }, [items, visibleStartIndex, visibleEndIndex]);

  const onScroll = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      onScroll={onScroll}
      style={{ height: windowHeight, overflowY: 'auto', position: 'relative' }}
    >
      {/* The "Runway" - provides the total scrollable height */}
      <div style={{ height: items.length * itemHeight, width: '100%' }}>
        {visibleItems.map((item) => (
          <div
            key={item.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: itemHeight,
              // Push the item down to its correct position in the list
              transform: `translateY(${item.index * itemHeight}px)`,
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
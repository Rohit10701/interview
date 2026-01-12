// @ts-nocheck
const sortedList = useMemo(() => {
  return largeArray.sort((a, b) => a - b);
}, [largeArray]); // Only re-runs if largeArray changes
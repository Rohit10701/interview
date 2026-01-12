// @ts-nocheck
useLayoutEffect(() => {
  const height = divRef.current.offsetHeight;
  if (height > 500) {
    setCompactMode(true);
  }
}, []);
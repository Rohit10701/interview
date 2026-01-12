// @ts-nocheck
useEffect(() => {
  const subscription = API.subscribe();
  
  // Clean-up function (runs when component unmounts)
  return () => subscription.unsubscribe();
}, []); // Empty array means "run once on mount"
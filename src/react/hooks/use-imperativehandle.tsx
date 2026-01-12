// @ts-nocheck
const CustomInput = forwardRef((props, ref) => {
  const localRef = useRef();

  useImperativeHandle(ref, () => ({
    // Only these methods are exposed to the parent
    focus: () => localRef.current.focus(),
    clear: () => (localRef.current.value = "")
  }));

  return <input ref={localRef} />;
});

// Parent Usage:
// inputRef.current.focus() or inputRef.current.clear()
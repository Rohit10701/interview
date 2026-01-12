// @ts-nocheck

const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus(); // Accessing DOM directly
};

<input ref={inputRef} />;
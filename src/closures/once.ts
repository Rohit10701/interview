const onceWrapper = () => {
    const once = <T extends (...args: any[]) => any>(func: T): T => {
        let isPressed = false;
        
        return ((...args: Parameters<T>): ReturnType<T> | undefined => {
            if (isPressed) return;
            
            isPressed = true;
            func(...args);
            
            setTimeout(() => { isPressed = false }, 2000);
        }) as T;
    };
    
    const myButton = (a: number) => console.log("pressed:", a);
    const onceButton = once(myButton);

    onceButton(1);
    onceButton(2);
    onceButton(3);
    
}

export { onceWrapper }
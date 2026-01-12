function throttle(func: Function, delay: number) {
    let waiting = false;
    return function(...args: any) {
        if (!waiting) {
            func.apply(this, args);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, delay);
        }
    };
}

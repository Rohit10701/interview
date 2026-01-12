function debounce(func : Function, delay : number){
    let timer : NodeJS.Timeout
    return function(...args : any){
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            // func(...args) -> lost this context
            func.apply(this, args)
        }, delay)
    }
}
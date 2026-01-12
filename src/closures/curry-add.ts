function curry (a){
    let current = a
    return function (b){
        if (b === undefined){
            return current
        }
        current += b
        return curry(current)
    }
}

console.log(curry(1)(2)(3)(4)(5))

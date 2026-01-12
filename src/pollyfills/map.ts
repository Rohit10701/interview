Array.prototype.map = function (callback){
    const result = []
    for (let i = 0; i < this.length; i++) {
        // callback -> (value, index, array)
        result.push(callback(this[i], i, this))
    }
    return result
}
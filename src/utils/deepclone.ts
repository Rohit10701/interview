function deepCloneSimple (obj : object) {
    return JSON.parse(JSON.stringify(obj))
}

function deepClone(obj : object) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) {
        const result = [];
        for (let i = 0; i < obj.length; i++) {
            if (i in obj) result[i] = deepClone(obj[i]);
        }
        return result;
    }
    if (obj.constructor === Object) {
        const result = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) result[key] = deepClone(obj[key]);
        }
        return result;
    }
    return obj;
}

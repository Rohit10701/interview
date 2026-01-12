// do all promises until all are completed and return result if fails return reject
const PromiseAll = (promises: Promise<any>[]) => {
    return new Promise((resolve, reject) => {
        let completionPromiseCount = 0
        let result = []
        for (let i = 0; i < promises.length; i++){
            promises[i].then((res) => {
                result[i] = res
                completionPromiseCount++
                if (completionPromiseCount === promises.length) {
                    resolve(result)
                }
            }).catch((err) => {
                reject(err)
            })
        }
    })
}   
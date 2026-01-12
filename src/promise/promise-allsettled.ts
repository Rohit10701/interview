// all success or failure complete all first then resolve
function PromiseAllSettled(promises: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        let completionPromiseCount = 0
        let result = []
        if (promises.length === 0) {
            resolve([]);
            return;
        }

        for (let i = 0; i < promises.length; i++) {
            promises[i].then((res) => {
                result[i] = res
                completionPromiseCount++
                if (completionPromiseCount === promises.length) {
                    resolve(result)
                }
            }).catch((err) => {
                result[i] = err
                completionPromiseCount++
                if (completionPromiseCount === promises.length) {
                    resolve(result)
                }
            })
        }   
    })   
}
// first success or failure
function PromiseRace(promises: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        }
    })
}
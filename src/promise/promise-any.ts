// first success
function PromiseAny(promises) {
    if (promises.length === 0) return Promise.reject("hjkkj");
    
    const errors = [];
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then((result) => {
                    resolve(result);  // First success wins
                })
                .catch((err) => {
                    errors[index] = err;
                    if (errors.length === promises.length) {
                        reject(errors);
                    }
                });
        });
    });
}

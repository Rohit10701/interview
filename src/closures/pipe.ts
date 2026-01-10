const pipeWrapper = () => {

const pipe = <T>(...fns: Array<(arg: T) => T>) => (x: T): T => fns.reduce((v, f) => f(v), x);

const add1 = (n: number) => n + 1;
const double = (n: number) => n * 2;

const result = pipe(add1, double)(5);

console.log({result})

}
export {pipeWrapper}
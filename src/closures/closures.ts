const closures = () => {
    const clourses = () => {
    let count = 0;
    const incremenet = () => count++;
    const decrement = () => count--;
    const getCount = () => count
    return { getCount, incremenet, decrement };
};
const { getCount, incremenet, decrement } = clourses();
console.log({ count : getCount() });
console.log("Incrementing by 1 ...", incremenet());
console.log({ count : getCount() });
console.log("Incrementing by 2 ...", incremenet(), incremenet());
console.log({ count : getCount() });
console.log("Decrementing by 1 ...", decrement());
console.log({ count : getCount() });
}
export {closures}
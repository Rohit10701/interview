/// <reference path="../global.d.ts" />

function show() {
    console.log(this)
}


(globalThis as unknown as GlobalThis).name = "samual";  

const obj = {
    name : "markus",
    get :  () => {
        return (this as unknown as GlobalThis).name;
    }
}

console.log((obj.get()))
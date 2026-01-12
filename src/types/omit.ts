type MyOmit<T, K extends keyof T> = {
    [key in Exclude<keyof T, K>]: T[key]
}

type PersonO = {
    name: string
    age: number
    location: string
}
type PersonNameO = MyOmit<PersonO, "name" | "age"> 
    
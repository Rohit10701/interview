type MyPick<T, K extends keyof T> = {
    [key in K]: T[key]
}

type Person = {
    name: string
    age: number
    location: string
}
type PersonName = MyPick<Person, "name">
    


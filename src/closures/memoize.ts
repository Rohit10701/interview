const memoize = () => {
	type FuncType<T> = (...args: T[]) => T

	const memo = <T>(fun: FuncType<T>) => {
		const cache = new Map<string, ReturnType<FuncType<T>>>()

		return (...args: T[]) => {
			const key = JSON.stringify(args)

			if (cache.has(key)) return cache.get(key)
			const value = fun(...args)
			cache.set(key, value)
			return value
		}
	}

	const expFun = (a: number, b: number) => a * b
	const calc = memo(expFun)(1, 2)
	console.log(calc)
}

export { memoize }

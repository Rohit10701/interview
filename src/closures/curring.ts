const curryWrapper = () => {
	const curry = (func: Function) => {
		return function curried(...args: any[]): any {
			if (args.length >= func.length) {
				return func.apply(null, args)
			}

			return (...nextArgs: any[]) => {
				return curried(...args.concat(nextArgs))
			}
		}
	}

	const add = (a: number, b: number, c: number) => a + b + c

	const curriedAdd = curry(add)
	const val = curriedAdd(1, 2)(3)

	console.log({ val }) // { val: 6 }

	const infiniteCurry = (fn: Function) => {
		const next = (...args: any[]) => {
			const cumulativeArgs = args
			const helper = (...nextArgs: any[]) => infiniteCurry(fn)(...cumulativeArgs, ...nextArgs)

			helper.valueOf = () => args.reduce((a, b) => a + b, 0)
			return helper
		}
		return next
	}

	const icurriedAdd = infiniteCurry(add)

	const ival = +icurriedAdd(1)(3, 5)(4)(5)
	console.log({ ival })

	function curriedAddS(a: any) {
		return function (b: any) {
			return function (c: any) {
				return a + b + c
			}
		}
	}
	console.log({ val: curriedAddS(1)(2) })

	function addr(a: number) {
		return (x?: number): any => {
			if (x === undefined) return a
			return addr(a + x)
		}
	}

	console.log({ vaddr: addr(1)(2)(5)() })

	function addr1(a: number) {
		return (...args: number[]): any => {
			if (args.length === 0) return a

			const sumOfArgs = args.reduce((acc, val) => acc + val, 0)

			return addr1(a + sumOfArgs)
		}
	}

	const val1 = addr1(1)(2, 4)(3)()

	console.log({ val1 })


    function logger(level : string){
        return (message : string) => `${level} => ${message}`
    }

    const debug = logger("DEBUG")
    const error = logger("ERROR")

    debug("Something seems wrong")
    error("Something went wrong")
}

export { curryWrapper }

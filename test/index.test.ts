import { describe, expect, expectTypeOf, it } from 'vitest'
import { resguard, resguardFn } from '../src'

describe('should', () => {
    it('be exported', () => {
        expect(resguard).toBeDefined()
    })

    it('return a guarded result as object', async () => {
        const result = await resguard(Promise.resolve(1))
        expect(result).toBeDefined()
        expect(result.data).toBe(1)
        expect(result.error).toBe(null)
        expectTypeOf(result.data).toEqualTypeOf<number | null>()
        expectTypeOf(result.error).toEqualTypeOf<Error | null>()
    })

    it('return a guarded result as object with error', async () => {
        const result = await resguard(Promise.reject(new Error('test')))
        expect(result).toBeDefined()
        expect(result.data).toBe(null)
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error?.message).toBe('test')
        expectTypeOf(result.data).toEqualTypeOf<null>()
        expectTypeOf(result.error).toEqualTypeOf<Error | null>()
    })

    it('return a guarded result as an tuple', async () => {
        const [[data, error]] = await resguard(Promise.resolve(1))
        expect(data).toBe(1)
        expect(error).toBe(null)
        expectTypeOf(data).toEqualTypeOf<number | null>()
    })

    it('return a guarded result as an tuple with error', async () => {
        const [[data, error]] = await resguard(Promise.reject(new Error('test')))
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('test')
        expectTypeOf(data).toEqualTypeOf<null>()
    })

    it('return a error with a overrided type', async () => {
        class CustomError extends Error {}
        const [[, error]] = await resguard(Promise.reject(new CustomError('test')), CustomError)
        expect(error).toBeInstanceOf(CustomError)
        expect(error?.message).toBe('test')
        expectTypeOf(error).toEqualTypeOf<CustomError | null>()
    })

    it('supports using a function instead of a promise', async () => {
        const [[data, error]] = resguard(() => 1)
        expect(data).toBe(1)
        expect(error).toBe(null)
        expectTypeOf(data).toEqualTypeOf<number | null>()
    })

    it('supports using a function instead of a promise with error', async () => {
        const [[data, error]] = resguard(() => {
            throw new Error('test')
        })
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('test')
        expectTypeOf(data).toEqualTypeOf<null>()
    })

    it('supports using a function instead of a promise with overrided error type', async () => {
        class CustomError extends Error {
            x = 1
            constructor(message: string) {
                super(message)
            }
        }

        const [[data, error]] = await resguard(async () => {
            throw new SyntaxError('test')
        }, SyntaxError)

        expect(error).not.toBeInstanceOf(CustomError)
        expect(error?.message).toBe('test')
        expectTypeOf(error).toEqualTypeOf<SyntaxError | null>()
    })

    it('supports using a function that returns a promise', async () => {
        const [[data, error]] = await resguard(async () => 1)
        expect(data).toBe(1)
        expect(error).toBe(null)
        expectTypeOf(data).toEqualTypeOf<number | null>()
    })

    it('supports using a function that returns a promise with error', async () => {
        const [[data, error]] = await resguard(async () => {
            throw new Error('test')
        })
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('test')
        expectTypeOf(data).toEqualTypeOf<null>()
    })

    it('supports using a function that returns a promise with overrided error type', async () => {
        class CustomError extends Error {}
        const [[, error]] = await resguard(async () => {
            throw new CustomError('test')
        }, CustomError)
        expect(error).toBeInstanceOf(CustomError)
        expect(error?.message).toBe('test')
        expectTypeOf(error).toEqualTypeOf<CustomError | null>()
    })

    it('support creating a resguarded function', async () => {
        const add = (a: number, b: number) => a + b
        const resguardedAdd = resguardFn(add)
        const { data, error } = resguardedAdd(1, 4)
        expect(data).toBe(5)
        expect(error).toBe(null)
    })

    it('support creating a resguarded function with error', async () => {
        const addOnlyEven = (a: number, b: number) => {
            if (a % 2 === 0 && b % 2 === 0)
                return a + b
            throw new Error('only even numbers')
        }
        const resguardedAdd = resguardFn(addOnlyEven)
        const { data, error } = resguardedAdd(1, 4)
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('only even numbers')
    })

    it('support creating a resguarded function with overrided error type', async () => {
        class CustomError extends Error {}
        const addOnlyEven = (a: number, b: number) => {
            if (a % 2 === 0 && b % 2 === 0)
                return a + b
            throw new CustomError('only even numbers')
        }
        const resguardedAdd = resguardFn(addOnlyEven, CustomError)
        const { data, error } = resguardedAdd(1, 4)

        expect(data).toBe(null)
        expect(error).toBeInstanceOf(CustomError)
        expect(error?.message).toBe('only even numbers')
    })

    it('support creating a resguarded async function', async () => {
        const asyncAdd = async (a: number, b: number) => new Promise<number>((resolve) => {
            setTimeout(() => resolve(a + b), 10)
        })
        const resguardedAdd = resguardFn(asyncAdd)
        const { data, error } = await resguardedAdd(1, 4)
        expect(data).toBe(5)
        expect(error).toBe(null)
    })

    it('support creating a resguarded async function with error', async () => {
        const asyncAddOnlyEven = async (a: number, b: number) => new Promise<number>((resolve, reject) => {
            setTimeout(() => {
                if (a % 2 === 0 && b % 2 === 0)
                    resolve(a + b)
                else
                    reject(new Error('only even numbers'))
            }, 10)
        })
        const resguardedAdd = resguardFn(asyncAddOnlyEven)
        const { data, error } = await resguardedAdd(1, 4)
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('only even numbers')
    })

    it('support creating a resguarded async function with overrided error type', async () => {
        class CustomError extends Error {}
        const asyncAddOnlyEven = async (a: number, b: number) => new Promise<number>((resolve, reject) => {
            setTimeout(() => {
                if (a % 2 === 0 && b % 2 === 0)
                    resolve(a + b)
                else
                    reject(new CustomError('only even numbers'))
            }, 10)
        })
        const resguardedAdd = resguardFn(asyncAddOnlyEven, CustomError)
        const { data, error } = await resguardedAdd(1, 4)
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(CustomError)
        expect(error?.message).toBe('only even numbers')
    })
})

describe('misc tests', () => {
    it('should work with json parsing', async () => {
        const result = resguard(() => {
            return JSON.parse('{"test": 1}')
        })
        expect(result.data).toEqual({ test: 1 })
        expect(result.error).toBe(null)
        if (!result.error)
            expectTypeOf(result.data).toEqualTypeOf<any>()
    })

    it('should work with json parsing with error', async () => {
        const result = resguard(() => {
            return JSON.parse('{test: 1}')
        })
        expect(result.data).toBe(null)
        expect(result.error).toBeInstanceOf(SyntaxError)
        expectTypeOf(result.data).toMatchTypeOf<null>()
    })

    it('should enable type override', async () => {
        let result = await resguard<{ test: number }>(() => {
            return JSON.parse('{test: 1}')
        }, SyntaxError)
        expect(result.data).toBe(null)
        expect(result.error).toBeInstanceOf(SyntaxError)
        if (result.data)
            expectTypeOf(result.data).toEqualTypeOf<{ test: number }>()
        else
            expectTypeOf(result.data).toMatchTypeOf<null>()

        result = await resguard<{ test: number }>(() => {
            return JSON.parse('{"test": 1}')
        })
        expect(result.data).toEqual({ test: 1 })
        expect(result.error).toBe(null)
        if (result.data)
            expectTypeOf(result.data).toEqualTypeOf<{ test: number }>()
        else
            expectTypeOf(result.data).toMatchTypeOf<null>()
    })

    it('should enable go-like error handling', async () => {
        let [[dataA, error]] = resguard(() => 1)
        expect(dataA).toBe(1)
        expect(error).toBe(null)
        expectTypeOf(dataA).toEqualTypeOf<number | null>()

        ;[[, error]] = await resguard<string>(() => {
            throw new Error('test')
        })
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('test')
    })

    it('should enable creating a resguarded json function', async () => {
        const safeParse = resguardFn(JSON.parse)
        const { data, error } = safeParse('{"test": 1}')
        expect(data).toEqual({ test: 1 })
        expect(error).toBe(null)
    })

    it('should carry types to the resguarded function', async () => {
        const resguardedConstFn = resguardFn(<T extends number[]>(arr: T) => arr.find(() => true))
        const { data } = resguardedConstFn([1])

        if (data !== null) {
            expect(data).toBe(1)
            expectTypeOf(data).toEqualTypeOf<number | undefined>()
        }
    })

    it('supports this random ass publish message function', async () => {
        const publishMessage = async () => {
            // It fails 20% of the time
            const failed = Math.random() * 100 + 1 <= 20
            if (failed)
                throw new Error('message failed')
            return { error: false, message: 'resguard is awesome' } as const
        }

        for (const _ of Array(100)) {
            const [[data, error]] = await resguard(publishMessage())

            if (error)
                expect(error.message).toBe('message failed')
            else
                expect(data?.error).toBe(false)
        }
    })
})

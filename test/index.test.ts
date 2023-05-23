import { describe, expect, expectTypeOf, it } from 'vitest'
import { resguard } from '../src'

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
        const [[data, error]] = await resguard(() => {
            throw new Error('test')
        })
        expect(data).toBe(null)
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toBe('test')
        expectTypeOf(data).toEqualTypeOf<unknown>()
    })

    it('supports using a function instead of a promise with overrided error type', async () => {
        class CustomError extends Error {}
        const [[, error]] = await resguard(() => {
            throw new CustomError('test')
        }, CustomError)
        expect(error).toBeInstanceOf(CustomError)
        expect(error?.message).toBe('test')
        expectTypeOf(error).toEqualTypeOf<CustomError | null>()
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
})

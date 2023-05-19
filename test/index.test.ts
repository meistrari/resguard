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
})

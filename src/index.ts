type IsFunctionReturnTypePromise<T extends (...args: any[]) => any> =
    ReturnType<T> extends Promise<infer U> ? true : false

type ExactReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never
class TryResult<T, E extends Error | null> {
    private [Symbol.iterator] = function* (): IterableIterator<[T | null, E | null]> {
        yield [this.data, this.error]
    }

    public data: T | null
    public error: E | null

    constructor(data: T, error: E | null) {
        this.data = data
        this.error = error
    }
}

type ErrorClass = new (...args: any[]) => Error

export function resguard<T, E extends ErrorClass = ErrorClass>(
    func: () => Promise<T>,
    _errorType?: E,
): Promise<TryResult<T | null, InstanceType<E> | null>>
export function resguard<T, E extends ErrorClass = ErrorClass>(
    func: () => T,
    _errorType?: E,
): TryResult<T | null, InstanceType<E> | null>
export function resguard<T, E extends ErrorClass = ErrorClass>(
    promise: Promise<T>,
    _errorType?: E,
): Promise<TryResult<T | null, InstanceType<E> | null>>

export function resguard<T, E extends ErrorClass = ErrorClass>(
    promiseOrFunction: (() => (T | Promise<T>)) | Promise<T>,
    _errorType?: E,
): TryResult<T | null, InstanceType<E> | null> | Promise<TryResult<T | null, InstanceType<E> | null>> {
    try {
        if (promiseOrFunction instanceof Promise) {
            return promiseOrFunction
                .then(data => new TryResult(data, null))
                .catch(e => new TryResult(null, e as InstanceType<E>))
        }
        else {
            const result = promiseOrFunction()
            if (result instanceof Promise) {
                return result
                    .then(data => new TryResult(data, null))
                    .catch(e => new TryResult(null, e as InstanceType<E>))
            }
            else {
                return new TryResult(result, null)
            }
        }
    }
    catch (e) {
        return new TryResult(null, e as InstanceType<E>)
    }
}

export function resguardFn<T extends (...args: any[]) => any, E extends ErrorClass = ErrorClass, U = any>(
    func: T,
    _errorType?: E,
): (...args: Parameters<T>) =>
    IsFunctionReturnTypePromise<T> extends true
        ? ReturnType<T> extends Promise<infer U>
            ? Promise<TryResult<U, InstanceType<E> | null>>
            : never
        : TryResult<ExactReturnType<T>, InstanceType<E> | null> {
    const resguarded = (...argumentList: Parameters<T>) => {
        const result = resguard(() => func(...argumentList))
        return result
    }

    return resguarded as (
        ...args: Parameters<T>
    ) => IsFunctionReturnTypePromise<T> extends true
        ? ReturnType<T> extends Promise<infer U>
            ? Promise<TryResult<U, InstanceType<E> | null>>
            : never
        : TryResult<ExactReturnType<T>, InstanceType<E> | null>
}

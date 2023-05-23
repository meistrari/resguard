class TryResult<T extends any | null, E extends Error | null> {
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

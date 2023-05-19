class TryResult<T extends any | null, E extends Error | null> {
    private [Symbol.iterator] = function* (): IterableIterator<[T | null, E | null]> {
        yield [this.data, this.error]
    }

    public data: T | null
    public error: Error | null

    constructor(data: T, error: E | null) {
        this.data = data
        this.error = error
    }
}

export async function resguard<T, E extends ErrorClass = ErrorClass>(
    promiseOrFunction: Promise<T> | (() => (T | Promise<T>)),
    _errorType?: E,
): Promise<TryResult<(T | null), InstanceType<E> | null>> {
    try {
        if (typeof promiseOrFunction === 'function') {
            const result = promiseOrFunction()
            if (result instanceof Promise)
                return new TryResult(await result, null)
            else
                return new TryResult(result, null)
        }
        else {
            return new TryResult(await promiseOrFunction, null)
        }
    }
    catch (e: any) {
        return new TryResult(null, e as InstanceType<E>)
    }
}

type ErrorClass = new (...args: any[]) => Error

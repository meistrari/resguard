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

export async function resguard<T, E extends ErrorClass>(
    promise: Promise<T> | (() => T),
    _errorType?: E,
): Promise<TryResult<T | null, InstanceType<E> | null>> {
    try {
        if (typeof promise === 'function')
            return new TryResult(promise(), null)

        else
            return new TryResult(await promise, null)
    }
    catch (e: any) {
        return new TryResult(null, e as InstanceType<E>)
    }
}

type ErrorClass = new (...args: any[]) => Error

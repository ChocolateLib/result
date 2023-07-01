
interface ResultBase<T, E> {
    readonly valid: boolean;
    readonly ok: boolean;
    readonly err: boolean;
    readonly value?: T;
    readonly error?: E;
}

class ResultValid<T> implements ResultBase<T, never> {
    readonly value: T
    constructor(value: T) { this.value = value; }
    get valid(): true { return true }
    get ok(): true { return true }
    get err(): false { return false }
}

class ResultError<E> implements ResultBase<never, E> {
    readonly error: E
    #stack: string | undefined = new Error().stack;
    constructor(error: E) { this.error = error; }
    get valid(): false { return false }
    get ok(): false { return false }
    get err(): true { return true }
}

type Result<T, E> = ResultValid<T> | ResultError<E>;

type ResultExecutor<T, E> = (valid: (value: ResultValid<T>) => void, error: (error: ResultError<E>) => void) => void;

class ResultAsync<T, E> extends Promise<Result<T, E>> {
    constructor(executor: ResultExecutor<T, E>) {
        super(executor)
    }
}

let test1 = (): Result<number, string> => {
    if (Math.random() > 0.5) {
        return new ResultValid(789);
    } else {
        return new ResultError('Fail');
    }
}
let yo1 = test1()

let test2 = (): ResultAsync<number, string> => {
    return new ResultAsync((valid, error) => {
        if (Math.random() > 0.5) {
            valid(new ResultValid(789));
        } else {
            error(new ResultError('Fail'));
        }
    });
}
let yo2 = test2();
(async () => {
    let yo3 = await yo2;

})()

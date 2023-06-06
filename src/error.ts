import { Result } from "./index";
import { ResultBase } from "./base";

export class ResultError<E> implements ResultBase<never, E> {
    get valid(): false { return false }
    readonly error: E
    #stack: string | undefined = new Error().stack;

    constructor(error: E) {
        this.error = error;
    }

    expect(msg: string): never {
        throw new Error(msg);
    }

    expectErr(): E {
        return this.error
    }

    unwrap(): never {
        throw new Error('Tried to unwrap Error\nOriginal ' + this.#stack + '\n Unwrap Error');
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }
}

export interface ResultErrorInterface<T> extends ResultBase<never, T> {
    readonly valid: false;
    readonly error: T
}
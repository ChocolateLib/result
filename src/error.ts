import { Optional, Result } from "./index";
import { OptionalBase, ResultBase } from "./base";
import { OptionalSome, ResultValid } from "./valid";

export class ResultError<E> implements ResultBase<never, E> {
    readonly error: E
    #stack: string | undefined = new Error().stack;

    constructor(error: E) {
        this.error = error;
    }

    get valid(): false {
        return false
    }
    get ok(): false {
        return false
    }
    get err(): true {
        return true
    }

    expect(msg: string): never {
        throw new Error(msg + '\nOriginal ' + this.#stack + '\nExpect Error');
    }

    expectErr(): E {
        return this.error
    }

    unwrap(): never {
        throw new Error('Tried to unwrap Error\nOriginal ' + this.#stack + '\nUnwrap Error');
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }

    andThen(): ResultError<E> {
        return this;
    }
    async andThenAsync(): Promise<ResultError<E>> {
        return this;
    }

    orElse<T2>(mapper: (error: E) => ResultValid<T2>): ResultValid<T2>;
    orElse<E2>(mapper: (error: E) => ResultError<E2>): ResultError<E2>;
    orElse<T2, E2>(mapper: (error: E) => Result<T2, E2>): Result<T2, E2> {
        return mapper(this.error);
    }
    orElseAsync<T2>(mapper: (error: E) => Promise<ResultValid<T2>>): Promise<Result<T2, E>>;
    orElseAsync<E2>(mapper: (error: E) => Promise<ResultError<E2>>): Promise<ResultError<E2>>;
    orElseAsync<T2, E2>(mapper: (error: E) => Promise<Result<T2, E2>>): Promise<Result<T2, E2>> {
        return mapper(this.error);
    }

    map(): ResultError<E> {
        return this
    }
    async mapAsync(): Promise<ResultError<E>> {
        return this
    }

    mapErr<F>(mapper: (error: E) => F): ResultError<F> {
        return new ResultError(mapper(this.error));
    }
    async mapErrAsync<F>(mapper: (error: E) => Promise<F>): Promise<ResultError<F>> {
        return new ResultError(await mapper(this.error));
    }

    toOptional(): OptionalNone {
        return new OptionalNone();
    }

    /**Returns the stored stack string to the error*/
    get stack(): string | undefined {
        return this.#stack;
    }
}

export class OptionalNone implements OptionalBase<never> {
    get valid(): false {
        return false
    }
    get some(): false {
        return false
    }
    get none(): true {
        return true
    }

    expect(msg: string): never {
        throw new Error(msg);
    }

    unwrap(): never {
        throw new Error(`Tried to unwrap None`);
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }

    andThen(): OptionalNone {
        return this;
    }
    async andThenAsync(): Promise<OptionalNone> {
        return this;
    }

    orElse<T2>(mapper: () => OptionalSome<T2>): OptionalSome<T2>;
    orElse(mapper: () => OptionalNone): OptionalNone;
    orElse<T2>(mapper: () => Optional<T2>): Optional<T2> {
        return mapper();
    }
    orElseAsync<T2>(mapper: () => Promise<OptionalSome<T2>>): Promise<OptionalSome<T2>>;
    orElseAsync(mapper: () => Promise<OptionalNone>): Promise<OptionalNone>;
    orElseAsync<T2>(mapper: () => Promise<Optional<T2>>): Promise<Optional<T2>> {
        return mapper();
    }

    map(): OptionalNone {
        return this;
    }
    async mapAsync(): Promise<OptionalNone> {
        return this;
    }

    toResult<E>(error: E): ResultError<E> {
        return new ResultError(error)
    }
}

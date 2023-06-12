import { Optional, Result } from "./index";
import { OptionalNone, ResultError } from "./error";
import { OptionalBase, ResultBase } from "./base";

export class ResultValid<T> implements ResultBase<T, never> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }

    get valid(): true {
        return true
    }
    get ok(): true {
        return true
    }
    get err(): false {
        return false
    }

    expect(): T {
        return this.value
    }

    expectErr(msg: string): never {
        throw new Error(msg);
    }

    unwrap(): T {
        return this.value
    }

    unwrapOr(): T {
        return this.value
    }

    andThen<T2>(mapper: (value: T) => ResultValid<T2>): ResultValid<T2>;
    andThen<E2>(mapper: (value: T) => ResultError<E2>): ResultError<E2>;
    andThen<T2, E2>(mapper: (value: T) => Result<T2, E2>): Result<T2, E2> {
        return mapper(this.value);
    }
    andThenAsync<T2>(mapper: (value: T) => Promise<ResultValid<T2>>): Promise<ResultValid<T2>>;
    andThenAsync<E2>(mapper: (value: T) => Promise<ResultError<E2>>): Promise<ResultError<E2>>;
    andThenAsync<T2, E2>(mapper: (value: T) => Promise<Result<T2, E2>>): Promise<Result<T2, E2>> {
        return mapper(this.value);
    }

    orElse(): ResultValid<T> {
        return this;
    }
    async orElseAsync(): Promise<ResultValid<T>> {
        return this;
    }

    map<U>(func: (value: T) => U): ResultValid<U> {
        return new ResultValid(func(this.value));
    }
    async mapAsync<U>(func: (value: T) => Promise<U>): Promise<ResultValid<U>> {
        return new ResultValid(await func(this.value));
    }

    mapErr(): ResultValid<T> {
        return this
    }
    async mapErrAsync(): Promise<ResultValid<T>> {
        return this
    }

    toOptional(): OptionalSome<T> {
        return new OptionalSome(this.value);
    }

    /**Returns the contained valid value, but never throws.
     * Unlike `unwrap()`, this method doesn't throw and is only callable on an Ok<T>
     * Therefore, it can be used instead of `unwrap()` as a maintainability safeguard
     * that will fail to compile if the error type of the Result is later changed to an error that can actually occur.*/
    safeUnwrap(): T {
        return this.value
    }
}

export class OptionalSome<T> implements OptionalBase<T> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }
    get valid(): true {
        return true
    }
    get some(): true {
        return true
    }
    get none(): false {
        return false
    }

    expect(): T {
        return this.value;
    }

    unwrap(): T {
        return this.value;
    }

    unwrapOr(): T {
        return this.value;
    }

    andThen<T2>(mapper: (value: T) => OptionalSome<T2>): OptionalSome<T2>;
    andThen(mapper: (value: T) => OptionalNone): OptionalNone;
    andThen<T2>(mapper: (value: T) => Optional<T2>): Optional<T2> {
        return mapper(this.value);
    }
    andThenAsync<T2>(mapper: (value: T) => Promise<OptionalSome<T2>>): Promise<OptionalSome<T2>>;
    andThenAsync(mapper: (value: T) => Promise<OptionalNone>): Promise<OptionalNone>;
    andThenAsync<T2>(mapper: (value: T) => Promise<Optional<T2>>): Promise<Optional<T2>> {
        return mapper(this.value);
    }

    orElse(): OptionalSome<T> {
        return this;
    }
    async orElseAsync(): Promise<OptionalSome<T>> {
        return this;
    }

    map<U>(mapper: (value: T) => U): OptionalSome<U> {
        return new OptionalSome(mapper(this.value))
    }
    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<OptionalSome<U>> {
        return new OptionalSome(await mapper(this.value))
    }

    toResult(): ResultValid<T> {
        return new ResultValid(this.value)
    }
}
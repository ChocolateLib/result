import { Optional, Result } from "./index";
import { ResultErrorClass } from "./error";
import { OptionalBase, ResultBase } from "./base";

export class ResultValidClass<T> implements ResultBase<T, never> {
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

    andThen<T2>(mapper: (value: T) => ResultValidClass<T2>): ResultValidClass<T2>;
    andThen<E2>(mapper: (value: T) => ResultErrorClass<E2>): Result<T, E2>;
    andThen<T2, E2>(mapper: (value: T) => Result<T2, E2>): Result<T2, E2> {
        return mapper(this.value);
    }
    andThenAsync<T2>(mapper: (value: T) => Promise<ResultValidClass<T2>>): Promise<ResultValidClass<T2>>;
    andThenAsync<E2>(mapper: (value: T) => Promise<ResultErrorClass<E2>>): Promise<Result<T, E2>>;
    andThenAsync<T2, E2>(mapper: (value: T) => Promise<Result<T2, E2>>): Promise<Result<T2, E2>> {
        return mapper(this.value);
    }

    orElse(_mapper: unknown): ResultValidClass<T> {
        return this;
    }
    async orElseAsync(_mapper: unknown): Promise<ResultValidClass<T>> {
        return this;
    }

    map<U>(func: (value: T) => U): ResultValidClass<U> {
        return new ResultValidClass(func(this.value));
    }
    async mapAsync<U>(func: (value: T) => Promise<U>): Promise<ResultValidClass<U>> {
        return new ResultValidClass(await func(this.value));
    }

    mapErr(_mapper: unknown): ResultValidClass<T> {
        return this
    }
    async mapErrAsync(_mapper: unknown): Promise<ResultValidClass<T>> {
        return this
    }

    toOptional(): OptionalSomeClass<T> {
        return new OptionalSomeClass(this.value);
    }

    /**Returns the contained valid value, but never throws.
     * Unlike `unwrap()`, this method doesn't throw and is only callable on an Ok<T>
     * Therefore, it can be used instead of `unwrap()` as a maintainability safeguard
     * that will fail to compile if the error type of the Result is later changed to an error that can actually occur.*/
    safeUnwrap(): T {
        return this.value
    }
}

export class OptionalSomeClass<T> implements OptionalBase<T> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
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

    andThen<T2>(mapper: (value: T) => Optional<T2>): Optional<T2> {
        return mapper(this.value);
    }
    andThenAsync<T2>(mapper: (value: T) => Promise<Optional<T2>>): Promise<Optional<T2>> {
        return mapper(this.value);
    }
    orElse(_mapper: unknown): OptionalSomeClass<T> {
        return this;
    }
    async orElseAsync(_mapper: unknown): Promise<OptionalSomeClass<T>> {
        return this;
    }

    map<U>(mapper: (value: T) => U): OptionalSomeClass<U> {
        return new OptionalSomeClass(mapper(this.value))
    }
    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<OptionalSomeClass<U>> {
        return new OptionalSomeClass(await mapper(this.value))
    }

    toResult(): ResultValidClass<T> {
        return new ResultValidClass(this.value)
    }
}
import { Optional, Result } from "./index";
import { OptionalBase, ResultBase } from "./base";
import { ResultValidClass } from "./valid";

export class ResultErrorClass<E> implements ResultBase<never, E> {
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

    andThen(_mapper: unknown): ResultErrorClass<E> {
        return this;
    }
    async andThenAsync(_mapper: unknown): Promise<ResultErrorClass<E>> {
        return this;
    }

    orElse<T2>(mapper: (error: E) => ResultValidClass<T2>): ResultValidClass<T2>;
    orElse<E2>(mapper: (error: E) => ResultErrorClass<E2>): ResultErrorClass<E2>;
    orElse<T2, E2>(mapper: (error: E) => Result<T2, E2>): Result<T2, E2> {
        return mapper(this.error);
    }
    orElseAsync<T2>(mapper: (error: E) => Promise<ResultValidClass<T2>>): Promise<Result<T2, E>>;
    orElseAsync<E2>(mapper: (error: E) => Promise<ResultErrorClass<E2>>): Promise<ResultErrorClass<E2>>;
    orElseAsync<T2, E2>(mapper: (error: E) => Promise<Result<T2, E2>>): Promise<Result<T2, E2>> {
        return mapper(this.error);
    }

    map(_mapper: unknown): ResultErrorClass<E> {
        return this
    }
    async mapAsync(_mapper: unknown): Promise<ResultErrorClass<E>> {
        return this
    }

    mapErr<F>(mapper: (error: E) => F): ResultErrorClass<F> {
        return new ResultErrorClass(mapper(this.error));
    }
    async mapErrAsync<F>(mapper: (error: E) => Promise<F>): Promise<ResultErrorClass<F>> {
        return new ResultErrorClass(await mapper(this.error));
    }

    toOptional(): OptionalNoneClass {
        return new OptionalNoneClass();
    }

    /**Returns the stored stack string to the error*/
    get stack(): string | undefined {
        return this.#stack;
    }
}

export class OptionalNoneClass implements OptionalBase<never> {
    get some(): false { return false }
    get none(): true { return true }

    expect(msg: string): never {
        throw new Error(msg);
    }

    unwrap(): never {
        throw new Error(`Tried to unwrap None`);
    }

    unwrapOr<T2>(val: T2): T2 {
        return val
    }

    andThen(_mapper: unknown): OptionalNoneClass {
        return this;
    }
    async andThenAsync(_mapper: unknown): Promise<OptionalNoneClass> {
        return this;
    }

    // orElse<T2>(mapper: () => Optional<T2>): Optional<T2> {
    //     return mapper();
    // }
    // orElseAsync<T2>(mapper: () => Promise<Optional<T2>>): Promise<Optional<T2>> {
    //     return mapper();
    // }

    map(_mapper: unknown): OptionalNoneClass {
        return this;
    }
    async mapAsync(_mapper: unknown): Promise<OptionalNoneClass> {
        return this;
    }

    toResult<E>(error: E): ResultErrorClass<E> {
        return new ResultErrorClass(error)
    }
}

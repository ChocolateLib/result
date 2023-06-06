import { Result } from "./index";
import { ResultBase } from "./base";

export class ResultValid<T> implements ResultBase<T, never> {
    get valid(): true { return true }
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }

    expect(): T { return this.value }

    expectErr(msg: string): never { throw new Error(msg); }

    unwrap(): T { return this.value }

    unwrapOr(): T { return this.value }
}

export interface ResultValidInterface<T> extends ResultBase<T, never> {
    readonly valid: true;
    readonly value: T;
}
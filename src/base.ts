import { Result } from "./index";

export interface ResultBase<T, E> {
    /**Is true when the result is valid and false when it is  */
    readonly valid: boolean;
    readonly value?: T;
    readonly error?: E;

    /**Returns the contained valid value, if exists.  Throws an error if not.
     * @param msg the message to throw if the value is invalid.*/
    expect(msg: string): T;

    /**Returns the contained valid value, if does not exist.  Throws an error if it does.
     * @param msg the message to throw if the value is valid.*/
    expectErr(msg: string): E;

    /**Returns the contained valid value.
     * Throws if the value is invalid, with a message provided by the error's value.*/
    unwrap(): T;

    /**Returns the contained valid value or a provided default.*/
    unwrapOr<T2>(val: T2): T | T2;
}
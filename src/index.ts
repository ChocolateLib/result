import { ResultValidClass, OptionalSomeClass } from "./valid";
import { ResultErrorClass, OptionalNoneClass } from "./error";

export type Result<T, E> = ResultValidClass<T> | ResultErrorClass<E>;
export type Optional<T> = OptionalSomeClass<T> | OptionalNoneClass;
export type ResultOrOptional<T> = Omit<Result<T, never>, 'andThen'> | Optional<T>;

export function ResultValid<T>(value: T) { return new ResultValidClass<T>(value) }
export function ResultError<E>(error: E) { return new ResultErrorClass<E>(error) }
export function OptionalSome<T>(value: T) { return new OptionalSomeClass<T>(value) }
export function OptionalNone() { return new OptionalNoneClass() }

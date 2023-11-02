import { ResultValid as ResultValid, OptionalSome as OptionalSome } from "./valid";
import { ResultError as ResultError, OptionalNone as OptionalNone } from "./error";

export type Result<T, E = T> = ResultValid<T> | ResultError<E>;
export type Optional<T> = OptionalSome<T> | OptionalNone;
export type ResultOrOptional<T> = Omit<Result<T, never>, 'andThen'> | Optional<T>;

export function Valid<T>(value: T) { return new ResultValid<T>(value) }
export function Error<E>(error: E) { return new ResultError<E>(error) }
export function Some<T>(value: T) { return new OptionalSome<T>(value) }
export function None() { return new OptionalNone() }

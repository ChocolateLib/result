import { ResultError, ResultErrorInterface } from "./error";
import { ResultValid, ResultValidInterface } from "./valid";

export type Result<T, E> = ResultValidInterface<T> | ResultErrorInterface<E>;
export { ResultError, ResultValid }
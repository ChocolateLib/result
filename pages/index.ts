import { Result, ResultError, ResultValid } from "../src"


let test = ResultValid(5) as Result<number, string>;
let test2 = test.andThen((value) => {
    return ResultValid(6);
})
let test3 = test.orElse((errer) => {
    return ResultError(5)
})

console.log((await test2).unwrap());


let test5 = await Promise.race([fetch('URL'), new Promise((a) => { setTimeout(a, 3000, false) })])
import { Result, Error, Valid } from "../src"


let test = Valid(5) as Result<number, string>;
let test2 = test.andThen((value) => {
    return Valid(6);
})
let test3 = test.map((errer) => {
    return Error(5)
})

console.log((await test2).unwrap());


let test5 = await Promise.race([fetch('URL'), new Promise((a) => { setTimeout(a, 3000, false) })])
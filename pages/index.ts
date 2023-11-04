import { Result, Err, Ok } from "../src"
import { ResultBase } from "../src/base";

function test(): Result<number, boolean> {
    if (Math.random()) {
        return Ok(5);
    } else {
        return Err(false);
    }
}

let test2 = test();

let test3 = test2.andThen((val) => {
    return Err('10');
})
console.log(test2);

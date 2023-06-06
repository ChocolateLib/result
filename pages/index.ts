import { Result, ResultError, ResultValid } from "../src"

function test1(select: boolean): Result<string, number> {
    if (select) {
        return new ResultValid('Testing attention please');
    } else {
        return new ResultError(6);
    }
}

let test2 = test1(false);
console.log(test2);
try {
    console.log(test2.unwrap());
} catch (error) {
    console.log(error);
}

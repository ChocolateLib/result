import { Result, Error, Valid } from "../src"
import { ResultBase } from "../src/base";

// class ResultAsync2<T, E> {
//     promise: Promise<T> | 

// }

// function ResultAsync<T, E>(executor: (valid: () => T, error: () => E) => void) {
//     return new ResultAsync2
// }

class yoyoyo extends HTMLElement {
    constructor(parameters) {
        super()
        this.appendChild(document.createTextNode(parameters))
    }
}
customElements.define('yoyo-yoyo', yoyoyo);

let asfd = document.createElement('ul');

document.body.appendChild(asfd);

for (let i = 0; i < 9999; i++) {
    asfd.appendChild(new yoyoyo(i))
}


// function getOnlineData(url: string): ResultAsync2<number, string> {
//     return new Promise(async (valid, error) => {

//     })
// }




// //Declaring a function which returns a Result, (the getFile function is just pseudocode)
// function getData(path: string): Result<string> {
//     let file = getFile(path);
//     if (file) {
//         return Valid(file.content() as string);
//     } else {
//         return Error("File doesn't exist");
//     }
// }
// //The function returns the content of the file as a Result
// //The map method is then called, which only runs when the result is valid, which parses the file content as JSON

// let asdf = (value: string): Result<{}, string> => {
//     try {
//         return Valid(JSON.parse(value) as {});
//     } catch (error) {
//         return Error('File could not be parsed as JSON');
//     }
// }

// let test = getData('Sample URL').andThen(asdf);


// //Declaring a function which returns a Result
// async function getOnlineData(url: string): Promise<Result<Response, string>> {
//     let data = await Promise.race([fetch(url), new Promise((a) => { setTimeout(a, 3000, false) })])
//     if (data === false) {
//         return Error("Data timeout");
//     } else {
//         return Valid(data as any);
//     }
// }
// //Calling the function, then acting on the result
// (await getOnlineData('Sample URL')).andThenAsync(async (value) => {
//     console.log(value.text);
//     return Valid(5)
// });
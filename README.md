# Result
Result handling system based loosly on rusts result handling system.

# General Concept
There library contains two basic types, Result and Optional.  
Result is used for a function which would normally have to throw to indicate that it failed.  
Optional is uded for a function which can have no result.

The example for Result is a function which retreives some data from the internet, if there is a internet connection failure, it will return the error instead of throwing.
The example for Optional is a function which  

# Usage
The state is a medium which allows passing a value with a guarentee of updates for future changes. This is done by passing a reference to the state to where it is needed.

    //Declaring a function which only accepts a state with a number type.
    //StateRead is used because the function is only reading the state value.
    async function logStateValue(state:StateRead<number>){
        console.log(await state);
    }
    logStateValue(new State(1));
    //Expected log output is 1


# Changelog
* ## 0.0.1
Initial Version
# State
Framework for storing async states in the system, and subscribing to the state.
State refers to the state container, while value refers to the actual value of the state.

# General Concept
The state system is devided into two contexts, the owner and the user context. 

The owner of the state can change the value of the state, the user can read the value of the state, and can request the owner to change the state value.

The most important part are the two user context interfaces StateRead and StateWrite.

StateRead gives the user access to the current value as well as subscribing to any future changes to the state value.

StateWrite gives the user access to requesting changes to the state value, and some methods to allow checking any given limits for the value.

Any object which implements StateRead and StateWrite correctly are compatible with the state system, it is also allowed to only implement StateRead.

# State Usage
The state is a medium which allows passing a value with a guarentee of updates for future changes. This is done by passing a reference to the state to where it is needed.

    //Declaring a function which only accepts a state with a number type.
    //StateRead is used because the function is only reading the state value.
    async function logStateValue(state:StateRead<number>){
        console.log(await state);
    }
    logStateValue(new State(1));
    //Expected log output is 1

You may have noticed that the function is async, that is because all states are async to make state which hold value not immediatly accessible possible. (Think a state which fetches some data when you try to access the states value)  
The reason you can simply await the state is because the state implements the then method as part of the StateRead interface.

    //Declaring a function which subscribes to a state.
    function subscribeToStateValue(state:StateRead<number>){
        state.subscribe((value) => {
            console.log(value);
        });
    }
    let state = new State(1);
    subscribeToStateValue(state);
    state.set(2);
    //Expected log output is 2

It is also possible to immediately invoke the function as you subscribe

    //Declaring a function which subscribes to a state.
    function subscribeToStateValue(state:StateRead<number>){
        state.subscribe((value) => {
            console.log(value);
        },true);
    }
    let state = new State(1);
    subscribeToStateValue(state);
    //Expected log output is 1

To request a change to the state, the user context uses the write method on the StateWrite interface, notice that StateRead methods are still available as it inherits from StateRead.

    //Declaring a function which subscribes to a state.
    async function changeStateValue(state:StateWrite<number>){
        state.write(1);
        console.log(await state);
    }
    let state = new State(1,true);
    changeStateValue(state);
    //Expected log output is 1

StateWrite has two other methods, which states must implement, check and limit.

The check method takes a value and returns a string description of what is wrong with the given value, or undefined if it is valid.

    //Example with a number type state which limits it's value to 500; 
    console.log(state.check(999));
    //Expected log output is "999 is bigger than the limit of 500"
   
The limit method takes a value and returns the closest valid value to it, if possible.

    //Example with a number type state which limits it's value to 500; 
    console.log(state.limit(999));
    //Expected log output is 500

States can also implement relations, via the related map

    //Example with a number state relating to a state containing the unit for the numbe
    let unitState = new State("km/h");
    let state = new State(1, undefined, undefined, undefined, () => ({ unit: unitState }));
    let unit = state.related()?.unit;
    console.log(await unit);
    //Expected log output is "km/h"

# State Implementation



# State Types

The library comes with a variety of state types to make using the system easier.
## State
The State class is the most basic state type, you can create a state by instanciating the state Class, the state can hold a value of any type, and by default is read only.

    //Creates a state
    let state = new State(0);
    //Owner can always set value of state
    state.set(1);



# Changelog
* ## 0.1.0
Added Array container state and Object container state
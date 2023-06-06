/// <reference types="cypress" />
import { StateObject } from "../../src"

describe('Initial state', function () {
    it('Creating a state with no initial value', async function () {
        let state = new StateObject({});
        expect(await state).deep.equal({});
    });
    it('Creating a state with initial value', async function () {
        let state = new StateObject({ banan: 2 });
        expect(await state).deep.equal({ banan: 2 });
    });
});

describe('Setting state value', function () {
    it('From owner context', async function () {
        let state = new StateObject({ banan: 2 });
        expect(await state).deep.equal({ banan: 2 });
        state.set({ banan: 4 })
        expect(await state).deep.equal({ banan: 4 });
    });
    it('From user context with no setter function', async function () {
        let state = new StateObject({ banan: 2 });
        expect(await state).deep.equal({ banan: 2 });
        state.write({ banan: 4 })
        expect(await state).deep.equal({ banan: 2 });
    });
    it('From user context with standard setter function', async function () {
        let state = new StateObject({ banan: 2 }, true);
        expect(await state).deep.equal({ banan: 2 });
        state.set({ banan: 4 })
        expect(await state).deep.equal({ banan: 4 });
    });
    it('From user context with custom function', async function () {
        let state = new StateObject({ banan: 2 }, (val, state) => { state.set({ banan: val.banan * 2 }); });
        expect(await state).deep.equal({ banan: 2 });
        state.write({ banan: 4 })
        expect(await state).deep.equal({ banan: 8 });
    });
});

describe('Getting state value', async function () {
    it('Using await', async function () {
        let state = new StateObject({ banan: 2 });
        expect(await state).deep.equal({ banan: 2 });
    });
    it('Using then', function (done) {
        let state = new StateObject({ banan: 2 });
        state.then((val) => {
            expect(val).deep.equal({ banan: 2 });
            done()
        })
    });
    it('Using then with chaining return', function (done) {
        let state = new StateObject({ banan: 2 });
        state.then((val) => {
            expect(val).deep.equal({ banan: 2 });
            return 8;
        }).then((val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with chaining throw', function (done) {
        let state = new StateObject({ banan: 2 });
        state.then((val) => {
            expect(val).deep.equal({ banan: 2 });
            throw 8;
        }).then(() => { }, (val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with async chaining return', function (done) {
        let state = new StateObject({ banan: 2 });
        state.then(async (val) => {
            await new Promise((a) => { setTimeout(a, 10) });
            expect(val).deep.equal({ banan: 2 });
            return 8;
        }).then((val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with async chaining throw', function (done) {
        let state = new StateObject({ banan: 2 });
        state.then(async (val) => {
            await new Promise((a) => { setTimeout(a, 10) });
            expect(val).deep.equal({ banan: 2 });
            throw 8;
        }).then(() => { }, (val) => {
            expect(val).equal(8);
            done()
        })
    });
});


describe('Value subscriber', function () {
    it('Add one subscribers with update set true', function () {
        let state = new StateObject({ banan: 2 });
        state.subscribe((value) => { }, true);
    });
    it('Add one subscribers with update set true', function () {
        let state = new StateObject({ banan: 2 });
        let value;
        state.subscribe((value2) => {
            value = value2;
        }, true);
        expect(value).deep.equal({ banan: 2 });
    });
    it('Add two subscribers with update set true', async function () {
        let state = new StateObject({ banan: 2 });
        let values = await Promise.all([
            new Promise<Readonly<{ banan: number }>>((a) => { state.subscribe(a, true) }),
            new Promise<Readonly<{ banan: number }>>((a) => { state.subscribe(a, true) }),
        ])
        expect(values).deep.equal([{ banan: 2 }, { banan: 2 }]);
    });
    it('Insert two subscribers then remove first subscribers', function (done) {
        let state = new StateObject({ banan: 2 });
        let func = state.subscribe(() => { }, true);
        state.subscribe(() => { done() }, false);
        expect(state.inUse()).deep.equal(true);
        state.unsubscribe(func);
        expect(state.inUse()).deep.equal(true);
        state.set({ banan: 4 })
    });
    it('Insert two subscribers then removeing both subscribers', function (done) {
        let state = new StateObject({ banan: 2 });
        let sum = 0
        let func1 = state.subscribe(() => { done('Should not be called') }, false);
        let func2 = state.subscribe(() => { done('Should not be called') }, false);
        expect(state.inUse()).deep.equal(true);
        state.unsubscribe(func1);
        state.unsubscribe(func2);
        expect(state.inUse()).deep.equal(false);
        state.set({ banan: 4 })
        done();
    });
    it('Setting value with one subscribers', function (done) {
        let state = new StateObject({ banan: 2 });
        state.subscribe((val) => { done() }, false);
        state.set({ banan: 10 })
    });
    it('Setting value with multiple subscribers', async function () {
        let state = new StateObject({ banan: 2 });
        let sum = 0
        state.subscribe((val) => { sum += val.banan }, true)
        state.subscribe((val) => { sum += val.banan }, true)
        state.subscribe((val) => { sum += val.banan }, true)
        state.set({ banan: 10 })
        expect(sum).equal(36);
    });
    it('Setting value with subscribers with exception', function () {
        let state = new StateObject({ banan: 2 });
        state.subscribe((val) => { throw false }, false);
        state.set({ banan: 10 })
    });
});
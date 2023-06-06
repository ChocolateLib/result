/// <reference types="cypress" />
import { StateArray, StateArrayUpdateMeta } from "../../src"

describe('Initial state', function () {
    it('Creating a state with no initial value', async function () {
        let state = new StateArray();
        expect(await state).deep.equal([]);
    });
    it('Creating a state with initial value', async function () {
        let state = new StateArray([1, 2, 3]);
        expect(await state).deep.equal([1, 2, 3]);
    });
});

describe('Setting state value', function () {
    it('From owner context', async function () {
        let state = new StateArray([1, 2, 3]);
        expect(await state).deep.equal([1, 2, 3]);
        state.set([3, 2, 1])
        expect(await state).deep.equal([3, 2, 1]);
    });
    it('From user context with no setter function', async function () {
        let state = new StateArray([1, 2, 3]);
        expect(await state).deep.equal([1, 2, 3]);
        state.write([3, 2, 1])
        expect(await state).deep.equal([1, 2, 3]);
    });
    it('From user context with standard setter function', async function () {
        let state = new StateArray([1, 2, 3], true);
        expect(await state).deep.equal([1, 2, 3]);
        state.set([3, 2, 1])
        expect(await state).deep.equal([3, 2, 1]);
    });
    it('From user context with custom function', async function () {
        let state = new StateArray([1, 2, 3], (val, state) => { state.set(val.map(x => x * 2)); });
        expect(await state).deep.equal([1, 2, 3]);
        state.write([3, 2, 1])
        expect(await state).deep.equal([6, 4, 2]);
    });
});

describe('Getting state value', async function () {
    it('Using await', async function () {
        let state = new StateArray([1, 2, 3]);
        expect(await state).deep.equal([1, 2, 3]);
    });
    it('Using then', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.then((val) => {
            expect(val).deep.equal([1, 2, 3]);
            done()
        })
    });
    it('Using then with chaining return', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.then((val) => {
            expect(val).deep.equal([1, 2, 3]);
            return 8;
        }).then((val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with chaining throw', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.then((val) => {
            expect(val).deep.equal([1, 2, 3]);
            throw 8;
        }).then(() => { }, (val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with async chaining return', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.then(async (val) => {
            await new Promise((a) => { setTimeout(a, 10) });
            expect(val).deep.equal([1, 2, 3]);
            return 8;
        }).then((val) => {
            expect(val).equal(8);
            done()
        })
    });
    it('Using then with async chaining throw', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.then(async (val) => {
            await new Promise((a) => { setTimeout(a, 10) });
            expect(val).deep.equal([1, 2, 3]);
            throw 8;
        }).then(() => { }, (val) => {
            expect(val).equal(8);
            done()
        })
    });
});


describe('Value subscriber', function () {
    it('Add one subscribers with update set true', function () {
        let state = new StateArray([1, 2, 3]);
        state.subscribe((value) => { }, true);
    });
    it('Add one subscribers with update set true', function () {
        let state = new StateArray([1, 2, 3]);
        let value;
        state.subscribe((value2) => {
            value = value2;
        }, true);
        expect(value).deep.equal([1, 2, 3]);
    });
    it('Add two subscribers with update set true', async function () {
        let state = new StateArray([1, 2, 3]);
        let values = await Promise.all([
            new Promise<Readonly<number[]>>((a) => { state.subscribe(a, true) }),
            new Promise<Readonly<number[]>>((a) => { state.subscribe(a, true) }),
        ])
        expect(values).deep.equal([[1, 2, 3], [1, 2, 3]]);
    });
    it('Insert two subscribers then remove first subscribers', function (done) {
        let state = new StateArray([1, 2, 3]);
        let func = state.subscribe(() => { }, true);
        state.subscribe(() => { done() }, false);
        expect(state.inUse()).deep.equal(true);
        state.unsubscribe(func);
        expect(state.inUse()).deep.equal(true);
        state.set([3, 2, 1])
    });
    it('Insert two subscribers then removeing both subscribers', function (done) {
        let state = new StateArray([1, 2, 3]);
        let sum = 0
        let func1 = state.subscribe(() => { done('Should not be called') }, false);
        let func2 = state.subscribe(() => { done('Should not be called') }, false);
        expect(state.inUse()).deep.equal(true);
        state.unsubscribe(func1);
        state.unsubscribe(func2);
        expect(state.inUse()).deep.equal(false);
        state.set([3, 2, 1])
        done();
    });
    it('Setting value with one subscribers', function (done) {
        let state = new StateArray([1, 2, 3]);
        state.subscribe((val) => { done() }, false);
        state.set([3, 2, 1]);
    });
    it('Setting value with multiple subscribers', async function () {
        let state = new StateArray([1, 2, 3]);
        let sum = 0
        state.subscribe((val) => { sum += val[0] }, true)
        state.subscribe((val) => { sum += val[1] }, true)
        state.subscribe((val) => { sum += val[2] }, true)
        state.set([3, 2, 1]);
        expect(sum).equal(12);
    });
    it('Setting value with subscribers with exception', function () {
        let state = new StateArray([1, 2, 3]);
        state.subscribe((val) => { throw false }, false);
        state.set([3, 2, 1]);
    });
});

describe('Array Methods', function () {
    it('Using Setindex', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.setIndex(0, 3);
        expect(await state).deep.equal([3, 2, 3]);
        expect(clone).deep.equal([3, 2, 3]);
    });
    it('Using iterator', async function () {
        let state = new StateArray([1, 2, 3]);
        let it: number[] = [];
        for (const iterator of state) {
            it.push(iterator);
        }
        expect(it).deep.equal([1, 2, 3]);
    });
    it('Using copyWithin normal', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.copyWithin(0, 5);
        expect(await state).deep.equal([6, 7, 8, 9, 0, 6, 7, 8, 9, 0]);
        expect(clone).deep.equal([6, 7, 8, 9, 0, 6, 7, 8, 9, 0]);
    });
    it('Using copyWithin minus', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.copyWithin(-5, -5, -3);
        expect(await state).deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        expect(clone).deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    });
    it('Using entries', async function () {
        let state = new StateArray([1, 2, 3]);
        let it: [number, number][] = [];
        for (const iterator of state.entries()) {
            it.push(iterator);
        }
        expect(it).deep.equal([[0, 1], [1, 2], [2, 3]]);
    });
    it('Using fill', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.fill(1);
        expect(await state).deep.equal([1, 1, 1]);
        expect(clone).deep.equal([1, 1, 1]);
    });
    it('Using fill', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.fill(1, 3, 6);
        expect(await state).deep.equal([1, 2, 3, 1, 1, 1]);
        expect(clone).deep.equal([1, 2, 3, 1, 1, 1]);
    });
    it('Using fill', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.fill(1, -4, -2);
        expect(await state).deep.equal([1, 2, 1, 1, 5, 6]);
        expect(clone).deep.equal([1, 2, 1, 1, 5, 6]);
    });

    it('Using push', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.push(0, 3);
        expect(await state).deep.equal([1, 2, 3, 0, 3]);
        expect(clone).deep.equal([1, 2, 3, 0, 3]);
    });
    it('Using unshift', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        state.unshift(0, 3);
        expect(await state).deep.equal([0, 3, 1, 2, 3]);
        expect(clone).deep.equal([0, 3, 1, 2, 3]);
    });
    it('Using pop', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        expect(state.pop()).equal(3);
        expect(await state).deep.equal([1, 2]);
        expect(clone).deep.equal([1, 2]);
    });
    it('Using shift', async function () {
        let state = new StateArray([1, 2, 3]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        expect(state.shift()).equal(1);
        expect(await state).deep.equal([2, 3]);
        expect(clone).deep.equal([2, 3]);
    });
    it('Using splice to remove', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        expect(state.splice(3, 2)).deep.equal([4, 5]);
        expect(await state).deep.equal([1, 2, 3, 6]);
        expect(clone).deep.equal([1, 2, 3, 6]);
    });
    it('Using splice to add', async function () {
        let state = new StateArray([1, 2, 3, 4, 5, 6]);
        let clone = await state;
        state.subscribe((val, meta) => { clone = StateArray.applyMetaChange(val, meta, clone, x => x) });
        expect(state.splice(3, 0, 8, 9, 0)).deep.equal([]);
        expect(await state).deep.equal([1, 2, 3, 4, 5, 6, 8, 9, 0]);
        expect(clone).deep.equal([1, 2, 3, 4, 5, 6, 8, 9, 0]);
    });
});
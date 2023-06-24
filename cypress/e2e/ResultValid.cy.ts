/// <reference types="cypress" />
import { Error, Valid } from "../../src"

describe('Result Valid', function () {
    it('Value from valid result', function () {
        let result = Valid(42);
        expect(result.value).equal(42);
    });
    it('Valid from valid result', function () {
        let result = Valid(42);
        expect(result.valid).equal(true);
    });
    it('Ok from valid result', function () {
        let result = Valid(42);
        expect(result.ok).equal(true);
    });
    it('Err from valid result', function () {
        let result = Valid(42);
        expect(result.err).equal(false);
    });
    it('Expect value from valid result', function () {
        let result = Valid(42);
        expect(result.expect()).equal(42);
    });
    it('Expect err value from valid result', function () {
        let result = Valid(42);
        expect(() => { result.expectErr('YOYO') }).to.throw();
    });
    it('Unwrap value from valid result', function () {
        let result = Valid(42);
        expect(result.unwrap()).equal(42);
    });
    it('UnwrapOr value from valid result', function () {
        let result = Valid(42);
        expect(result.unwrapOr()).equal(42);
    });
    it('andThen from valid result returning valid result', function () {
        let result = Valid(42);
        expect(result.andThen((val) => {
            expect(val).equal(42);
            return Valid('42')
        }).expect()).equal('42');
    });
    it('andThen from valid result returning error result', function () {
        let result = Valid(42);
        expect(result.andThen((val) => {
            expect(val).equal(42);
            return Error('42')
        }).expectErr()).equal('42');
    });
    it('andThenAsync from valid result returning valid result', async function () {
        let result = Valid(42);
        expect((await result.andThenAsync(async (val) => {
            expect(val).equal(42);
            return Valid('42')
        })).expect()).equal('42');
    });
    it('andThenAsync from valid result returning error result', async function () {
        let result = Valid(42);
        expect((await result.andThenAsync(async (val) => {
            expect(val).equal(42);
            return Error('42')
        })).expectErr()).equal('42');
    });
    it('orElse from valid result', function () {
        let result = Valid(42);
        expect(result.orElse().expect()).equal(42);
    });
    it('orElseAsync from valid result', async function () {
        let result = Valid(42);
        expect((await result.orElseAsync()).expect()).equal(42);
    });
    it('map from valid result', function () {
        let result = Valid(42);
        expect(result.map((val) => {
            expect(val).equal(42);
            return '42'
        }).expect()).equal('42');
    });
    it('mapAsync from valid result', async function () {
        let result = Valid(42);
        expect((await result.mapAsync(async (val) => {
            expect(val).equal(42);
            return '42'
        })).expect()).equal('42');
    });
    it('mapErr from valid result', function () {
        let result = Valid(42);
        expect(result.mapErr().expect()).equal(42);
    });
    it('mapErrAsync from valid result', async function () {
        let result = Valid(42);
        expect((await result.mapErrAsync()).expect()).equal(42);
    });
    it('toOptional from valid result', function () {
        let result = Valid(42);
        expect(result.toOptional().expect()).equal(42);
    });
    it('safeUnwrap from valid result', function () {
        let result = Valid(42);
        expect(result.safeUnwrap()).equal(42);
    });
});
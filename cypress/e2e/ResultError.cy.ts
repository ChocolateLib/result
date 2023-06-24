/// <reference types="cypress" />
import { Error, Valid } from "../../src"

describe('Result Error', function () {
    it('Value from error result', function () {
        let result = Error(42);
        expect(result.error).equal(42);
    });
    it('Valid from error result', function () {
        let result = Error(42);
        expect(result.valid).equal(false);
    });
    it('Ok from error result', function () {
        let result = Error(42);
        expect(result.ok).equal(false);
    });
    it('Err from error result', function () {
        let result = Error(42);
        expect(result.err).equal(true);
    });
    it('Expect err value from error result', function () {
        let result = Error(42);
        expect(result.expectErr()).equal(42);
    });
    it('Unwrap value from error result', function () {
        let result = Error(42);
        expect(() => { result.unwrap() }).to.throw();
    });
    it('UnwrapOr value from error result', function () {
        let result = Error(42);
        expect(result.unwrapOr(42)).equal(42);
    });
    it('andThen from error result', function () {
        let result = Error(42);
        expect(result.andThen().expectErr()).equal(42);
    });
    it('andThenAsync from error result', async function () {
        let result = Error(42);
        expect((await result.andThenAsync()).expectErr()).equal(42);
    });
    it('orElse from error result', function () {
        let result = Error(42);
        expect(result.orElse((val) => {
            expect(val).equal(42);
            return Valid('42')
        }).expect()).equal('42');
    });
    it('map from error result', function () {
        let result = Error(42);
        expect(result.map().expectErr()).equal(42);
    });
    it('mapAsync from error result', async function () {
        let result = Error(42);
        expect((await result.mapAsync()).expectErr()).equal(42);
    });
    it('mapErr from error result', function () {
        let result = Error(42);
        expect(result.mapErr((val) => {
            expect(val).equal(42);
            return '42'
        }).expectErr()).equal('42');
    });
    it('mapErrAsync from error result', async function () {
        let result = Error(42);
        expect((await result.mapErrAsync(async (val) => {
            expect(val).equal(42);
            return '42'
        })).expectErr()).equal('42');
    });
    it('toOptional from error result', function () {
        let result = Error(42);
        expect(result.toOptional().none).equal(true);
    });
    it('stack from error result', function () {
        let result = Error(42);
        expect(typeof result.stack).equal('string');
    });
});
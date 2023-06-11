/// <reference types="cypress" />
import { ResultValid } from "../../src"

describe('Result Valid', function () {
    it('Value from valid result', function () {
        let result = ResultValid(42);
        expect(result.value).equal(42);
    });
    it('Valid from valid result', function () {
        let result = ResultValid(42);
        expect(result.valid).equal(true);
    });
    it('Ok from valid result', function () {
        let result = ResultValid(42);
        expect(result.ok).equal(true);
    });
    it('Err from valid result', function () {
        let result = ResultValid(42);
        expect(result.err).equal(false);
    });
    it('Expect err value from valid result', function () {
        let result = ResultValid(42);
        expect(() => { result.expectErr('YOYO') }).to.throw();
    });
    it('Unwrap value from valid result', function () {
        let result = ResultValid(42);
        expect(result.unwrap()).equal(42);
    });
    it('UnwrapOr value from valid result', function () {
        let result = ResultValid(42);
        expect(result.unwrapOr()).equal(42);
    });
    it('andThen from valid result', function () {
        let result = ResultValid(42);

        expect(result.unwrapOr()).equal(42);
    });
});
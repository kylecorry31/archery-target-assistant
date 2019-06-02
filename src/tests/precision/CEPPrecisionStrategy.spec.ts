import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import CEPPrecisionStrategy = require('../../precision/CEPPrecisionStrategy');
import Arrow = require('../../entities/Arrow');

describe("Mean Radius Precision Srategy", () => {

    let target: Target;
    let precision: CEPPrecisionStrategy;

    beforeEach(() => {
        target = new Target([new TargetRing(0, 10, 2), new TargetRing(10, 20, 1)]);
        precision = new CEPPrecisionStrategy(0.5);
    });

    it("Throws when there are no arrows", () => {
        expect(() => precision.getPrecision(target)).to.throw();            
    });

    it("Can calculate the precision of 1 arrow", () => {
        target.putArrow(new Arrow(0, 0));
        expect(precision.getPrecision(target)).to.equal(0);
    });

    it("Can calculate the precision of 2 arrows at CEP(0.5)", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(1);
    });

    it("Can calculate the precision of 4 arrows at CEP(0.5)", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(4, 0);
        let arrow3 = new Arrow(-4, 0);
        let arrow4 = new Arrow(8, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        target.putArrow(arrow4);
        expect(precision.getPrecision(target)).to.equal(2);
    });

    it("Can calculate CEP(0)", () => {
        precision = new CEPPrecisionStrategy(0);
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(4, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(0);
    });

    it("Can calculate the precision of 4 arrows at CEP(0.6)", () => {
        precision = new CEPPrecisionStrategy(0.6);
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(4, 0);
        let arrow3 = new Arrow(-4, 0);
        let arrow4 = new Arrow(12, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        target.putArrow(arrow4);
        expect(precision.getPrecision(target)).to.equal(7);
    });

    it("Throws if proportion is out of bounds", () => {
        expect(() => new CEPPrecisionStrategy(1.1)).to.throw();
        expect(() => new CEPPrecisionStrategy(-0.1)).to.throw();
    });

    it("Does not include arrows that missed the target", () => {
        let arrow1 = new Arrow(40, 40);
        let arrow2 = new Arrow(0, 0);
        target.putArrow(arrow1);
        expect(() => precision.getPrecision(target)).to.throw();
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(0);
    });
});
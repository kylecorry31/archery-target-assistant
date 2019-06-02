import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import ExtremeSpreadPrecisionStrategy = require('../../precision/ExtremeSpreadPrecisionStrategy');
import Arrow = require('../../entities/Arrow');

describe("Mean Radius Precision Srategy", () => {

    let target: Target;
    let precision: ExtremeSpreadPrecisionStrategy;

    beforeEach(() => {
        target = new Target([new TargetRing(0, 10, 2), new TargetRing(10, 20, 1)]);
        precision = new ExtremeSpreadPrecisionStrategy();
    });

    it("Throws when there are no arrows", () => {
        expect(() => precision.getPrecision(target)).to.throw();            
    });

    it("Can calculate the precision of 1 arrow", () => {
        target.putArrow(new Arrow(0, 0));
        expect(precision.getPrecision(target)).to.equal(0);
    });

    it("Can calculate the precision of 2 arrows", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 2);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(Math.hypot(2, 2));
    });

    it("Can calculate the precision of 3 arrows", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 2);
        let arrow3 = new Arrow(-2, -2);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        expect(precision.getPrecision(target)).to.equal(Math.hypot(4, 4));
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
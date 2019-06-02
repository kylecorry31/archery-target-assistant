import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import ArcheryMOAPrecisionStrategy = require('../../precision/ArcheryMOAPrecisionStrategy');
import Arrow = require('../../entities/Arrow');

describe("Mean Radius Precision Srategy", () => {

    let target: Target;
    let precision: ArcheryMOAPrecisionStrategy;

    beforeEach(() => {
        target = new Target([new TargetRing(0, 10, 2), new TargetRing(10, 20, 1)]);
        precision = new ArcheryMOAPrecisionStrategy(10, 1.0);
    });

    it("Throws when there are no arrows", () => {
        expect(() => precision.getPrecision(target)).to.throw();            
    });

    it("Can calculate the precision of 1 arrow", () => {
        target.putArrow(new Arrow(0, 0));
        expect(precision.getPrecision(target)).to.equal(0);
    });

    it("Can calculate the precision of 2 arrows at 10 yards", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(2);
    });

    it("Can calculate the precision of 3 arrows at 10 yards", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 0);
        let arrow3 = new Arrow(-2, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        expect(precision.getPrecision(target)).to.equal(4);
    });

    it("Can calculate the precision of 2 arrows at 50 yards", () => {
        precision = new ArcheryMOAPrecisionStrategy(50, 1.0);
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        expect(precision.getPrecision(target)).to.equal(2/5);
    });

    it("Can calculate the precision of 3 arrows at 50 yards", () => {
        precision = new ArcheryMOAPrecisionStrategy(50, 1.0);
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(2, 0);
        let arrow3 = new Arrow(-2, 0);
        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        expect(precision.getPrecision(target)).to.equal(4/5);
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
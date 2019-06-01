import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import AverageAccuracyStrategy = require('../../accuracy/AverageAccuracyStrategy');
import Arrow = require('../../entities/Arrow');

describe("Average Accuracy Strategy", () => {

    let target: Target;
    let accuracy: AverageAccuracyStrategy;

    beforeEach(() => {
        target = new Target([new TargetRing(0, 10, 10), new TargetRing(10, 20, 5)]);
        accuracy = new AverageAccuracyStrategy();
    })

    it("Can calculate the accuracy of 0 arrows", () => {
        expect(accuracy.getAccuracy(target)).to.equal(0);
    });

    it("Can calculate the accuracy of 1 arrow", () => {
       target.putArrow(new Arrow(1, 0));
       expect(accuracy.getAccuracy(target)).to.equal(19 / 20); 
    });

    it("Can calculate the accuracy of 2 arrows", () => {
        target.putArrow(new Arrow(0, 0));
        target.putArrow(new Arrow(2, 2));
        expect(accuracy.getAccuracy(target)).to.be.approximately((2 - Math.hypot(2, 2) / 20) / 2, 0.001);
    });

    it("Can calculate the accuracy of 3 arrows", () => {
        target.putArrow(new Arrow(0, 0));
        target.putArrow(new Arrow(2, 2));
        target.putArrow(new Arrow(-1, 1));
        expect(accuracy.getAccuracy(target)).to.be.approximately((3 - Math.hypot(2, 2) / 20 - Math.hypot(1, 1) / 20) / 3, 0.001);
    });

    it("Counts missed arrows as 0 accuracy", () => {
        target.putArrow(new Arrow(30, 30));
        target.putArrow(new Arrow(1, 0));
        expect(accuracy.getAccuracy(target)).to.equal(19 / 40); 
    })
});
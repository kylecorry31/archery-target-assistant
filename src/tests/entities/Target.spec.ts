import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import Arrow = require('../../entities/Arrow');

describe("Target", () => {

    let target: Target;
    let ring1: TargetRing;
    let ring2: TargetRing;

    beforeEach(() => {
        ring1 = new TargetRing(0, 10, 10);
        ring2 = new TargetRing(10, 20, 9);
        target = new Target([ring1, ring2]);
    });

    it("Can put an arrow on the target", () => {
        let arrow = new Arrow(0, 0);
        target.putArrow(arrow);
        expect(target.getArrows()).to.be.of.length(1);
        expect(target.getArrows()).to.contain(arrow);
    });

    it("Can put multiple arrows on the target", () => {
        let arrow = new Arrow(0, 0);
        let arrow2 = new Arrow(10, 10);
        target.putArrow(arrow);
        target.putArrow(arrow2);
        expect(target.getArrows()).to.be.of.length(2);
        expect(target.getArrows()).to.contain(arrow);
        expect(target.getArrows()).to.contain(arrow2);
    });

    it("Can put a missed arrow on the target", () => {
        let arrow = new Arrow(30, 30);
        target.putArrow(arrow);
        expect(target.getArrows()).to.be.of.length(1);
        expect(target.getArrows()).to.contain(arrow);
    });

    it("Can remove an arrow from the target", () => {
        let arrow = new Arrow(0, 0);
        target.putArrow(arrow);
        target.removeArrow(arrow);
        expect(target.getArrows()).to.be.of.length(0);
    });

    it("Can get target rings", () => {
        let rings = target.getRings();
        expect(rings).to.be.of.length(2);
        expect(rings).to.contain(ring1);
        expect(rings).to.contain(ring2);
    });

    it("Throws if target rings overlap", () => {
        expect(() => new Target([new TargetRing(0, 10, 10), new TargetRing(8, 12, 8)])).to.throw();
    });

    it("Throws if there are no target rings", () => {
        expect(() => new Target([])).to.throw();
    });
});

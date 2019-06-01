import { expect } from 'chai';
import 'mocha';
import '../entities/TargetRing';
import Arrow = require('../entities/Arrow');
import TargetRing = require('../entities/TargetRing');

describe('Target Ring', () => {
    it("Can detect if it can contain an arrow", () => {
        let arrow = new Arrow(0, 0);
        let arrow2 = new Arrow(10, 0);
        let arrow3 = new Arrow(10, 10);
        let ring = new TargetRing(0, 10, 2);
        expect(ring.canContain(arrow)).to.equal(true);
        expect(ring.canContain(arrow2)).to.equal(true);
        expect(ring.canContain(arrow3)).to.equal(false);
    });

    it('Can get attributes', () => {
        let ring = new TargetRing(0, 10, 2);
        expect(ring.getInnerRadius()).to.equal(0);
        expect(ring.getOuterRadius()).to.equal(10);
        expect(ring.getPointValue()).to.equal(2);
    });
});
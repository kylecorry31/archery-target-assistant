import { expect } from 'chai';
import 'mocha';
import Arrow = require('../../entities/Arrow');

describe("Arrow", () => {
    it("Can get attributes", () => {
        let arrow = new Arrow(10, 12);
        expect(arrow.getX()).to.equal(10);
        expect(arrow.getY()).to.equal(12);
    });
});

import { expect } from 'chai';
import 'mocha';
import Target = require('../../entities/Target');
import TargetRing = require('../../entities/TargetRing');
import LineBreakerHighestScorer = require("../../scoring/LineBreakerHighestScorer");
import Arrow = require('../../entities/Arrow');

describe("Line Breaker Highest Scorer", () => {

    let target: Target;
    let scorer: LineBreakerHighestScorer;

    beforeEach(() => {
        target = new Target([new TargetRing(0, 10, 10), new TargetRing(10, 20, 9), new TargetRing(20, 30, 8)]);
        scorer = new LineBreakerHighestScorer();
    });

    it("Can score an empty target", () => {
        expect(scorer.getScore(target)).to.equal(0);
    });

    it("Can score a target with a single arrow", () => {
        target.putArrow(new Arrow(0, 0));
        expect(scorer.getScore(target)).to.equal(10);
    });

    it("Can score a target with all arrows in the same ring", () => {
        target.putArrow(new Arrow(0, 0));
        target.putArrow(new Arrow(1, 1));
        expect(scorer.getScore(target)).to.equal(20);
    });

    it("Can score a target with all arrows in different rings", () => {
        target.putArrow(new Arrow(0, 0));
        target.putArrow(new Arrow(11, 0));
        target.putArrow(new Arrow(22, 0));
        expect(scorer.getScore(target)).to.equal(27);
    });

    it("Can score a target with an arrow between two rings", () => {
        target.putArrow(new Arrow(10, 0));
        expect(scorer.getScore(target)).to.equal(10);
    });

    it("Can score a target with an arrow off the target", () => {
        target.putArrow(new Arrow(40, 40));
        expect(scorer.getScore(target)).to.equal(0);
    });

    it("Can score a target with an arrow on the boundary of the outer ring", () => {
        target.putArrow(new Arrow(0, 30));
        expect(scorer.getScore(target)).to.equal(8);
    });

    it("Can score a single arrow", () => {
        let arrow1 = new Arrow(0, 0);
        let arrow2 = new Arrow(20, 0);
        let arrow3 = new Arrow(22, 0);
        let arrow4 = new Arrow(35, 35);

        target.putArrow(arrow1);
        target.putArrow(arrow2);
        target.putArrow(arrow3);
        target.putArrow(arrow4);

        expect(scorer.getArrowScore(target, arrow1)).to.equal(10);
        expect(scorer.getArrowScore(target, arrow2)).to.equal(9);
        expect(scorer.getArrowScore(target, arrow3)).to.equal(8);
        expect(scorer.getArrowScore(target, arrow4)).to.equal(0);
    });

    it("Can score an arrow that is not on the target as 0", () => {
        let arrow1 = new Arrow(0, 0);
        expect(scorer.getArrowScore(target, arrow1)).to.equal(0);
    });
});
import Scorer = require("./Scorer");
import Target = require("../entities/Target");
import Arrow = require("../entities/Arrow");
import TargetRing = require("../entities/TargetRing");

/**
 * A scoring strategy which awards an arrow on a boundary the highest point value. 
 */
class LineBreakerHighestScorer implements Scorer {
    getScore(target: Target): number {
        return target.getArrows().map(arrow => this.getArrowScore(target, arrow)).reduce((a, b) => a + b, 0);
    }

    getArrowScore(target: Target, arrow: Arrow): number {
        if (target.getArrows().indexOf(arrow) === -1){
            return 0;
        }
        let containingRings: TargetRing[] = target.getRings().filter(ring => ring.canContain(arrow));
        if(containingRings.length !== 0){
            return Math.max.apply(null, containingRings.map(ring => ring.getPointValue()));
        }
        return 0;
    }
}

export = LineBreakerHighestScorer;
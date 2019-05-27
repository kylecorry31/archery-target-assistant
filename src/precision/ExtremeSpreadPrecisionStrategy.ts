import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import Arrow = require("../entities/Arrow");

/**
 * A precision strategy which uses the extreme spread calculation
 */
class ExtremeSpreadPrecisionStrategy implements PrecisionStrategy {
    getPrecision(target: Target): number {
        let arrows = target.getArrows();

        let isOnTarget = (arrow: Arrow) => target.getRings().map(ring => ring.canContain(arrow)).reduce((a, b) => a || b, false);
        arrows = arrows.filter(isOnTarget); 

        if (arrows.length === 0){
            throw new Error("No arrows on target");
        }

        let maxDistance = 0;
        let distance = (arrow1: Arrow, arrow2: Arrow) => Math.hypot(arrow1.getX() - arrow2.getX(), arrow1.getY() - arrow2.getY());

        for (let arrow1 of arrows){
            for (let arrow2 of arrows){
                let d = distance(arrow1, arrow2);
                if (d > maxDistance){
                    maxDistance = d;
                }
            }
        }
        return maxDistance;
    }

}

export = ExtremeSpreadPrecisionStrategy;
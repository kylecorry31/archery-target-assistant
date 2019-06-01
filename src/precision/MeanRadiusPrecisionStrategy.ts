import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import Arrow = require("../entities/Arrow");

/**
 * A precision strategy which uses the mean radius measurement
 */
class MeanRadiusPrecisionStrategy implements PrecisionStrategy {
    getPrecision(target: Target): number {
        let arrows = target.getArrows();

        let isOnTarget = (arrow: Arrow) => target.getRings().map(ring => ring.canContain(arrow)).reduce((a, b) => a || b, false);
        arrows = arrows.filter(isOnTarget); 

        if (arrows.length === 0){
            throw new Error("No arrows on target");
        } 

        let meanX = arrows.map(arrow => arrow.getX()).reduce((a, b) => a + b, 0) / arrows.length;
        let meanY = arrows.map(arrow => arrow.getY()).reduce((a, b) => a + b, 0) / arrows.length;
        let distances = arrows.map(arrow => Math.hypot(arrow.getX() - meanX, arrow.getY() - meanY));
        return distances.reduce((a, b) => a + b, 0) / arrows.length;
    }
}

export = MeanRadiusPrecisionStrategy;
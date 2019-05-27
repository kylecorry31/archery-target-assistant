import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import Arrow = require("../entities/Arrow");

/**
 * A precision strategy for circular error probable
 */
class CEPPrecisionStrategy implements PrecisionStrategy {

    /**
     * Default constructor
     * @param proportion the proportion of shots to calculate the CEP
     */
    constructor(private proportion: number){}

    getPrecision(target: Target): number {
        let arrows = target.getArrows();

        let isOnTarget = (arrow: Arrow) => target.getRings().map(ring => ring.canContain(arrow)).reduce((a, b) => a || b, false);
        arrows = arrows.filter(isOnTarget); 

        if(arrows.length === 0){
            throw new Error("No arrows on target");
        }
         
        let centerX = arrows.map(arrow => arrow.getX()).reduce((a, b) => a + b, 0) / arrows.length;
        let centerY = arrows.map(arrow => arrow.getY()).reduce((a, b) => a + b, 0) / arrows.length;
        let distance = (arrow: Arrow) => Math.hypot(arrow.getX() - centerX, arrow.getY() - centerY);
        let sorted = [...arrows].sort((a, b) => distance(a) - distance(b));
        let idx = Math.ceil(this.proportion * (arrows.length - 1));
        return distance(sorted[idx]);
    }
}

export = CEPPrecisionStrategy;
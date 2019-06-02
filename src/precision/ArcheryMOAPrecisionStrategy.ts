import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import CEPPrecisionStrategy = require("./CEPPrecisionStrategy");

/**
 * A precision strategy using Archery MOA (minutes of angle).
 * Archery MOA is the same as MOA except 1 MOA @ 10 yards is 1"
 */
class ArcheryMOAPrecisionStrategy implements PrecisionStrategy {

    private cep: CEPPrecisionStrategy;

    /**
     * 
     * @param distanceToTarget the distance to the target in yards
     * @param targetSize the target size in inches
     * @param proportion the proportion of shots to calculate the CEP
     */
    constructor(private distanceToTarget: number, proportion: number){
        this.cep = new CEPPrecisionStrategy(proportion);
    }

    getPrecision(target: Target): number {
        let yardsToMinutes = 0.1;
        let oneMOA = yardsToMinutes * this.distanceToTarget;
        return (this.cep.getPrecision(target) * 2) / oneMOA;
    }
}

export = ArcheryMOAPrecisionStrategy;
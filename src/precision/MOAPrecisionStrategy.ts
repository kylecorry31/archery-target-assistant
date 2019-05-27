import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import CEPPrecisionStrategy = require("./CEPPrecisionStrategy");

/**
 * A precision strategy using MOA (minutes of angle)
 */
class MOAPrecisionStrategy implements PrecisionStrategy {

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
        let yardsToMinutes = 0.01046;
        let oneMOA = yardsToMinutes * this.distanceToTarget;
        return this.cep.getPrecision(target) / oneMOA;
    }
}

export = MOAPrecisionStrategy;
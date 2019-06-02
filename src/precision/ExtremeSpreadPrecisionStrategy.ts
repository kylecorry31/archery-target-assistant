import PrecisionStrategy = require("./PrecisionStrategy");
import Target = require("../entities/Target");
import CEPPrecisionStrategy = require("./CEPPrecisionStrategy");

/**
 * A precision strategy which uses the extreme spread calculation
 */
class ExtremeSpreadPrecisionStrategy implements PrecisionStrategy {

    private cepPrecision: CEPPrecisionStrategy;

    constructor(){
        this.cepPrecision = new CEPPrecisionStrategy(1.0);
    }

    getPrecision(target: Target): number {
        return this.cepPrecision.getPrecision(target) * 2;
    }

}

export = ExtremeSpreadPrecisionStrategy;
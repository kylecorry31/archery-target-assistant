import Target = require("../entities/Target");

/**
 * An accuracy strategy
 */
interface AccuracyStrategy {
    /**
     * 
     * @param target the target with 
     */
    getAccuracy(target: Target): number;
}

export = AccuracyStrategy;
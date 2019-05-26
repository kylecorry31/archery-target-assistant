import Target = require("../entities/Target");

/**
 * An interface to get the precision of arrows shot
 */
interface PrecisionStrategy {
    /**
     * @param target the target with arrows
     * @returns the precision of the arrows
     */
    getPrecision(target: Target): number;
}

export = PrecisionStrategy;
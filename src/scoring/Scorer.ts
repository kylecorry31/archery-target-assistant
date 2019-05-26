import Target = require("../entities/Target");

/**
 * A scoring strategy for a target.
 */
interface Scorer {
    /**
     * @param target the target with arrows
     * @returns the total score of the arrows
     */
    getScore(target: Target): number;
}

export = Scorer;
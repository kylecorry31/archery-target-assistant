import Target = require("../entities/Target");
import Arrow = require("../entities/Arrow");

/**
 * A scoring strategy for a target.
 */
interface Scorer {
    /**
     * @param target the target with arrows
     * @returns the total score of the arrows
     */
    getScore(target: Target): number;

    /**
     * @param target the target
     * @param arrow the arrow
     * @returns the score of the single arrow, or 0 if the arrow misses
     */
    getArrowScore(target: Target, arrow: Arrow): number;
}

export = Scorer;
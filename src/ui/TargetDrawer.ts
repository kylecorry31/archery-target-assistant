import Target = require("../entities/Target");

/**
 * An interface for drawing blank targets
 */
interface TargetDrawer {

    /**
     * Draw a target on the canvas
     * @param target the target
     */
    draw(target: Target): void;

}

export = TargetDrawer;
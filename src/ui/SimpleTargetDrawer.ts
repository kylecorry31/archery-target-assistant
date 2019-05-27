import TargetDrawer = require("./TargetDrawer");
import Target = require("../entities/Target");

/**
 * Draws a simple target
 */
class SimpleTargetDrawer implements TargetDrawer {
    draw(target: Target): void {
        for(let ring of [...target.getRings()].sort((r1, r2) => r2.getOuterRadius() - r1.getOuterRadius())){
            circle(0, 0, ring.getOuterRadius() * 2);
        }
    }
}

export = SimpleTargetDrawer;
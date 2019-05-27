import Arrow = require("../entities/Arrow");

/**
 * An interface for drawing arrows
 */
interface ArrowDrawer {
    /**
     * Draw an arrow to the canvas
     * @param arrow the arrow
     */
    draw(arrow: Arrow): void;
}

export = ArrowDrawer;
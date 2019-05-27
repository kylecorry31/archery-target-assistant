import ArrowDrawer = require("./ArrowDrawer");
import Arrow = require("../entities/Arrow");

class CircleArrowDrawer implements ArrowDrawer {

    constructor(private radius: number){}

    draw(arrow: Arrow): void {
        circle(arrow.getX(), arrow.getY(), this.radius);
    }

}

export = CircleArrowDrawer;
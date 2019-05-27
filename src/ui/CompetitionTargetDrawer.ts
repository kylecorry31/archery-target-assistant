import TargetDrawer = require("./TargetDrawer");
import Target = require("../entities/Target");
import MultiColorTargetDrawer = require("./MultiColorTargetDrawer");

/**
 * A class for drawing a competition target with 10 rings
 */
class CompetitionTargetDrawer implements TargetDrawer {

    private multiColorDrawer: MultiColorTargetDrawer;

    constructor(){
        this.multiColorDrawer = new MultiColorTargetDrawer(
            ['yellow', 'yellow', 'red', 'red', 'blue', 'blue', 'black', 'black', 'white', 'white'],
            ['black', 'black', 'black', 'black', 'black', 'black', 'white', 'white', 'black', 'black']
        );
    }

    draw(target: Target): void {
       this.multiColorDrawer.draw(target);
    }

}

export = CompetitionTargetDrawer;
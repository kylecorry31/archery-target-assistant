import TargetDrawer = require("./TargetDrawer");
import Target = require("../entities/Target");

/**
 * A class for drawing a competition target with 10 rings
 */
class CompetitionTargetDrawer implements TargetDrawer {

    draw(target: Target): void {
        let i = 0;
        for(let ring of [...target.getRings()].sort((r1, r2) => r2.getOuterRadius() - r1.getOuterRadius())){
            stroke('black');
            if (i >= 8){
                fill('yellow');
            } else if (i >=6){
                fill('red');
            } else if (i >= 4){
                fill('blue');
            } else if (i >= 2){
                fill('black');
                stroke('white');
            } else {
                fill('white');
            }
            circle(0, 0, ring.getOuterRadius() * 2);
            i++;
        }
    }

}

export = CompetitionTargetDrawer;
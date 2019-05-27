import TargetDrawer = require("./TargetDrawer");
import Target = require("../entities/Target");

class MultiColorTargetDrawer implements TargetDrawer {

    /**
     * Default constructor
     * @param fillColors the fill colors of the rings, starting at the center
     * @param strokeColors the stroke colors of the rings, starting at the center
     */
    constructor(private fillColors: string[], private strokeColors: string[]){
        if (fillColors.length !== strokeColors.length){
            throw new Error("Fill and stroke colors must be the same length");
        }
        this.fillColors.reverse();
        this.strokeColors.reverse();
    }
    
    draw(target: Target): void {
        if (this.fillColors.length !== target.getRings().length){
            throw new Error("Number of rings and colors don't match");
        }
        let i = 0;
        let rings = [...target.getRings()].sort((r1, r2) => r2.getOuterRadius() - r1.getOuterRadius());
        for(let ring of rings){
            stroke(this.strokeColors[i]);
            fill(this.fillColors[i]);
            circle(0, 0, ring.getOuterRadius() * 2);
            i++;
        }
    }

}

export = MultiColorTargetDrawer;
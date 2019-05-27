import Arrow = require("./Arrow");
import TargetRing = require("./TargetRing");

/**
 * An archery target
 */
class Target {

    private arrows: Arrow[];

    /**
     * Default constructor
     * @param rings the target rings
     */
    constructor(private rings: TargetRing[]){
        this.arrows = [];
    }

    /**
     * Put an arrow on the target
     * @param arrow the arrow which hits the target
     */
    public putArrow(arrow: Arrow): void {
        this.arrows.push(arrow);
    }

    /**
     * Remove an arrow from the target
     * @param arrow the arrow to remove
     */
    public removeArrow(arrow: Arrow): void {
        let idx = this.arrows.indexOf(arrow);
        if (idx === -1){
            return;
            // throw new Error('The arrow is not on the target');
        }
        this.arrows.splice(idx, 1);
    }

    /**
     * @returns the arrows in the target
     */
    public getArrows(): Arrow[] {
        return this.arrows.slice(0, this.arrows.length);
    }

    /**
     * @returns the rings on the target
     */
    public getRings(): TargetRing[] {
        return this.rings.slice(0, this.rings.length);
    }
}

export = Target;
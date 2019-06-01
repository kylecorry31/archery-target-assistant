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
        if (rings == null || rings.length === 0){
            throw new Error("Target must have rings");
        }
        for (let i in rings){
            for (let j in rings){
                if (i !== j){
                    if (this.overlaps(rings[i], rings[j])){
                        throw new Error("Target rings can't overlap");
                    }
                }
            }
        }
    }

    private overlaps(ring1: TargetRing, ring2: TargetRing): boolean {
        let biggerRing = ring1.getOuterRadius() > ring2.getOuterRadius() ? ring1 : ring2;
        let smallerRing = biggerRing === ring1 ? ring2 : ring1;
        return smallerRing.getOuterRadius() > biggerRing.getInnerRadius() || smallerRing.getInnerRadius() >= biggerRing.getInnerRadius(); 
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
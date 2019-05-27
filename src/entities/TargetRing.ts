import Arrow = require("./Arrow");

/**
 * A ring on the target
 */
class TargetRing {

    /**
     * Default constructor
     * @param innerRadius the inner radius
     * @param outerRadius the outer radius
     * @param pointValue the point value
     */
    constructor(private innerRadius: number, private outerRadius: number, private pointValue: number){}

    /**
     * @returns the inner radius in inches
     */
    public getInnerRadius(): number {
        return this.innerRadius;
    }

    /**
     * @returns the outer radius in inches
     */
    public getOuterRadius(): number {
        return this.outerRadius;
    }

    /**
     * @returns the point value
     */
    public getPointValue(): number {
        return this.pointValue;
    }

    /**
     * Determines if the ring could contain the arrow, an arrow on a boundary is counted as within the ring.
     * @param arrow the arrow
     * @returns true if the ring could contain the arrow, otherwise false 
     */
    public canContain(arrow: Arrow): boolean {
        let radius = Math.sqrt(arrow.getX()**2 + arrow.getY()**2);
        return radius <= this.outerRadius && radius >= this.innerRadius;
    }
}

export = TargetRing;
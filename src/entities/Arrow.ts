/**
 * An arrow that has hit a target
 */
class Arrow {
    /**
     * Default constructor
     * @param x the x coordinate relative to the center of the target
     * @param y the y coordinate relative to the center of the target
     */
    constructor(private x: number, private y: number){}

    /**
     * @returns the x coordinate of the arrow relative to the center of the target
     */
    public getX(): number {
        return this.x;
    }

    /**
     * @returns the y coordinate of the arrow relative to the center of the target
     */
    public getY(): number {
        return this.y;
    }
}

export = Arrow;
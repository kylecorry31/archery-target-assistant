import End = require("./End");

/**
 * A score card
 */
class ScoreCard {

    private ends: End[];

    /**
     * Default constructor
     * @param endSize the number of shots per end
     */
    constructor(private endSize: number){
        this.ends = [];
    }

    /**
     * @returns the number of shots per end
     */
    getEndSize(): number {
        return this.endSize;
    }

    /**
     * Add an end to the score card
     * @param end the end
     */
    addEnd(end: End): void {
        if(end.getShots().length !== this.endSize){
            throw new Error("Ends must be the same length: given " + end.getShots().length + ", expected " + this.endSize);
        }
        this.ends.push(end);
    }

    /**
     * @returns the ends
     */
    getEnds(): End[] {
        return this.ends;
    }    

}

export = ScoreCard;
import End = require("./End");

/**
 * A score card
 */
class ScoreCard {

    private ends: End[];
    private created: Date;

    /**
     * Default constructor
     * @param endSize the number of shots per end
     * @param name the name of the score card
     * @param created when the score card was created
     */
    constructor(private endSize: number, private name: string, created?: Date){
        this.ends = [];
        if(!created){
            this.created = new Date();
        } else {
            this.created = created;
        }
    }

    /**
     * @returns the number of shots per end
     */
    getEndSize(): number {
        return this.endSize;
    }

    /**
     * @returns the name of the score card
     */
    getName(): string {
        return this.name;
    }

    /**
     * @returns the date the score card was created
     */
    getCreatedDate(): Date {
        return this.created;
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
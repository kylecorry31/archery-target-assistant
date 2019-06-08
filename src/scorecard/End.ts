import Shot = require('./Shot');

/**
 * An archery end
 */
class End {
    /**
     * Default constructor
     * @param scores the scores for the arrow group
     * @param groupCircumference the group circumference in inches (on-target) (optional)
     */
    constructor(private shots: Shot[], private groupCircumference?: number){
        // TODO: Error checking
    }

    /**
     * @returns the shots
     */
    getShots(): Shot[] {
        return this.shots;
    }

    /**
     * @returns the group circumference in inches if available
     */
    getGroupCircumference(): number | undefined {
        return this.groupCircumference;
    }

    /**
     * @returns the score of the end
     */
    getScore(): number {
        return this.shots.map(shot => shot.getValue()).reduce((a, b) => a + b);
    }

    /**
     * @returns the accuracy of the end (hits / total shots)
     */
    getAccuracy(): number {
        if (this.shots.length === 0){
            return 0;
        }
        return 1 - (this.getNumMisses() / this.shots.length);
    }

    /**
     * @returns the number of misses (display is M)
     */
    getNumMisses(): number {
        return this.shots.filter(shot => shot.getDisplay() === Shot.DISPLAY_MISS).length;
    }

    /**
     * @returns the number of bullseyes (display is X)
     */
    getNumBullseyes(): number {
        return this.shots.filter(shot => shot.getDisplay() === Shot.DISPLAY_BULLSEYE).length;
    }
}

export = End;
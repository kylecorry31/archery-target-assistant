import Target = require("./Target");
import TargetRing = require("./TargetRing");

const CENTIMETERS_TO_INCHES = 0.393701;

class TargetFactory {

    private constructor(){}

    /**
     * @returns an 80 centimeter standard competition target
     */
    public static get80CmCompetitionTarget(): Target {
        let targetSize = 80 * CENTIMETERS_TO_INCHES;
        return this.createIncrementalTarget(targetSize, 10);
    }

    /**
     * @returns a 122 centimeter standard competition target
     */
    public static get122CmCompetitionTarget(): Target {
        let targetSize = 122 * CENTIMETERS_TO_INCHES;
        return this.createIncrementalTarget(targetSize, 10);
    }

    private static createIncrementalTarget(targetSize: number, numRings: number){       
        let rings: TargetRing[] = [];
        for (let i = 0; i < numRings; i++){
            let targetIncrement = (targetSize / 2) / numRings;
            rings.push(new TargetRing(targetIncrement * i, targetIncrement * (i + 1), (numRings - i)));
        }

        return new Target(rings);
    }

}

export = TargetFactory;
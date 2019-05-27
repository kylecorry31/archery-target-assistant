import Scorer = require("./Scorer");
import Target = require("../entities/Target");

class PointCard {

    /**
     * Default constructor
     * @param scorer the scoring strategy
     */
    constructor(private scorer: Scorer){}

    public generatePointCard(target: Target): string {
        let arrows = target.getArrows();
        let str = "";
        for(let i = 0; i < arrows.length; i++){
            let arrow = arrows[i];
            let arrowScore = this.scorer.getArrowScore(target, arrow);
            let arrowIdx = i + 1;
            if (arrowScore === 0){
                str += arrowIdx + ": M\n";
            } else {
                str += arrowIdx + ": " + arrowScore + "\n";
            }
        }
        str += "Total score: " + this.scorer.getScore(target);
        return str;
    }

}

export = PointCard;
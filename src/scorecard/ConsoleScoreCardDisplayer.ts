import ScoreCardDisplayer = require("./ScoreCardDisplayer");
import ScoreCard = require("./ScoreCard");

/**
 * A score card displayer in the console
 */
class ConsoleScoreCardDisplayer implements ScoreCardDisplayer {
    
    display(scoreCard: ScoreCard): void {
        let titleStr = '|';
        for (let i = 0; i < scoreCard.getEndSize(); i++){
            titleStr += ` Shot ${i + 1} |`;
        }
        titleStr += ' Total | Grouping (in) |\n';
        console.log(titleStr);
        for (let end of scoreCard.getEnds()){
            let endStr = '|';
            for(let shot of end.getShots()){
                endStr += ` ${shot.getDisplay()} |`
            }
            endStr += ` ${end.getScore()} | ${end.getGroupCircumference()} |\n`
            console.log(endStr);
        }
    }

}

export = ConsoleScoreCardDisplayer;
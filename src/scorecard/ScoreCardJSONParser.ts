import ScoreCard = require("./ScoreCard");
import Shot = require("./Shot");
import End = require("./End");

class ScoreCardJSONParser {
    private constructor(){}

    /**
     * Parse a score card from JSON
     * @param json the json in the same format as assets/scorecard.json
     */
    static parse(json: any): ScoreCard | undefined {
        let endSize = json.endSize;
        let name = json.name;
        let created = new Date(json.created);
        let ends = [];
        for (let end of json.ends){
            let shots = [];
            for(let shot of end.shots){
                if (shot === 'M'){
                    shots.push(Shot.createMiss());
                } else if (shot === 'X'){
                    shots.push(Shot.createBullseye());
                } else {
                    shots.push(new Shot(parseInt(shot)));
                }
            }
            let circumference: number | undefined;
            if (end.groupCircumference){
                circumference = end.groupCircumference as number;
            }
            ends.push(new End(shots, circumference));
        }
        let scoreCard = new ScoreCard(endSize, name, created);
        for(let end of ends){
            scoreCard.addEnd(end);
        }
        return scoreCard;
    }

    /**
     * Convert a score card to JSON
     * @return JSON in the same format as assets/scorecard.json
     */
    static toJSON(scoreCard: ScoreCard): any {
        let endSize = scoreCard.getEndSize();
        let created = scoreCard.getCreatedDate().getTime();
        let name = scoreCard.getName();
        let ends = [];
        for (let end of scoreCard.getEnds()){
            let shots = [];
            for(let shot of end.getShots()){
                shots.push(shot.getDisplay());
            }
            let circumference = end.getGroupCircumference();
            if (circumference){
                ends.push({shots: shots, groupCircumference: circumference});
            } else {
                ends.push({shots: shots});
            }
        }
        return {endSize: endSize, ends: ends, name: name, created: created};
    }
}

export = ScoreCardJSONParser;
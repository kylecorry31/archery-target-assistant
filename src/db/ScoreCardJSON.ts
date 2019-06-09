import Shot = require("../scorecard/Shot");
import End = require("../scorecard/End");
import ScoreCard = require("../scorecard/ScoreCard");
import ScoreCardDAO = require("./ScoreCardDAO");
import Utils = require('../Uitls');

class ScoreCardJSON {

    /**
     * Converts a score card to JSON
     * @returns the score card in JSON
     * @throws if invalid score card DAO
     */
    static toJSON(scoreCardDAO: ScoreCardDAO): any {
        Utils.requireNonNull(scoreCardDAO);
        let scoreCard = scoreCardDAO.getScoreCard();
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
        return {endSize: endSize, ends: ends, name: name, created: created, id: scoreCardDAO.getID()};
    }

    /**
     * Parse a score card from JSON
     * @param json the json to parse the score card from
     * @throws if unable to parse JSON
     */
    static parse(json: any): ScoreCardDAO {
        try {
            let endSize = Utils.requireNonNull(json.endSize as number);
            let id = Utils.requireNonNull(json.id as number);
            let name = Utils.requireNonNull(json.name as string);
            let created = new Date(Utils.requireNonNull(json.created as number));
            Utils.requireNonNull(json.ends);
            let ends = [];
            for (let end of json.ends){
                let shots = [];
                Utils.requireNonNull(end.shots);
                for(let shot of end.shots){
                    Utils.requireNonNull(shot);
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
            return new ScoreCardDAO(scoreCard, id);
        } catch (e) {
            throw new Error("Unable to parse score card from JSON");
        }
    }
}

export = ScoreCardJSON;
import ScoreCard = require("../scorecard/ScoreCard");

class ScoreCardDAO {
    constructor(private scoreCard: ScoreCard, private id: number){}

    getScoreCard(): ScoreCard {
        return this.scoreCard;
    }

    getID(): number {
        return this.id;
    }
}

export = ScoreCardDAO;
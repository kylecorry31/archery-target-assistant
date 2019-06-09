import ScoreCard = require("../scorecard/ScoreCard");
import ScoreCardDAO = require("./ScoreCardDAO");

interface ScoreCardDatabase {
    getAll(): Promise<ScoreCardDAO[]>;
    get(id: number): Promise<ScoreCardDAO | null>;
    put(scoreCard: ScoreCard): Promise<ScoreCardDAO>;
    update(scoreCard: ScoreCardDAO): Promise<void>;
    delete(id: number): Promise<boolean>;
    clear(): Promise<void>;
}

export = ScoreCardDatabase;
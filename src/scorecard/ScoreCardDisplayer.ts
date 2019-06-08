import ScoreCard = require("./ScoreCard");

/**
 * An interface for score card displayers
 */
interface ScoreCardDisplayer {
    
    /**
     * Displays the score card
     * @param scoreCard the score card
     */
    display(scoreCard: ScoreCard): void;

}

export = ScoreCardDisplayer;
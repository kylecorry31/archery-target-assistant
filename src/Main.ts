import HTMLTableScoreCardDisplayer = require("./scorecard/HTMLTableScoreCardDisplayer");
import ScoreCardChooser = require("./ui/ScoreCardChooser");
import LocalStorageDB = require("./db/LocalStorageDB");
import ScoreCardDAO = require("./db/ScoreCardDAO");
import ScoreCardCreator = require("./ui/ScoreCardCreator");

let db = new LocalStorageDB();
let newBtn = document.getElementById('new');

db.getAll().then(cardDAOs => {
    if(cardDAOs.length === 0){
        createNewScoreCard();
        return;
    }
    let cards = cardDAOs.map(dao => dao.getScoreCard());
    let scoreCardChooser = new ScoreCardChooser(cards);
    document.body.appendChild(scoreCardChooser);
    scoreCardChooser.addEventListener('score-card-selected', ev => {
        let customEv = ev as CustomEvent;
        var id = customEv.detail.id as number;
        showScoreCard(cardDAOs[id]);
    });
}, () => db.clear());

if(newBtn){
    newBtn.addEventListener('click', createNewScoreCard);
}

function createNewScoreCard(){
    let creator = new ScoreCardCreator(db);
    document.body.appendChild(creator);
    creator.addEventListener('create', ev => {
        let customEv = ev as CustomEvent;
        showScoreCard(customEv.detail as ScoreCardDAO);
    })
}

function showScoreCard(scoreCard: ScoreCardDAO){
    let displayer = new HTMLTableScoreCardDisplayer(document.body);
    displayer.display(scoreCard.getScoreCard());
    
    displayer.setOnAddListener(() => {
        db.update(scoreCard).then(() => console.log("Updated card #" + scoreCard.getID()));
    });
}

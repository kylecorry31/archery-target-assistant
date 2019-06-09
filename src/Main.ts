import ScoreCard = require("./scorecard/ScoreCard");
import HTMLTableScoreCardDisplayer = require("./scorecard/HTMLTableScoreCardDisplayer");
import End = require("./scorecard/End");
import Shot = require("./scorecard/Shot");
import ScoreCardJSONParser = require("./scorecard/ScoreCardJSONParser");
import ListView = require('./ui/ListView');
import ScoreCardChooser = require("./ui/ScoreCardChooser");


let fromLocalStorage = localStorage.getItem('scorecard');
let newBtn = document.getElementById('new');

if (fromLocalStorage){
    let json: any[] = JSON.parse(fromLocalStorage);
    let cards = [];
    for(let i = 0; i < json.length; i++){
        let parsed = ScoreCardJSONParser.parse(json[i]);
        if (!parsed){
            throw new Error("Could not parse scorecard from localstorage");
        }
        cards.push(parsed);
    }

    let scoreCardChooser = new ScoreCardChooser(cards);
    document.body.appendChild(scoreCardChooser);
    scoreCardChooser.addEventListener('score-card-selected', ev => {
        let customEv = ev as CustomEvent;
        var scoreCard = customEv.detail.card as ScoreCard;
        var id = customEv.detail.id as number;
        showScoreCard(scoreCard, id);
    });
}

if(newBtn){
    newBtn.addEventListener('click', createNewScoreCard);
}

function createNewScoreCard(){

    let ls =  localStorage.getItem('scorecard');
    let id = 0;
    if (ls){
        id = JSON.parse(ls).length;
    }

    let endSize = prompt("Number of arrows per end");

    if(!endSize){
        alert("End size must be given");
        location.reload();
        throw new Error("End size must be given");
    }

    let name = prompt("Score card name");

    if (!name){
        name = "Score Card";
    }

    showScoreCard(new ScoreCard(parseInt(endSize), name), id);
}

function showScoreCard(scoreCard: ScoreCard, id?: number){
    let displayer = new HTMLTableScoreCardDisplayer(document.body);
    displayer.display(scoreCard);
    
    displayer.setOnAddListener(() => {
        let json = ScoreCardJSONParser.toJSON(scoreCard);
        json.lastModified = Date.now();
        let fromLocalStorage = localStorage.getItem('scorecard');
        if (fromLocalStorage){
            let localJson = JSON.parse(fromLocalStorage);
            if (id != null){
                localJson[id] = json;
            } else {
                localJson.push(json);
                id = localJson.length;
            }
            localStorage.setItem('scorecard', JSON.stringify(localJson));
        } else {
            localStorage.setItem('scorecard', JSON.stringify([json]));
            id = 0;
        }
    });
}

import ScoreCard = require("./scorecard/ScoreCard");
import HTMLTableScoreCardDisplayer = require("./scorecard/HTMLTableScoreCardDisplayer");
import End = require("./scorecard/End");
import Shot = require("./scorecard/Shot");
import ScoreCardJSONParser = require("./scorecard/ScoreCardJSONParser");

let fromLocalStorage = localStorage.getItem('scorecard');

if (fromLocalStorage){
    let json: any[] = JSON.parse(fromLocalStorage);
    // TODO: display all saved cards and let user choose
    for(let i = 0; i < json.length; i++){
        let parsed = ScoreCardJSONParser.parse(json[i]);
        if (!parsed){
            throw new Error("Could not parse scorecard from localstorage");
        }
        showScoreCard(parsed, i);
    }
} else {
    let endSize = prompt("Number of arrows per end");

    if(!endSize){
        alert("End size must be given");
        location.reload();
        throw new Error("End size must be given");
    }

    showScoreCard(new ScoreCard(parseInt(endSize)));
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

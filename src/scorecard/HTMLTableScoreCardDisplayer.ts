import ScoreCardDisplayer = require("./ScoreCardDisplayer");
import ScoreCard = require("./ScoreCard");
import Shot = require("./Shot");
import End = require("./End");

class HTMLTableScoreCardDisplayer implements ScoreCardDisplayer {

    private listener: any;

    constructor(private element: HTMLElement){

    }
    
    display(scoreCard: ScoreCard): void {
        let html = '<table class="score-card-table">';
        let titleStr = '<tr class="score-card-table-head">';
        for (let i = 0; i < scoreCard.getEndSize(); i++){
            titleStr += `<th>Shot ${i + 1}</th>`;
        }
        titleStr += '<th class="score-card-table-stats-start">Total</th><th>Grouping (in)</th><th></th></tr>';
        html += titleStr;


        for (let end of scoreCard.getEnds()){
            let endStr = '<tr class="score-card-table-end">';
            for(let shot of end.getShots()){
                endStr += `<td class="score-card-table-item">${shot.getDisplay()}</td>`
            }
            endStr += `<td class="score-card-table-item score-card-table-stats-start">${end.getScore()}</td><td class="score-card-table-item">${end.getGroupCircumference() || ''}</td><td></td></tr>`
            html += endStr;
        }

        let addStr = '<tr class="score-card-table-add">';
        for (let i = 0; i < scoreCard.getEndSize(); i++){
            addStr += `<td class="score-card-table-input"><input type="text" id="shot-${i}"/></td>`;
        }
        addStr += '<td class="score-card-table-input"></td><td class="score-card-table-input"><input type="number" id="grouping"/></td><td class="score-card-table-input"><button id="submit">Add</button></td></tr>';
        html += addStr;

        this.element.innerHTML = html + '</table>';

        let btn = this.element.querySelector('#submit');
        if (btn){
            btn.addEventListener('click', () => {
                let shots: Shot[] = [];
                for (let i = 0; i < scoreCard.getEndSize(); i++){
                    let shot = document.querySelector(`#shot-${i}`) as HTMLInputElement;
                    if (shot){
                        // TODO: error if shot is blank or not a number/M/X
                        let shotValue = shot.value;
                        if(shotValue === 'M'){
                            shots.push(Shot.createMiss());
                        } else if (shotValue === 'X'){
                            shots.push(Shot.createBullseye());
                        } else {
                            shots.push(new Shot(parseInt(shotValue)));
                        }
                    }
                }
                let grouping = document.querySelector(`#grouping`) as HTMLInputElement;
                let groupingCircumference: number | undefined;
                if (grouping){
                    groupingCircumference = parseFloat(grouping.value);
                }

                let end = new End(shots, groupingCircumference);
                scoreCard.addEnd(end);
                if(this.listener){
                    this.listener();
                }
                this.display(scoreCard);
            });
        }
    }

    setOnAddListener(listener: any){
        this.listener = listener;
    }

}

export = HTMLTableScoreCardDisplayer;
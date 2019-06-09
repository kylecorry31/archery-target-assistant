import ScoreCard = require("../scorecard/ScoreCard");
import ListView = require("./ListView");

class ScoreCardChooser extends HTMLElement {

    private shadow: ShadowRoot;

    constructor(private scoreCards: ScoreCard[]){
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        var listAdapter = [];

        for(let card of this.scoreCards){
            let subtitle = `Created on ${card.getCreatedDate().toLocaleDateString()} - Total score of ${card.getEnds().map(end => end.getScore()).reduce((a, b) => a + b)}`;
            listAdapter.push({title: card.getName(), subtitle: subtitle, value: card});
        }

        var listView = new ListView(listAdapter);
        listView.addEventListener('item-click', ev => {
            let event = ev as CustomEvent;
            let outEvent = new CustomEvent('score-card-selected', {
                detail: {
                    card: event.detail.value,
                    id: event.detail.position
                }
            });
            this.dispatchEvent(outEvent);
        });
        this.shadow.appendChild(listView);
    }

}

window.customElements.define('score-card-chooser', ScoreCardChooser);
export = ScoreCardChooser;
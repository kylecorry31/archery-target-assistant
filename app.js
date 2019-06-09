define("scorecard/Shot", ["require", "exports"], function (require, exports) {
    "use strict";
    class Shot {
        constructor(value, display) {
            this.value = value;
            if (!display) {
                this.display = value.toString();
            }
            else {
                this.display = display;
            }
        }
        getValue() {
            return this.value;
        }
        getDisplay() {
            return this.display;
        }
        static createMiss() {
            return new Shot(0, this.DISPLAY_MISS);
        }
        static createBullseye() {
            return new Shot(10, this.DISPLAY_BULLSEYE);
        }
    }
    Shot.DISPLAY_MISS = 'M';
    Shot.DISPLAY_BULLSEYE = 'X';
    return Shot;
});
define("scorecard/End", ["require", "exports", "scorecard/Shot"], function (require, exports, Shot) {
    "use strict";
    class End {
        constructor(shots, groupCircumference) {
            this.shots = shots;
            this.groupCircumference = groupCircumference;
        }
        getShots() {
            return this.shots;
        }
        getGroupCircumference() {
            return this.groupCircumference;
        }
        getScore() {
            return this.shots.map(shot => shot.getValue()).reduce((a, b) => a + b);
        }
        getAccuracy() {
            if (this.shots.length === 0) {
                return 0;
            }
            return 1 - (this.getNumMisses() / this.shots.length);
        }
        getNumMisses() {
            return this.shots.filter(shot => shot.getDisplay() === Shot.DISPLAY_MISS).length;
        }
        getNumBullseyes() {
            return this.shots.filter(shot => shot.getDisplay() === Shot.DISPLAY_BULLSEYE).length;
        }
    }
    return End;
});
define("scorecard/ScoreCard", ["require", "exports"], function (require, exports) {
    "use strict";
    class ScoreCard {
        constructor(endSize, name, created) {
            this.endSize = endSize;
            this.name = name;
            this.ends = [];
            if (!created) {
                this.created = new Date();
            }
            else {
                this.created = created;
            }
        }
        getEndSize() {
            return this.endSize;
        }
        getName() {
            return this.name;
        }
        getCreatedDate() {
            return this.created;
        }
        addEnd(end) {
            if (end.getShots().length !== this.endSize) {
                throw new Error("Ends must be the same length: given " + end.getShots().length + ", expected " + this.endSize);
            }
            this.ends.push(end);
        }
        getEnds() {
            return this.ends;
        }
    }
    return ScoreCard;
});
define("scorecard/ScoreCardDisplayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("scorecard/HTMLTableScoreCardDisplayer", ["require", "exports", "scorecard/Shot", "scorecard/End"], function (require, exports, Shot, End) {
    "use strict";
    class HTMLTableScoreCardDisplayer {
        constructor(element) {
            this.element = element;
        }
        display(scoreCard) {
            let html = '<table class="score-card-table">';
            let titleStr = '<tr class="score-card-table-head">';
            for (let i = 0; i < scoreCard.getEndSize(); i++) {
                titleStr += `<th>Shot ${i + 1}</th>`;
            }
            titleStr += '<th class="score-card-table-stats-start">Total</th><th>Grouping (in)</th><th></th></tr>';
            html += titleStr;
            for (let end of scoreCard.getEnds()) {
                let endStr = '<tr class="score-card-table-end">';
                for (let shot of end.getShots()) {
                    endStr += `<td class="score-card-table-item">${shot.getDisplay()}</td>`;
                }
                endStr += `<td class="score-card-table-item score-card-table-stats-start">${end.getScore()}</td><td class="score-card-table-item">${end.getGroupCircumference() || ''}</td><td></td></tr>`;
                html += endStr;
            }
            let addStr = '<tr class="score-card-table-add">';
            for (let i = 0; i < scoreCard.getEndSize(); i++) {
                addStr += `<td class="score-card-table-input"><input type="text" id="shot-${i}"/></td>`;
            }
            addStr += '<td class="score-card-table-input"></td><td class="score-card-table-input"><input type="number" id="grouping"/></td><td class="score-card-table-input"><button id="submit">Add</button></td></tr>';
            html += addStr;
            this.element.innerHTML = html + '</table>';
            let btn = this.element.querySelector('#submit');
            if (btn) {
                btn.addEventListener('click', () => {
                    let shots = [];
                    for (let i = 0; i < scoreCard.getEndSize(); i++) {
                        let shot = document.querySelector(`#shot-${i}`);
                        if (shot) {
                            let shotValue = shot.value;
                            if (shotValue === 'M') {
                                shots.push(Shot.createMiss());
                            }
                            else if (shotValue === 'X') {
                                shots.push(Shot.createBullseye());
                            }
                            else {
                                shots.push(new Shot(parseInt(shotValue)));
                            }
                        }
                    }
                    let grouping = document.querySelector(`#grouping`);
                    let groupingCircumference;
                    if (grouping) {
                        groupingCircumference = parseFloat(grouping.value);
                    }
                    let end = new End(shots, groupingCircumference);
                    scoreCard.addEnd(end);
                    if (this.listener) {
                        this.listener();
                    }
                    this.display(scoreCard);
                });
            }
        }
        setOnAddListener(listener) {
            this.listener = listener;
        }
    }
    return HTMLTableScoreCardDisplayer;
});
define("scorecard/ScoreCardJSONParser", ["require", "exports", "scorecard/ScoreCard", "scorecard/Shot", "scorecard/End"], function (require, exports, ScoreCard, Shot, End) {
    "use strict";
    class ScoreCardJSONParser {
        constructor() { }
        static parse(json) {
            let endSize = json.endSize;
            let name = json.name;
            let created = new Date(json.created);
            let ends = [];
            for (let end of json.ends) {
                let shots = [];
                for (let shot of end.shots) {
                    if (shot === 'M') {
                        shots.push(Shot.createMiss());
                    }
                    else if (shot === 'X') {
                        shots.push(Shot.createBullseye());
                    }
                    else {
                        shots.push(new Shot(parseInt(shot)));
                    }
                }
                let circumference;
                if (end.groupCircumference) {
                    circumference = end.groupCircumference;
                }
                ends.push(new End(shots, circumference));
            }
            let scoreCard = new ScoreCard(endSize, name, created);
            for (let end of ends) {
                scoreCard.addEnd(end);
            }
            return scoreCard;
        }
        static toJSON(scoreCard) {
            let endSize = scoreCard.getEndSize();
            let created = scoreCard.getCreatedDate().getTime();
            let name = scoreCard.getName();
            let ends = [];
            for (let end of scoreCard.getEnds()) {
                let shots = [];
                for (let shot of end.getShots()) {
                    shots.push(shot.getDisplay());
                }
                let circumference = end.getGroupCircumference();
                if (circumference) {
                    ends.push({ shots: shots, groupCircumference: circumference });
                }
                else {
                    ends.push({ shots: shots });
                }
            }
            return { endSize: endSize, ends: ends, name: name, created: created };
        }
    }
    return ScoreCardJSONParser;
});
define("ui/ListView", ["require", "exports"], function (require, exports) {
    "use strict";
    class ListView extends HTMLElement {
        constructor(items) {
            super();
            this.items = items;
            this.shadow = this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            var style = document.createElement('style');
            style.innerHTML = `
            :host {
                --hover-bg-color: rgba(0, 0, 0, 0.12);
            }

            .list-item {
                width: calc(100% - 32px);
                padding: 12px 16px;
                min-height: 64px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .item-title {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
                padding: 0;
                height: 28px;
            }

            .item-subtitle {
                font-size: 12px;
                font-weight: normal;
                margin: 0;
                padding: 0;
                height: 28px;
                opacity: 0.6;
            }

            .list-item:hover {
                background-color: var(--hover-bg-color);
            }
        `;
            this.shadow.appendChild(style);
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                let div = document.createElement('div');
                div.className = 'list-item';
                div.innerHTML = `<p class="item-title">${item.title}</p>${item.subtitle ? `<p class="item-subtitle">${item.subtitle}</p>` : ''}`;
                div.addEventListener('click', this.onItemClick.bind(this, i));
                this.shadow.appendChild(div);
            }
        }
        onItemClick(index) {
            var event = new CustomEvent('item-click', {
                detail: {
                    value: this.items[index].value,
                    title: this.items[index].title,
                    subtitle: this.items[index].subtitle,
                    position: index
                }
            });
            this.dispatchEvent(event);
        }
    }
    window.customElements.define('list-view', ListView);
    return ListView;
});
define("ui/ScoreCardChooser", ["require", "exports", "ui/ListView"], function (require, exports, ListView) {
    "use strict";
    class ScoreCardChooser extends HTMLElement {
        constructor(scoreCards) {
            super();
            this.scoreCards = scoreCards;
            this.shadow = this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            var listAdapter = [];
            for (let card of this.scoreCards) {
                let subtitle = `Created on ${card.getCreatedDate().toLocaleDateString()} - Total score of ${card.getEnds().map(end => end.getScore()).reduce((a, b) => a + b)}`;
                listAdapter.push({ title: card.getName(), subtitle: subtitle, value: card });
            }
            var listView = new ListView(listAdapter);
            listView.addEventListener('item-click', ev => {
                let event = ev;
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
    return ScoreCardChooser;
});
define("Main", ["require", "exports", "scorecard/ScoreCard", "scorecard/HTMLTableScoreCardDisplayer", "scorecard/ScoreCardJSONParser", "ui/ScoreCardChooser"], function (require, exports, ScoreCard, HTMLTableScoreCardDisplayer, ScoreCardJSONParser, ScoreCardChooser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let fromLocalStorage = localStorage.getItem('scorecard');
    let newBtn = document.getElementById('new');
    if (fromLocalStorage) {
        let json = JSON.parse(fromLocalStorage);
        let cards = [];
        for (let i = 0; i < json.length; i++) {
            let parsed = ScoreCardJSONParser.parse(json[i]);
            if (!parsed) {
                throw new Error("Could not parse scorecard from localstorage");
            }
            cards.push(parsed);
        }
        let scoreCardChooser = new ScoreCardChooser(cards);
        document.body.appendChild(scoreCardChooser);
        scoreCardChooser.addEventListener('score-card-selected', ev => {
            let customEv = ev;
            var scoreCard = customEv.detail.card;
            var id = customEv.detail.id;
            showScoreCard(scoreCard, id);
        });
    }
    if (newBtn) {
        newBtn.addEventListener('click', createNewScoreCard);
    }
    function createNewScoreCard() {
        let ls = localStorage.getItem('scorecard');
        let id = 0;
        if (ls) {
            id = JSON.parse(ls).length;
        }
        let endSize = prompt("Number of arrows per end");
        if (!endSize) {
            alert("End size must be given");
            location.reload();
            throw new Error("End size must be given");
        }
        let name = prompt("Score card name");
        if (!name) {
            name = "Score Card";
        }
        showScoreCard(new ScoreCard(parseInt(endSize), name), id);
    }
    function showScoreCard(scoreCard, id) {
        let displayer = new HTMLTableScoreCardDisplayer(document.body);
        displayer.display(scoreCard);
        displayer.setOnAddListener(() => {
            let json = ScoreCardJSONParser.toJSON(scoreCard);
            json.lastModified = Date.now();
            let fromLocalStorage = localStorage.getItem('scorecard');
            if (fromLocalStorage) {
                let localJson = JSON.parse(fromLocalStorage);
                if (id != null) {
                    localJson[id] = json;
                }
                else {
                    localJson.push(json);
                    id = localJson.length;
                }
                localStorage.setItem('scorecard', JSON.stringify(localJson));
            }
            else {
                localStorage.setItem('scorecard', JSON.stringify([json]));
                id = 0;
            }
        });
    }
});
define("scorecard/ConsoleScoreCardDisplayer", ["require", "exports"], function (require, exports) {
    "use strict";
    class ConsoleScoreCardDisplayer {
        display(scoreCard) {
            let titleStr = '|';
            for (let i = 0; i < scoreCard.getEndSize(); i++) {
                titleStr += ` Shot ${i + 1} |`;
            }
            titleStr += ' Total | Grouping (in) |\n';
            console.log(titleStr);
            for (let end of scoreCard.getEnds()) {
                let endStr = '|';
                for (let shot of end.getShots()) {
                    endStr += ` ${shot.getDisplay()} |`;
                }
                endStr += ` ${end.getScore()} | ${end.getGroupCircumference()} |\n`;
                console.log(endStr);
            }
        }
    }
    return ConsoleScoreCardDisplayer;
});
//# sourceMappingURL=app.js.map
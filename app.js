var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
define("Uitls", ["require", "exports"], function (require, exports) {
    "use strict";
    class Utils {
        constructor() { }
        static requireNonNull(obj) {
            if (obj == null || obj == undefined || typeof obj === 'undefined') {
                throw new Error("Null pointer error");
            }
            return obj;
        }
    }
    return Utils;
});
define("scorecard/ScoreCard", ["require", "exports", "Uitls"], function (require, exports, Utils) {
    "use strict";
    class ScoreCard {
        constructor(endSize, name, created) {
            this.endSize = endSize;
            this.name = name;
            Utils.requireNonNull(endSize);
            Utils.requireNonNull(name);
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
                let subtitle = `Created on ${card.getCreatedDate().toLocaleDateString()} - Total score of ${card.getEnds().map(end => end.getScore()).reduce((a, b) => a + b, 0)}`;
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
define("db/ScoreCardDAO", ["require", "exports"], function (require, exports) {
    "use strict";
    class ScoreCardDAO {
        constructor(scoreCard, id) {
            this.scoreCard = scoreCard;
            this.id = id;
        }
        getScoreCard() {
            return this.scoreCard;
        }
        getID() {
            return this.id;
        }
    }
    return ScoreCardDAO;
});
define("db/ScoreCardDatabase", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("db/ScoreCardJSON", ["require", "exports", "scorecard/Shot", "scorecard/End", "scorecard/ScoreCard", "db/ScoreCardDAO", "Uitls"], function (require, exports, Shot, End, ScoreCard, ScoreCardDAO, Utils) {
    "use strict";
    class ScoreCardJSON {
        static toJSON(scoreCardDAO) {
            Utils.requireNonNull(scoreCardDAO);
            let scoreCard = scoreCardDAO.getScoreCard();
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
            return { endSize: endSize, ends: ends, name: name, created: created, id: scoreCardDAO.getID() };
        }
        static parse(json) {
            try {
                let endSize = Utils.requireNonNull(json.endSize);
                let id = Utils.requireNonNull(json.id);
                let name = Utils.requireNonNull(json.name);
                let created = new Date(Utils.requireNonNull(json.created));
                Utils.requireNonNull(json.ends);
                let ends = [];
                for (let end of json.ends) {
                    let shots = [];
                    Utils.requireNonNull(end.shots);
                    for (let shot of end.shots) {
                        Utils.requireNonNull(shot);
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
                return new ScoreCardDAO(scoreCard, id);
            }
            catch (e) {
                throw new Error("Unable to parse score card from JSON");
            }
        }
    }
    return ScoreCardJSON;
});
define("db/LocalStorageDB", ["require", "exports", "db/ScoreCardDAO", "db/ScoreCardJSON", "Uitls"], function (require, exports, ScoreCardDAO, ScoreCardJSON, Utils) {
    "use strict";
    class LocalStorageDB {
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                let jsonStr = localStorage.getItem(LocalStorageDB.KEY);
                if (!jsonStr) {
                    return [];
                }
                let json = JSON.parse(jsonStr);
                let daos = [];
                for (let card of json) {
                    let dao = ScoreCardJSON.parse(card);
                    daos.push(dao);
                }
                return daos;
            });
        }
        get(id) {
            return __awaiter(this, void 0, void 0, function* () {
                Utils.requireNonNull(id);
                let daos = yield this.getAll();
                let filtered = daos.filter(dao => dao.getID() === id);
                if (filtered.length !== 0) {
                    return filtered[0];
                }
                return null;
            });
        }
        put(scoreCard) {
            return __awaiter(this, void 0, void 0, function* () {
                Utils.requireNonNull(scoreCard);
                let daos = yield this.getAll();
                let maxID = -1;
                for (let dao of daos) {
                    if (dao.getID() > maxID) {
                        maxID = dao.getID();
                    }
                }
                let id = maxID + 1;
                let dao = new ScoreCardDAO(scoreCard, id);
                daos.push(dao);
                this.saveAll(daos);
                return dao;
            });
        }
        update(scoreCard) {
            return __awaiter(this, void 0, void 0, function* () {
                Utils.requireNonNull(scoreCard);
                let id = scoreCard.getID();
                let daos = yield this.getAll();
                let oldDao = yield this.get(id);
                if (oldDao) {
                    let idx = daos.indexOf(oldDao);
                    daos.splice(idx, 1);
                    daos.push(scoreCard);
                    this.saveAll(daos);
                }
                else {
                    throw new Error("Score card not found");
                }
            });
        }
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let daos = yield this.getAll();
                let oldDao = yield this.get(id);
                if (oldDao) {
                    let idx = daos.indexOf(oldDao);
                    daos.splice(idx, 1);
                    this.saveAll(daos);
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        clear() {
            localStorage.removeItem(LocalStorageDB.KEY);
            return Promise.resolve();
        }
        saveAll(daos) {
            let json = [];
            for (let dao of daos) {
                json.push(ScoreCardJSON.toJSON(dao));
            }
            localStorage.setItem(LocalStorageDB.KEY, JSON.stringify(json));
        }
    }
    LocalStorageDB.KEY = "scorecards";
    return LocalStorageDB;
});
define("ui/ScoreCardCreator", ["require", "exports", "scorecard/ScoreCard"], function (require, exports, ScoreCard) {
    "use strict";
    class ScoreCardCreator extends HTMLElement {
        constructor(db) {
            super();
            this.db = db;
            this.shadow = this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.shadow.innerHTML = `
            <style>
                :host {
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.6);
                    --modal-bg-color: white;
                }
                .modal {
                    width: 450px;
                    height: 450px;
                    max-width: calc(100% - 32px);
                    max-height: calc(100% - 32px);
                    z-index: 1000;
                    background: var(--modal-bg-color);
                    border-radius: 4px;
                    padding: 16px;
                }
                .input {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 16px;
                }
                input {
                    width: calc(100% - 32px);
                    height: 100%;
                    padding: 12px 16px;
                    margin: 0;
                    border: 0;
                    outline: 0;
                    background: rgba(255, 255, 255, 0.12);
                    color: #ffffff;
                }
                input:focus {
                    background: rgba(255, 255, 255, 0.24);
                }
                button {
                    padding: 12px 16px;
                    text-align: center;
                    margin: 0;
                    border: 0;
                    outline: 0;
                    background: #1eb980;
                    color: #ffffff;
                    cursor: pointer;
                    border-radius: 4px;
                }
                
                button:hover, button:focus {
                    filter: brightness(110%);
                }
            </style>
            <form class="modal">
                <h1>Create a score card</h1>
                <div class="input">
                    <label for="name">Score card name</label>
                    <input id="name" type="text"/>
                </div>
                <div class="input">
                    <label for="shots">Shots per end</label>
                    <input id="shots" type="number"/>
                </div>
                <button id="create" type="submit">Create</button>
            </form>
        `;
            let createBtn = this.shadow.querySelector("#create");
            let shotsInpt = this.shadow.querySelector("#shots");
            let nameInpt = this.shadow.querySelector("#name");
            if (createBtn) {
                createBtn.addEventListener('click', ev => {
                    if (shotsInpt && nameInpt) {
                        let card = new ScoreCard(parseInt(shotsInpt.value), nameInpt.value);
                        this.db.put(card).then(dao => {
                            let ev = new CustomEvent('create', {
                                detail: dao
                            });
                            this.dispatchEvent(ev);
                        });
                    }
                    ev.preventDefault();
                });
            }
        }
    }
    window.customElements.define('score-card-creator', ScoreCardCreator);
    return ScoreCardCreator;
});
define("Main", ["require", "exports", "scorecard/HTMLTableScoreCardDisplayer", "ui/ScoreCardChooser", "db/LocalStorageDB", "ui/ScoreCardCreator"], function (require, exports, HTMLTableScoreCardDisplayer, ScoreCardChooser, LocalStorageDB, ScoreCardCreator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let db = new LocalStorageDB();
    let newBtn = document.getElementById('new');
    db.getAll().then(cardDAOs => {
        if (cardDAOs.length === 0) {
            createNewScoreCard();
            return;
        }
        let cards = cardDAOs.map(dao => dao.getScoreCard());
        let scoreCardChooser = new ScoreCardChooser(cards);
        document.body.appendChild(scoreCardChooser);
        scoreCardChooser.addEventListener('score-card-selected', ev => {
            let customEv = ev;
            var id = customEv.detail.id;
            showScoreCard(cardDAOs[id]);
        });
    }, () => db.clear());
    if (newBtn) {
        newBtn.addEventListener('click', createNewScoreCard);
    }
    function createNewScoreCard() {
        let creator = new ScoreCardCreator(db);
        document.body.appendChild(creator);
        creator.addEventListener('create', ev => {
            let customEv = ev;
            showScoreCard(customEv.detail);
        });
    }
    function showScoreCard(scoreCard) {
        let displayer = new HTMLTableScoreCardDisplayer(document.body);
        displayer.display(scoreCard.getScoreCard());
        displayer.setOnAddListener(() => {
            db.update(scoreCard).then(() => console.log("Updated card #" + scoreCard.getID()));
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
//# sourceMappingURL=app.js.map
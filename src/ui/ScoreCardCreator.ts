import ScoreCard = require("../scorecard/ScoreCard");
import ScoreCardDatabase = require("../db/ScoreCardDatabase");

class ScoreCardCreator extends HTMLElement {

    private shadow: ShadowRoot;

    constructor(private db: ScoreCardDatabase){
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
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
        let shotsInpt = this.shadow.querySelector("#shots") as HTMLInputElement;
        let nameInpt = this.shadow.querySelector("#name") as HTMLInputElement;

        if(createBtn){
            createBtn.addEventListener('click', ev => {
                if(shotsInpt && nameInpt){
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
export = ScoreCardCreator;
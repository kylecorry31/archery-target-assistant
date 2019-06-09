import ScoreCardDatabase = require("./ScoreCardDatabase");
import ScoreCardDAO = require("./ScoreCardDAO");
import ScoreCard = require("../scorecard/ScoreCard");
import ScoreCardJSON = require("./ScoreCardJSON");
import Utils = require('../Uitls');

class LocalStorageDB implements ScoreCardDatabase {

    private static readonly KEY = "scorecards";

    async getAll(): Promise<ScoreCardDAO[]> {
        let jsonStr = localStorage.getItem(LocalStorageDB.KEY);
        if (!jsonStr){
            return [];
        }
        let json = JSON.parse(jsonStr);
        let daos = [];
        for (let card of json){
            let dao = ScoreCardJSON.parse(card);
            daos.push(dao);
        }
        return daos;
    }    

    async get(id: number): Promise<ScoreCardDAO | null> {
        Utils.requireNonNull(id);
        let daos = await this.getAll();
        let filtered = daos.filter(dao => dao.getID() === id);
        if (filtered.length !== 0){
            return filtered[0];
        }
        return null;
    }

    async put(scoreCard: ScoreCard): Promise<ScoreCardDAO> {
        Utils.requireNonNull(scoreCard);
        let daos = await this.getAll();
        let maxID = -1;
        for (let dao of daos){
            if (dao.getID() > maxID){
                maxID = dao.getID();
            }
        }
        let id = maxID + 1;
        let dao = new ScoreCardDAO(scoreCard, id);
        daos.push(dao);
        this.saveAll(daos);
        return dao;
    }

    async update(scoreCard: ScoreCardDAO): Promise<void> {
        Utils.requireNonNull(scoreCard);
        let id = scoreCard.getID();
        let daos = await this.getAll();
        let oldDao = await this.get(id);
        if (oldDao){
            let idx = daos.indexOf(oldDao);
            daos.splice(idx, 1);
            daos.push(scoreCard);
            this.saveAll(daos);
        } else {
            throw new Error("Score card not found");
        }
    }

    async delete(id: number): Promise<boolean> {
        let daos = await this.getAll();
        let oldDao = await this.get(id);
        if (oldDao){
            let idx = daos.indexOf(oldDao);
            daos.splice(idx, 1);
            this.saveAll(daos);
            return true;
        } else {
            return false;
        }
    }

    clear(): Promise<void> {
        localStorage.removeItem(LocalStorageDB.KEY);
        return Promise.resolve();
    }

    private saveAll(daos: ScoreCardDAO[]){
        let json = [];
        for(let dao of daos){
            json.push(ScoreCardJSON.toJSON(dao));
        }
        localStorage.setItem(LocalStorageDB.KEY, JSON.stringify(json));
    }
}

export = LocalStorageDB;
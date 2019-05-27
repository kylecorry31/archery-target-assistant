///<reference path="../node_modules/@types/p5/global.d.ts"/>
import Arrow = require("./entities/Arrow");
import Target = require("./entities/Target");
import TargetRing = require("./entities/TargetRing");
import Scorer = require("./scoring/Scorer");
import LineBreakerHighestScorer = require("./scoring/LineBreakerHighestScorer");
import AccuracyStrategy = require("./accuracy/AccuracyStrategy");
import AverageAccuracyStrategy = require("./accuracy/AverageAccuracyStrategy");
import PrecisionStrategy = require("./precision/PrecisionStrategy");
import MeanRadiusPrecisionStrategy = require("./precision/MeanRadiusPrecisionStrategy");
import CEPPrecisionStrategy = require("./precision/CEPPrecisionStrategy");
import ExtremeSpreadPrecisionStrategy = require("./precision/ExtremeSpreadPrecisionStrategy");
import p5 = require("p5");
import TargetDrawer = require("./ui/TargetDrawer");
import CompetitionTargetDrawer = require("./ui/CompetitionTargetDrawer");
import ArrowDrawer = require("./ui/ArrowDrawer");
import CircleArrowDrawer = require("./ui/CircleArrowDrawer");

let minDim = Math.min(height, width);
let pixelsPerInch = 0.8 * minDim / 400;

rectMode(CENTER);

let target = new Target([
    new TargetRing(0, 20, 10),
    new TargetRing(20, 40, 9),
    new TargetRing(40, 60, 8),
    new TargetRing(60, 80, 7), 
    new TargetRing(80, 100, 6),
    new TargetRing(100, 120, 5),
    new TargetRing(120, 140, 4),
    new TargetRing(140, 160, 3),
    new TargetRing(160, 180, 2),
    new TargetRing(180, 200, 1)
]);
let scorer: Scorer = new LineBreakerHighestScorer();
let accuracy: AccuracyStrategy = new AverageAccuracyStrategy();
let precision: PrecisionStrategy = new CEPPrecisionStrategy(0.5);

let scoreElt = document.querySelector('#score');
let accuracyElt = document.querySelector('#accuracy');
let precisionElt = document.querySelector('#precision');
let arrowsElt = document.querySelector('#arrows');
let hitsMissesElt = document.querySelector('#hits-misses');

let targetDrawer: TargetDrawer = new CompetitionTargetDrawer();
let arrowDrawer: ArrowDrawer = new CircleArrowDrawer(5);

function draw(){
    background('#333');
    push();
    translate(width / 2, height / 2);
    scale(pixelsPerInch);
    targetDrawer.draw(target);
    fill(0);
    stroke(255);
    target.getArrows().forEach(arrow => arrowDrawer.draw(arrow));
    pop();
    requestAnimationFrame(draw);
}

resetMetrics();
requestAnimationFrame(draw);

document.body.addEventListener('mouseClicked', (data: any) => {
    let scaledX = (data.detail.clientX - width / 2) / pixelsPerInch;
    let scaledY = (data.detail.clientY - height / 2) / pixelsPerInch

    if (keyIsDown(16)){
        let arrows = target.getArrows();
        if (arrows.length === 0){
            return;
        }
        for(let arrow of arrows){
            let distance = (arrow: Arrow) => Math.hypot(arrow.getX() - scaledX, arrow.getY() - scaledY);
            let closest = [...arrows].sort((a, b) => distance(a) - distance(b))[0];
            if (distance(closest) <= 10){
                target.removeArrow(closest);
            }
        }
    } else {
        target.putArrow(new Arrow(scaledX, scaledY));
    }

    if(target.getArrows().length === 0){
        resetMetrics();
        return;
    }

    if (scoreElt != null){
        scoreElt.innerHTML = scorer.getScore(target).toFixed(0);
    }
    if (arrowsElt != null){
        arrowsElt.innerHTML = target.getArrows().length.toFixed(0);
    }
    if (hitsMissesElt != null){
        let arrows = target.getArrows();
        let isOnTarget = (arrow: Arrow) => target.getRings().map(ring => ring.canContain(arrow)).reduce((a, b) => a || b, false);
        let hits = arrows.filter(isOnTarget).length; 
        hitsMissesElt.innerHTML = hits + "/" + (arrows.length - hits);
    }
    if (accuracyElt != null){
        accuracyElt.innerHTML = (accuracy.getAccuracy(target) * 100).toFixed(1) + "%";
    }
    if (precisionElt != null){
        try {
            precisionElt.innerHTML = precision.getPrecision(target).toFixed(2);
        } catch (e){
            precisionElt.innerHTML = "N/A";
        }
    }
});

function resetMetrics(){
    if (scoreElt != null){
        scoreElt.innerHTML = "0";
    }
    if (arrowsElt != null){
        arrowsElt.innerHTML = "0";
    }
    if (hitsMissesElt != null){
        hitsMissesElt.innerHTML = "0/0";
    }
    if (accuracyElt != null){
        accuracyElt.innerHTML = "0.0%";
    }
    if (precisionElt != null){
        precisionElt.innerHTML = "N/A";
    }
}

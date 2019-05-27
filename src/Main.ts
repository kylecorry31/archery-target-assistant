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

let pixelsPerInch = 2;

function draw(){
    background('#333');
    let minDim = Math.min(height, width);
    pixelsPerInch = 0.8 * minDim / 400;
    let i = 0;
    for(let ring of [...target.getRings()].sort((r1, r2) => r2.getOuterRadius() - r1.getOuterRadius())){
        stroke('black');
        if (i >= 8){
            fill('yellow');
        } else if (i >=6){
            fill('red');
        } else if (i >= 4){
            fill('blue');
        } else if (i >= 2){
            fill('black');
            stroke('white');
        } else {
            fill('white');
        }
        circle(width / 2, height / 2, ring.getOuterRadius() * pixelsPerInch * 2);
        i++;
    }

    for(let arrow of target.getArrows()){
        fill(0);
        stroke('white');
        circle(width / 2 + arrow.getX() * pixelsPerInch, height / 2 + arrow.getY() * pixelsPerInch, 5 * pixelsPerInch);
    }
    requestAnimationFrame(draw);
}

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
    if (accuracyElt != null){
        accuracyElt.innerHTML = (accuracy.getAccuracy(target) * 100).toFixed(1) + "%";
    }
    if (precisionElt != null){
        precisionElt.innerHTML = precision.getPrecision(target).toFixed(2);
    }
});

function resetMetrics(){
    if (scoreElt != null){
        scoreElt.innerHTML = "0";
    }
    if (arrowsElt != null){
        arrowsElt.innerHTML = "0";
    }
    if (accuracyElt != null){
        accuracyElt.innerHTML = "0.0%";
    }
    if (precisionElt != null){
        precisionElt.innerHTML = "0.00";
    }
}

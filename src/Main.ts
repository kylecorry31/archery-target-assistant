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
import TargetFactory = require("./entities/TargetFactory");
import PointCard = require("./scoring/PointCard");
import ArcheryMOAPrecisionStrategy = require("./precision/ArcheryMOAPrecisionStrategy");

// Units
let minDim = Math.min(height, width);
let targetSize = 122 * 0.393701;
let pixelsPerCm = 0.95 * minDim / targetSize;
let arrowSize = 1;

let target = TargetFactory.get122CmCompetitionTarget();
let scorer: Scorer = new LineBreakerHighestScorer();
let accuracy: AccuracyStrategy = new AverageAccuracyStrategy();
let precision: PrecisionStrategy = new CEPPrecisionStrategy(0.5);
let distance = prompt("Enter distance to target in yards");
let moa: PrecisionStrategy = new ArcheryMOAPrecisionStrategy(10, 1.0);

let targetDrawer: TargetDrawer = new CompetitionTargetDrawer();
let arrowDrawer: ArrowDrawer = new CircleArrowDrawer(arrowSize);

let pointCard = new PointCard(scorer);

let scoreElt = document.querySelector('#score');
let accuracyElt = document.querySelector('#accuracy');
let precisionElt = document.querySelector('#precision');
let arrowsElt = document.querySelector('#arrows');
let hitsMissesElt = document.querySelector('#hits-misses');
let downloadElt = document.querySelector('#point-card');
let moaName = document.querySelector('#moa-name');
let moaElt = document.querySelector('#moa');

if (distance != null){
    let d = parseFloat(distance);
    moa = new ArcheryMOAPrecisionStrategy(d, 1.0);
    if (moaName != null) moaName.innerHTML = "Archer's MOA @ " + d + " yards";
}

function draw(){
    background('#333');
    strokeWeight(0.1);
    push();
    translate(width / 2, height / 2);
    scale(pixelsPerCm);
    targetDrawer.draw(target);
    fill(0);
    stroke(255);
    target.getArrows().forEach(arrow => arrowDrawer.draw(arrow));
    pop();
    requestAnimationFrame(draw);
}

document.body.addEventListener('mouseClicked', (data: any) => {

    if (data.detail.clientY > height || data.detail.clientX > width || data.detail.clientY === 0){
        return;
    }

    let scaledX = (data.detail.clientX - width / 2) / pixelsPerCm;
    let scaledY = (data.detail.clientY - height / 2) / pixelsPerCm

    if (keyIsDown(16)){
        let arrows = target.getArrows();
        if (arrows.length === 0){
            return;
        }
        let distance = (arrow: Arrow) => Math.hypot(arrow.getX() - scaledX, arrow.getY() - scaledY);
        let closest = [...arrows].sort((a, b) => distance(a) - distance(b))[0];
        if (distance(closest) <= 10){
            target.removeArrow(closest);
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
            precisionElt.innerHTML = precision.getPrecision(target).toFixed(2) + " in.";
        } catch (e){
            precisionElt.innerHTML = "N/A";
        }
    }

    if (moaElt != null){
        try {
            moaElt.innerHTML = moa.getPrecision(target).toFixed(2) + " MOA";
        } catch (e){
            moaElt.innerHTML = "N/A";
        }
    }
});

function downloadPointCard(){
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pointCard.generatePointCard(target)));
    a.setAttribute('download', 'score-card-' + Date.now() + ".txt");
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadMetrics(){
    let metrics = "";
    let arrows = target.getArrows();
    let isOnTarget = (arrow: Arrow) => target.getRings().map(ring => ring.canContain(arrow)).reduce((a, b) => a || b, false);
    let hits = arrows.filter(isOnTarget).length; 
    metrics += "Score: " + scorer.getScore(target) + "\n";
    metrics += "Shots: " + arrows.length + "\n";
    metrics += "Hits/Misses: " + hits + "/" + (arrows.length - hits) + "\n";
    metrics += "Accuracy: " + accuracy.getAccuracy(target) + "\n";
    metrics += "CEP(0.5): " + precision.getPrecision(target) + "\n";
    let distance = prompt("Enter distance to target in yards");
    if (distance != null){
        let d = parseFloat(distance);
        let moa = new ArcheryMOAPrecisionStrategy(d, 1.0).getPrecision(target);
        metrics += "Archer's MOA @ " + d + " yards : " + moa.toFixed(2) + "\n";
    }
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(metrics));
    a.setAttribute('download', 'archery-metrics-' + Date.now() + ".txt");
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

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
    if (moaElt != null){
        moaElt.innerHTML = "N/A";
    }
}



// MAIN
resetMetrics();
requestAnimationFrame(draw);

if (downloadElt != null){
    downloadElt.addEventListener('click', () => {
        downloadPointCard();
    });
}
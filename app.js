define("entities/Arrow", ["require", "exports"], function (require, exports) {
    "use strict";
    var Arrow = (function () {
        function Arrow(x, y) {
            this.x = x;
            this.y = y;
        }
        Arrow.prototype.getX = function () {
            return this.x;
        };
        Arrow.prototype.getY = function () {
            return this.y;
        };
        return Arrow;
    }());
    return Arrow;
});
define("entities/TargetRing", ["require", "exports"], function (require, exports) {
    "use strict";
    var TargetRing = (function () {
        function TargetRing(innerRadius, outerRadius, pointValue) {
            this.innerRadius = innerRadius;
            this.outerRadius = outerRadius;
            this.pointValue = pointValue;
            if (innerRadius < 0) {
                throw new Error("Inner radius must be non-negative");
            }
            if (outerRadius < 0) {
                throw new Error("Outer radius must be non-negative");
            }
            if (innerRadius >= outerRadius) {
                throw new Error("Inner radius must be smaller than the outer radius");
            }
        }
        TargetRing.prototype.getInnerRadius = function () {
            return this.innerRadius;
        };
        TargetRing.prototype.getOuterRadius = function () {
            return this.outerRadius;
        };
        TargetRing.prototype.getPointValue = function () {
            return this.pointValue;
        };
        TargetRing.prototype.canContain = function (arrow) {
            var radius = Math.sqrt(Math.pow(arrow.getX(), 2) + Math.pow(arrow.getY(), 2));
            return radius <= this.outerRadius && radius >= this.innerRadius;
        };
        return TargetRing;
    }());
    return TargetRing;
});
define("entities/Target", ["require", "exports"], function (require, exports) {
    "use strict";
    var Target = (function () {
        function Target(rings) {
            this.rings = rings;
            this.arrows = [];
            if (rings == null || rings.length === 0) {
                throw new Error("Target must have rings");
            }
            for (var i in rings) {
                for (var j in rings) {
                    if (i !== j) {
                        if (this.overlaps(rings[i], rings[j])) {
                            throw new Error("Target rings can't overlap");
                        }
                    }
                }
            }
        }
        Target.prototype.overlaps = function (ring1, ring2) {
            var biggerRing = ring1.getOuterRadius() > ring2.getOuterRadius() ? ring1 : ring2;
            var smallerRing = biggerRing === ring1 ? ring2 : ring1;
            return smallerRing.getOuterRadius() > biggerRing.getInnerRadius() || smallerRing.getInnerRadius() >= biggerRing.getInnerRadius();
        };
        Target.prototype.putArrow = function (arrow) {
            this.arrows.push(arrow);
        };
        Target.prototype.removeArrow = function (arrow) {
            var idx = this.arrows.indexOf(arrow);
            if (idx === -1) {
                return;
            }
            this.arrows.splice(idx, 1);
        };
        Target.prototype.getArrows = function () {
            return this.arrows.slice(0, this.arrows.length);
        };
        Target.prototype.getRings = function () {
            return this.rings.slice(0, this.rings.length);
        };
        return Target;
    }());
    return Target;
});
define("scoring/Scorer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("scoring/LineBreakerHighestScorer", ["require", "exports"], function (require, exports) {
    "use strict";
    var LineBreakerHighestScorer = (function () {
        function LineBreakerHighestScorer() {
        }
        LineBreakerHighestScorer.prototype.getScore = function (target) {
            var _this = this;
            return target.getArrows().map(function (arrow) { return _this.getArrowScore(target, arrow); }).reduce(function (a, b) { return a + b; }, 0);
        };
        LineBreakerHighestScorer.prototype.getArrowScore = function (target, arrow) {
            if (target.getArrows().indexOf(arrow) === -1) {
                return 0;
            }
            var containingRings = target.getRings().filter(function (ring) { return ring.canContain(arrow); });
            if (containingRings.length !== 0) {
                return Math.max.apply(null, containingRings.map(function (ring) { return ring.getPointValue(); }));
            }
            return 0;
        };
        return LineBreakerHighestScorer;
    }());
    return LineBreakerHighestScorer;
});
define("accuracy/AccuracyStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("accuracy/AverageAccuracyStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    var AverageAccuracyStrategy = (function () {
        function AverageAccuracyStrategy() {
        }
        AverageAccuracyStrategy.prototype.getAccuracy = function (target) {
            if (target.getArrows().length === 0) {
                return 0;
            }
            var distances = target.getArrows().map(function (arrow) { return Math.sqrt(Math.pow(arrow.getX(), 2) + Math.pow(arrow.getY(), 2)); });
            var targetSize = Math.max.apply(null, target.getRings().map(function (ring) { return ring.getOuterRadius(); }));
            var accuracies = distances.map(function (distance) { return Math.max(0, 1 - (distance / targetSize)); });
            return accuracies.reduce(function (a, b) { return a + b; }, 0) / accuracies.length;
        };
        return AverageAccuracyStrategy;
    }());
    return AverageAccuracyStrategy;
});
define("precision/PrecisionStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("precision/MeanRadiusPrecisionStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    var MeanRadiusPrecisionStrategy = (function () {
        function MeanRadiusPrecisionStrategy() {
        }
        MeanRadiusPrecisionStrategy.prototype.getPrecision = function (target) {
            var arrows = target.getArrows();
            var isOnTarget = function (arrow) { return target.getRings().map(function (ring) { return ring.canContain(arrow); }).reduce(function (a, b) { return a || b; }, false); };
            arrows = arrows.filter(isOnTarget);
            if (arrows.length === 0) {
                throw new Error("No arrows on target");
            }
            var meanX = arrows.map(function (arrow) { return arrow.getX(); }).reduce(function (a, b) { return a + b; }, 0) / arrows.length;
            var meanY = arrows.map(function (arrow) { return arrow.getY(); }).reduce(function (a, b) { return a + b; }, 0) / arrows.length;
            var distances = arrows.map(function (arrow) { return Math.hypot(arrow.getX() - meanX, arrow.getY() - meanY); });
            return distances.reduce(function (a, b) { return a + b; }, 0) / arrows.length;
        };
        return MeanRadiusPrecisionStrategy;
    }());
    return MeanRadiusPrecisionStrategy;
});
define("precision/CEPPrecisionStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    var CEPPrecisionStrategy = (function () {
        function CEPPrecisionStrategy(proportion) {
            this.proportion = proportion;
            if (proportion < 0 || proportion > 1) {
                throw new Error("Proportion must be >= 0 and <= 1");
            }
        }
        CEPPrecisionStrategy.prototype.getPrecision = function (target) {
            if (this.proportion === 0.0) {
                return 0;
            }
            var arrows = target.getArrows();
            var isOnTarget = function (arrow) { return target.getRings().map(function (ring) { return ring.canContain(arrow); }).reduce(function (a, b) { return a || b; }, false); };
            arrows = arrows.filter(isOnTarget);
            if (arrows.length === 0) {
                throw new Error("No arrows on target");
            }
            var centerX = arrows.map(function (arrow) { return arrow.getX(); }).reduce(function (a, b) { return a + b; }, 0) / arrows.length;
            var centerY = arrows.map(function (arrow) { return arrow.getY(); }).reduce(function (a, b) { return a + b; }, 0) / arrows.length;
            var distance = function (arrow) { return Math.hypot(arrow.getX() - centerX, arrow.getY() - centerY); };
            var sorted = arrows.slice().sort(function (a, b) { return distance(a) - distance(b); });
            var idx = Math.ceil(this.proportion * arrows.length) - 1;
            return distance(sorted[idx]);
        };
        return CEPPrecisionStrategy;
    }());
    return CEPPrecisionStrategy;
});
define("precision/ExtremeSpreadPrecisionStrategy", ["require", "exports", "precision/CEPPrecisionStrategy"], function (require, exports, CEPPrecisionStrategy) {
    "use strict";
    var ExtremeSpreadPrecisionStrategy = (function () {
        function ExtremeSpreadPrecisionStrategy() {
            this.cepPrecision = new CEPPrecisionStrategy(1.0);
        }
        ExtremeSpreadPrecisionStrategy.prototype.getPrecision = function (target) {
            return this.cepPrecision.getPrecision(target) * 2;
        };
        return ExtremeSpreadPrecisionStrategy;
    }());
    return ExtremeSpreadPrecisionStrategy;
});
define("ui/TargetDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ui/MultiColorTargetDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    var MultiColorTargetDrawer = (function () {
        function MultiColorTargetDrawer(fillColors, strokeColors) {
            this.fillColors = fillColors;
            this.strokeColors = strokeColors;
            if (fillColors.length !== strokeColors.length) {
                throw new Error("Fill and stroke colors must be the same length");
            }
            this.fillColors.reverse();
            this.strokeColors.reverse();
        }
        MultiColorTargetDrawer.prototype.draw = function (target) {
            if (this.fillColors.length !== target.getRings().length) {
                throw new Error("Number of rings and colors don't match");
            }
            var i = 0;
            var rings = target.getRings().slice().sort(function (r1, r2) { return r2.getOuterRadius() - r1.getOuterRadius(); });
            for (var _i = 0, rings_1 = rings; _i < rings_1.length; _i++) {
                var ring = rings_1[_i];
                stroke(this.strokeColors[i]);
                fill(this.fillColors[i]);
                circle(0, 0, ring.getOuterRadius() * 2);
                i++;
            }
        };
        return MultiColorTargetDrawer;
    }());
    return MultiColorTargetDrawer;
});
define("ui/CompetitionTargetDrawer", ["require", "exports", "ui/MultiColorTargetDrawer"], function (require, exports, MultiColorTargetDrawer) {
    "use strict";
    var CompetitionTargetDrawer = (function () {
        function CompetitionTargetDrawer() {
            this.multiColorDrawer = new MultiColorTargetDrawer(['yellow', 'yellow', 'red', 'red', 'blue', 'blue', 'black', 'black', 'white', 'white'], ['black', 'black', 'black', 'black', 'black', 'black', 'white', 'white', 'black', 'black']);
        }
        CompetitionTargetDrawer.prototype.draw = function (target) {
            this.multiColorDrawer.draw(target);
        };
        return CompetitionTargetDrawer;
    }());
    return CompetitionTargetDrawer;
});
define("ui/ArrowDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ui/CircleArrowDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    var CircleArrowDrawer = (function () {
        function CircleArrowDrawer(radius) {
            this.radius = radius;
        }
        CircleArrowDrawer.prototype.draw = function (arrow) {
            circle(arrow.getX(), arrow.getY(), this.radius);
        };
        return CircleArrowDrawer;
    }());
    return CircleArrowDrawer;
});
define("entities/TargetFactory", ["require", "exports", "entities/Target", "entities/TargetRing"], function (require, exports, Target, TargetRing) {
    "use strict";
    var CENTIMETERS_TO_INCHES = 0.393701;
    var TargetFactory = (function () {
        function TargetFactory() {
        }
        TargetFactory.get80CmCompetitionTarget = function () {
            var targetSize = 80 * CENTIMETERS_TO_INCHES;
            return this.createIncrementalTarget(targetSize, 10);
        };
        TargetFactory.get122CmCompetitionTarget = function () {
            var targetSize = 122 * CENTIMETERS_TO_INCHES;
            return this.createIncrementalTarget(targetSize, 10);
        };
        TargetFactory.createIncrementalTarget = function (targetSize, numRings) {
            var rings = [];
            for (var i = 0; i < numRings; i++) {
                var targetIncrement = (targetSize / 2) / numRings;
                rings.push(new TargetRing(targetIncrement * i, targetIncrement * (i + 1), (numRings - i)));
            }
            return new Target(rings);
        };
        return TargetFactory;
    }());
    return TargetFactory;
});
define("scoring/PointCard", ["require", "exports"], function (require, exports) {
    "use strict";
    var PointCard = (function () {
        function PointCard(scorer) {
            this.scorer = scorer;
        }
        PointCard.prototype.generatePointCard = function (target) {
            var arrows = target.getArrows();
            var str = "";
            for (var i = 0; i < arrows.length; i++) {
                var arrow = arrows[i];
                var arrowScore = this.scorer.getArrowScore(target, arrow);
                var arrowIdx = i + 1;
                if (arrowScore === 0) {
                    str += arrowIdx + ": M\n";
                }
                else {
                    str += arrowIdx + ": " + arrowScore + "\n";
                }
            }
            str += "Total score: " + this.scorer.getScore(target);
            return str;
        };
        return PointCard;
    }());
    return PointCard;
});
define("precision/ArcheryMOAPrecisionStrategy", ["require", "exports", "precision/CEPPrecisionStrategy"], function (require, exports, CEPPrecisionStrategy) {
    "use strict";
    var ArcheryMOAPrecisionStrategy = (function () {
        function ArcheryMOAPrecisionStrategy(distanceToTarget, proportion) {
            this.distanceToTarget = distanceToTarget;
            this.cep = new CEPPrecisionStrategy(proportion);
        }
        ArcheryMOAPrecisionStrategy.prototype.getPrecision = function (target) {
            var yardsToMinutes = 0.1;
            var oneMOA = yardsToMinutes * this.distanceToTarget;
            return (this.cep.getPrecision(target) * 2) / oneMOA;
        };
        return ArcheryMOAPrecisionStrategy;
    }());
    return ArcheryMOAPrecisionStrategy;
});
define("Main", ["require", "exports", "entities/Arrow", "scoring/LineBreakerHighestScorer", "accuracy/AverageAccuracyStrategy", "precision/CEPPrecisionStrategy", "ui/CompetitionTargetDrawer", "ui/CircleArrowDrawer", "entities/TargetFactory", "scoring/PointCard", "precision/ArcheryMOAPrecisionStrategy"], function (require, exports, Arrow, LineBreakerHighestScorer, AverageAccuracyStrategy, CEPPrecisionStrategy, CompetitionTargetDrawer, CircleArrowDrawer, TargetFactory, PointCard, ArcheryMOAPrecisionStrategy) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var minDim = Math.min(height, width);
    var targetSize = 122 * 0.393701;
    var pixelsPerCm = 0.95 * minDim / targetSize;
    var arrowSize = 1;
    var target = TargetFactory.get122CmCompetitionTarget();
    var scorer = new LineBreakerHighestScorer();
    var accuracy = new AverageAccuracyStrategy();
    var precision = new CEPPrecisionStrategy(0.5);
    var distance = prompt("Enter distance to target in yards");
    var moa = new ArcheryMOAPrecisionStrategy(10, 1.0);
    var targetDrawer = new CompetitionTargetDrawer();
    var arrowDrawer = new CircleArrowDrawer(arrowSize);
    var pointCard = new PointCard(scorer);
    var scoreElt = document.querySelector('#score');
    var accuracyElt = document.querySelector('#accuracy');
    var precisionElt = document.querySelector('#precision');
    var arrowsElt = document.querySelector('#arrows');
    var hitsMissesElt = document.querySelector('#hits-misses');
    var downloadElt = document.querySelector('#point-card');
    var moaName = document.querySelector('#moa-name');
    var moaElt = document.querySelector('#moa');
    if (distance != null) {
        var d = parseFloat(distance);
        moa = new ArcheryMOAPrecisionStrategy(d, 1.0);
        if (moaName != null)
            moaName.innerHTML = "Archer's MOA @ " + d + " yards";
    }
    function draw() {
        background('#333');
        strokeWeight(0.1);
        push();
        translate(width / 2, height / 2);
        scale(pixelsPerCm);
        targetDrawer.draw(target);
        fill(0);
        stroke(255);
        target.getArrows().forEach(function (arrow) { return arrowDrawer.draw(arrow); });
        pop();
        requestAnimationFrame(draw);
    }
    document.body.addEventListener('mouseClicked', function (data) {
        if (data.detail.clientY > height || data.detail.clientX > width || data.detail.clientY === 0) {
            return;
        }
        var scaledX = (data.detail.clientX - width / 2) / pixelsPerCm;
        var scaledY = (data.detail.clientY - height / 2) / pixelsPerCm;
        if (keyIsDown(16)) {
            var arrows = target.getArrows();
            if (arrows.length === 0) {
                return;
            }
            var distance_1 = function (arrow) { return Math.hypot(arrow.getX() - scaledX, arrow.getY() - scaledY); };
            var closest = arrows.slice().sort(function (a, b) { return distance_1(a) - distance_1(b); })[0];
            if (distance_1(closest) <= 10) {
                target.removeArrow(closest);
            }
        }
        else {
            target.putArrow(new Arrow(scaledX, scaledY));
        }
        if (target.getArrows().length === 0) {
            resetMetrics();
            return;
        }
        if (scoreElt != null) {
            scoreElt.innerHTML = scorer.getScore(target).toFixed(0);
        }
        if (arrowsElt != null) {
            arrowsElt.innerHTML = target.getArrows().length.toFixed(0);
        }
        if (hitsMissesElt != null) {
            var arrows = target.getArrows();
            var isOnTarget = function (arrow) { return target.getRings().map(function (ring) { return ring.canContain(arrow); }).reduce(function (a, b) { return a || b; }, false); };
            var hits = arrows.filter(isOnTarget).length;
            hitsMissesElt.innerHTML = hits + "/" + (arrows.length - hits);
        }
        if (accuracyElt != null) {
            accuracyElt.innerHTML = (accuracy.getAccuracy(target) * 100).toFixed(1) + "%";
        }
        if (precisionElt != null) {
            try {
                precisionElt.innerHTML = precision.getPrecision(target).toFixed(2) + " in.";
            }
            catch (e) {
                precisionElt.innerHTML = "N/A";
            }
        }
        if (moaElt != null) {
            try {
                moaElt.innerHTML = moa.getPrecision(target).toFixed(2) + " MOA";
            }
            catch (e) {
                moaElt.innerHTML = "N/A";
            }
        }
    });
    function downloadPointCard() {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pointCard.generatePointCard(target)));
        a.setAttribute('download', 'score-card-' + Date.now() + ".txt");
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    function downloadMetrics() {
        var metrics = "";
        var arrows = target.getArrows();
        var isOnTarget = function (arrow) { return target.getRings().map(function (ring) { return ring.canContain(arrow); }).reduce(function (a, b) { return a || b; }, false); };
        var hits = arrows.filter(isOnTarget).length;
        metrics += "Score: " + scorer.getScore(target) + "\n";
        metrics += "Shots: " + arrows.length + "\n";
        metrics += "Hits/Misses: " + hits + "/" + (arrows.length - hits) + "\n";
        metrics += "Accuracy: " + accuracy.getAccuracy(target) + "\n";
        metrics += "CEP(0.5): " + precision.getPrecision(target) + "\n";
        var distance = prompt("Enter distance to target in yards");
        if (distance != null) {
            var d = parseFloat(distance);
            var moa_1 = new ArcheryMOAPrecisionStrategy(d, 1.0).getPrecision(target);
            metrics += "Archer's MOA @ " + d + " yards : " + moa_1.toFixed(2) + "\n";
        }
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(metrics));
        a.setAttribute('download', 'archery-metrics-' + Date.now() + ".txt");
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    function resetMetrics() {
        if (scoreElt != null) {
            scoreElt.innerHTML = "0";
        }
        if (arrowsElt != null) {
            arrowsElt.innerHTML = "0";
        }
        if (hitsMissesElt != null) {
            hitsMissesElt.innerHTML = "0/0";
        }
        if (accuracyElt != null) {
            accuracyElt.innerHTML = "0.0%";
        }
        if (precisionElt != null) {
            precisionElt.innerHTML = "N/A";
        }
        if (moaElt != null) {
            moaElt.innerHTML = "N/A";
        }
    }
    resetMetrics();
    requestAnimationFrame(draw);
    if (downloadElt != null) {
        downloadElt.addEventListener('click', function () {
            downloadPointCard();
        });
    }
});
define("precision/MOAPrecisionStrategy", ["require", "exports", "precision/CEPPrecisionStrategy"], function (require, exports, CEPPrecisionStrategy) {
    "use strict";
    var MOAPrecisionStrategy = (function () {
        function MOAPrecisionStrategy(distanceToTarget, proportion) {
            this.distanceToTarget = distanceToTarget;
            this.cep = new CEPPrecisionStrategy(proportion);
        }
        MOAPrecisionStrategy.prototype.getPrecision = function (target) {
            var yardsToMinutes = 0.01046;
            var oneMOA = yardsToMinutes * this.distanceToTarget;
            return this.cep.getPrecision(target) / oneMOA;
        };
        return MOAPrecisionStrategy;
    }());
    return MOAPrecisionStrategy;
});
define("ui/SimpleTargetDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    var SimpleTargetDrawer = (function () {
        function SimpleTargetDrawer() {
        }
        SimpleTargetDrawer.prototype.draw = function (target) {
            for (var _i = 0, _a = target.getRings().slice().sort(function (r1, r2) { return r2.getOuterRadius() - r1.getOuterRadius(); }); _i < _a.length; _i++) {
                var ring = _a[_i];
                circle(0, 0, ring.getOuterRadius() * 2);
            }
        };
        return SimpleTargetDrawer;
    }());
    return SimpleTargetDrawer;
});
//# sourceMappingURL=app.js.map
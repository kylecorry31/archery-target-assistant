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
        }
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
            var distances = target.getArrows().map(function (arrow) { return Math.hypot(arrow.getX() - meanX, arrow.getY() - meanY); });
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
        }
        CEPPrecisionStrategy.prototype.getPrecision = function (target) {
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
            var idx = Math.ceil(this.proportion * (arrows.length - 1));
            return distance(sorted[idx]);
        };
        return CEPPrecisionStrategy;
    }());
    return CEPPrecisionStrategy;
});
define("precision/ExtremeSpreadPrecisionStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    var ExtremeSpreadPrecisionStrategy = (function () {
        function ExtremeSpreadPrecisionStrategy() {
        }
        ExtremeSpreadPrecisionStrategy.prototype.getPrecision = function (target) {
            var arrows = target.getArrows();
            var isOnTarget = function (arrow) { return target.getRings().map(function (ring) { return ring.canContain(arrow); }).reduce(function (a, b) { return a || b; }, false); };
            arrows = arrows.filter(isOnTarget);
            if (arrows.length === 0) {
                throw new Error("No arrows on target");
            }
            var maxDistance = 0;
            var distance = function (arrow1, arrow2) { return Math.hypot(arrow1.getX() - arrow2.getX(), arrow1.getY() - arrow2.getY()); };
            for (var _i = 0, arrows_1 = arrows; _i < arrows_1.length; _i++) {
                var arrow1 = arrows_1[_i];
                for (var _a = 0, arrows_2 = arrows; _a < arrows_2.length; _a++) {
                    var arrow2 = arrows_2[_a];
                    var d = distance(arrow1, arrow2);
                    if (d > maxDistance) {
                        maxDistance = d;
                    }
                }
            }
            return maxDistance;
        };
        return ExtremeSpreadPrecisionStrategy;
    }());
    return ExtremeSpreadPrecisionStrategy;
});
define("ui/TargetDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ui/CompetitionTargetDrawer", ["require", "exports"], function (require, exports) {
    "use strict";
    var CompetitionTargetDrawer = (function () {
        function CompetitionTargetDrawer() {
        }
        CompetitionTargetDrawer.prototype.draw = function (target) {
            var i = 0;
            for (var _i = 0, _a = target.getRings().slice().sort(function (r1, r2) { return r2.getOuterRadius() - r1.getOuterRadius(); }); _i < _a.length; _i++) {
                var ring = _a[_i];
                stroke('black');
                if (i >= 8) {
                    fill('yellow');
                }
                else if (i >= 6) {
                    fill('red');
                }
                else if (i >= 4) {
                    fill('blue');
                }
                else if (i >= 2) {
                    fill('black');
                    stroke('white');
                }
                else {
                    fill('white');
                }
                circle(0, 0, ring.getOuterRadius() * 2);
                i++;
            }
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
define("Main", ["require", "exports", "entities/Arrow", "entities/Target", "entities/TargetRing", "scoring/LineBreakerHighestScorer", "accuracy/AverageAccuracyStrategy", "precision/CEPPrecisionStrategy", "ui/CompetitionTargetDrawer", "ui/CircleArrowDrawer"], function (require, exports, Arrow, Target, TargetRing, LineBreakerHighestScorer, AverageAccuracyStrategy, CEPPrecisionStrategy, CompetitionTargetDrawer, CircleArrowDrawer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var minDim = Math.min(height, width);
    var pixelsPerInch = 0.8 * minDim / 400;
    rectMode(CENTER);
    var target = new Target([
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
    var scorer = new LineBreakerHighestScorer();
    var accuracy = new AverageAccuracyStrategy();
    var precision = new CEPPrecisionStrategy(0.5);
    var scoreElt = document.querySelector('#score');
    var accuracyElt = document.querySelector('#accuracy');
    var precisionElt = document.querySelector('#precision');
    var arrowsElt = document.querySelector('#arrows');
    var hitsMissesElt = document.querySelector('#hits-misses');
    var targetDrawer = new CompetitionTargetDrawer();
    var arrowDrawer = new CircleArrowDrawer(5);
    function draw() {
        background('#333');
        push();
        translate(width / 2, height / 2);
        scale(pixelsPerInch);
        targetDrawer.draw(target);
        fill(0);
        stroke(255);
        target.getArrows().forEach(function (arrow) { return arrowDrawer.draw(arrow); });
        pop();
        requestAnimationFrame(draw);
    }
    resetMetrics();
    requestAnimationFrame(draw);
    document.body.addEventListener('mouseClicked', function (data) {
        var scaledX = (data.detail.clientX - width / 2) / pixelsPerInch;
        var scaledY = (data.detail.clientY - height / 2) / pixelsPerInch;
        if (keyIsDown(16)) {
            var arrows = target.getArrows();
            if (arrows.length === 0) {
                return;
            }
            var _loop_1 = function (arrow) {
                var distance = function (arrow) { return Math.hypot(arrow.getX() - scaledX, arrow.getY() - scaledY); };
                var closest = arrows.slice().sort(function (a, b) { return distance(a) - distance(b); })[0];
                if (distance(closest) <= 10) {
                    target.removeArrow(closest);
                }
            };
            for (var _i = 0, arrows_3 = arrows; _i < arrows_3.length; _i++) {
                var arrow = arrows_3[_i];
                _loop_1(arrow);
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
                precisionElt.innerHTML = precision.getPrecision(target).toFixed(2);
            }
            catch (e) {
                precisionElt.innerHTML = "N/A";
            }
        }
    });
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
    }
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
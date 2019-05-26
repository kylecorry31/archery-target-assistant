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
            var accuracies = distances.map(function (distance) { return 1 - (distance / targetSize); });
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
define("Main", ["require", "exports", "entities/Arrow", "entities/Target", "entities/TargetRing", "scoring/LineBreakerHighestScorer", "accuracy/AverageAccuracyStrategy", "precision/MeanRadiusPrecisionStrategy"], function (require, exports, Arrow, Target, TargetRing, LineBreakerHighestScorer, AverageAccuracyStrategy, MeanRadiusPrecisionStrategy) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var arrow = new Arrow(0, -20);
    var arrow2 = new Arrow(0, 20);
    var arrow3 = new Arrow(0, 0);
    var arrow4 = new Arrow(15, 10);
    var arrow5 = new Arrow(8, 7);
    var target = new Target([new TargetRing(0, 10, 9), new TargetRing(10, 20, 8)]);
    var scorer = new LineBreakerHighestScorer();
    var accuracy = new AverageAccuracyStrategy();
    var precision = new MeanRadiusPrecisionStrategy();
    target.putArrow(arrow);
    target.putArrow(arrow2);
    target.putArrow(arrow3);
    target.putArrow(arrow4);
    target.putArrow(arrow5);
    console.log("Score: " + scorer.getScore(target));
    console.log("Accuracy: " + accuracy.getAccuracy(target));
    console.log("Precision: " + precision.getPrecision(target));
});
//# sourceMappingURL=app.js.map
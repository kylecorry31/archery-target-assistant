import AccuracyStrategy = require("./AccuracyStrategy");
import Target = require("../entities/Target");

class AverageAccuracyStrategy implements AccuracyStrategy {
    getAccuracy(target: Target): number {
        if (target.getArrows().length === 0){
            return 0;
        }
        let distances = target.getArrows().map(arrow => Math.sqrt(arrow.getX()**2 + arrow.getY()**2));
        let targetSize = Math.max.apply(null, target.getRings().map(ring => ring.getOuterRadius()));
        let accuracies = distances.map(distance => 1 - (distance / targetSize));
        return accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    }
}

export = AverageAccuracyStrategy;
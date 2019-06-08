define("scorecard/Shot", ["require", "exports"], function (require, exports) {
    "use strict";
    var Shot = (function () {
        function Shot(value, display) {
            this.value = value;
            if (!display) {
                this.display = value.toString();
            }
            else {
                this.display = display;
            }
        }
        Shot.prototype.getValue = function () {
            return this.value;
        };
        Shot.prototype.getDisplay = function () {
            return this.display;
        };
        Shot.createMiss = function () {
            return new Shot(0, this.DISPLAY_MISS);
        };
        Shot.createBullseye = function () {
            return new Shot(10, this.DISPLAY_BULLSEYE);
        };
        Shot.DISPLAY_MISS = 'M';
        Shot.DISPLAY_BULLSEYE = 'X';
        return Shot;
    }());
    return Shot;
});
define("scorecard/End", ["require", "exports", "scorecard/Shot"], function (require, exports, Shot) {
    "use strict";
    var End = (function () {
        function End(shots, groupCircumference) {
            this.shots = shots;
            this.groupCircumference = groupCircumference;
        }
        End.prototype.getShots = function () {
            return this.shots;
        };
        End.prototype.getGroupCircumference = function () {
            return this.groupCircumference;
        };
        End.prototype.getScore = function () {
            return this.shots.map(function (shot) { return shot.getValue(); }).reduce(function (a, b) { return a + b; });
        };
        End.prototype.getAccuracy = function () {
            if (this.shots.length === 0) {
                return 0;
            }
            return 1 - (this.getNumMisses() / this.shots.length);
        };
        End.prototype.getNumMisses = function () {
            return this.shots.filter(function (shot) { return shot.getDisplay() === Shot.DISPLAY_MISS; }).length;
        };
        End.prototype.getNumBullseyes = function () {
            return this.shots.filter(function (shot) { return shot.getDisplay() === Shot.DISPLAY_BULLSEYE; }).length;
        };
        return End;
    }());
    return End;
});
define("scorecard/ScoreCard", ["require", "exports"], function (require, exports) {
    "use strict";
    var ScoreCard = (function () {
        function ScoreCard(endSize) {
            this.endSize = endSize;
            this.ends = [];
        }
        ScoreCard.prototype.getEndSize = function () {
            return this.endSize;
        };
        ScoreCard.prototype.addEnd = function (end) {
            if (end.getShots().length !== this.endSize) {
                throw new Error("Ends must be the same length: given " + end.getShots().length + ", expected " + this.endSize);
            }
            this.ends.push(end);
        };
        ScoreCard.prototype.getEnds = function () {
            return this.ends;
        };
        return ScoreCard;
    }());
    return ScoreCard;
});
define("scorecard/ScoreCardDisplayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("scorecard/HTMLTableScoreCardDisplayer", ["require", "exports", "scorecard/Shot", "scorecard/End"], function (require, exports, Shot, End) {
    "use strict";
    var HTMLTableScoreCardDisplayer = (function () {
        function HTMLTableScoreCardDisplayer(element) {
            this.element = element;
        }
        HTMLTableScoreCardDisplayer.prototype.display = function (scoreCard) {
            var _this = this;
            var html = '<table class="score-card-table">';
            var titleStr = '<tr class="score-card-table-head">';
            for (var i = 0; i < scoreCard.getEndSize(); i++) {
                titleStr += "<th>Shot " + (i + 1) + "</th>";
            }
            titleStr += '<th class="score-card-table-stats-start">Total</th><th>Grouping (in)</th><th></th></tr>';
            html += titleStr;
            for (var _i = 0, _a = scoreCard.getEnds(); _i < _a.length; _i++) {
                var end = _a[_i];
                var endStr = '<tr class="score-card-table-end">';
                for (var _b = 0, _c = end.getShots(); _b < _c.length; _b++) {
                    var shot = _c[_b];
                    endStr += "<td class=\"score-card-table-item\">" + shot.getDisplay() + "</td>";
                }
                endStr += "<td class=\"score-card-table-item score-card-table-stats-start\">" + end.getScore() + "</td><td class=\"score-card-table-item\">" + (end.getGroupCircumference() || '') + "</td><td></td></tr>";
                html += endStr;
            }
            var addStr = '<tr class="score-card-table-add">';
            for (var i = 0; i < scoreCard.getEndSize(); i++) {
                addStr += "<td class=\"score-card-table-input\"><input type=\"text\" id=\"shot-" + i + "\"/></td>";
            }
            addStr += '<td class="score-card-table-input"></td><td class="score-card-table-input"><input type="number" id="grouping"/></td><td class="score-card-table-input"><button id="submit">Add</button></td></tr>';
            html += addStr;
            this.element.innerHTML = html + '</table>';
            var btn = this.element.querySelector('#submit');
            if (btn) {
                btn.addEventListener('click', function () {
                    var shots = [];
                    for (var i = 0; i < scoreCard.getEndSize(); i++) {
                        var shot = document.querySelector("#shot-" + i);
                        if (shot) {
                            var shotValue = shot.value;
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
                    var grouping = document.querySelector("#grouping");
                    var groupingCircumference;
                    if (grouping) {
                        groupingCircumference = parseFloat(grouping.value);
                    }
                    var end = new End(shots, groupingCircumference);
                    scoreCard.addEnd(end);
                    if (_this.listener) {
                        _this.listener();
                    }
                    _this.display(scoreCard);
                });
            }
        };
        HTMLTableScoreCardDisplayer.prototype.setOnAddListener = function (listener) {
            this.listener = listener;
        };
        return HTMLTableScoreCardDisplayer;
    }());
    return HTMLTableScoreCardDisplayer;
});
define("scorecard/ScoreCardJSONParser", ["require", "exports", "scorecard/ScoreCard", "scorecard/Shot", "scorecard/End"], function (require, exports, ScoreCard, Shot, End) {
    "use strict";
    var ScoreCardJSONParser = (function () {
        function ScoreCardJSONParser() {
        }
        ScoreCardJSONParser.parse = function (json) {
            var endSize = json.endSize;
            var ends = [];
            for (var _i = 0, _a = json.ends; _i < _a.length; _i++) {
                var end = _a[_i];
                var shots = [];
                for (var _b = 0, _c = end.shots; _b < _c.length; _b++) {
                    var shot = _c[_b];
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
                var circumference = void 0;
                if (end.groupCircumference) {
                    circumference = end.groupCircumference;
                }
                ends.push(new End(shots, circumference));
            }
            var scoreCard = new ScoreCard(endSize);
            for (var _d = 0, ends_1 = ends; _d < ends_1.length; _d++) {
                var end = ends_1[_d];
                scoreCard.addEnd(end);
            }
            return scoreCard;
        };
        ScoreCardJSONParser.toJSON = function (scoreCard) {
            var endSize = scoreCard.getEndSize();
            var ends = [];
            for (var _i = 0, _a = scoreCard.getEnds(); _i < _a.length; _i++) {
                var end = _a[_i];
                var shots = [];
                for (var _b = 0, _c = end.getShots(); _b < _c.length; _b++) {
                    var shot = _c[_b];
                    shots.push(shot.getDisplay());
                }
                var circumference = end.getGroupCircumference();
                if (circumference) {
                    ends.push({ shots: shots, groupCircumference: circumference });
                }
                else {
                    ends.push({ shots: shots });
                }
            }
            return { endSize: endSize, ends: ends };
        };
        return ScoreCardJSONParser;
    }());
    return ScoreCardJSONParser;
});
define("Main", ["require", "exports", "scorecard/ScoreCard", "scorecard/HTMLTableScoreCardDisplayer", "scorecard/ScoreCardJSONParser"], function (require, exports, ScoreCard, HTMLTableScoreCardDisplayer, ScoreCardJSONParser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fromLocalStorage = localStorage.getItem('scorecard');
    if (fromLocalStorage) {
        var json = JSON.parse(fromLocalStorage);
        for (var i = 0; i < json.length; i++) {
            var parsed = ScoreCardJSONParser.parse(json[i]);
            if (!parsed) {
                throw new Error("Could not parse scorecard from localstorage");
            }
            showScoreCard(parsed, i);
        }
    }
    else {
        var endSize = prompt("Number of arrows per end");
        if (!endSize) {
            alert("End size must be given");
            location.reload();
            throw new Error("End size must be given");
        }
        showScoreCard(new ScoreCard(parseInt(endSize)));
    }
    function showScoreCard(scoreCard, id) {
        var displayer = new HTMLTableScoreCardDisplayer(document.body);
        displayer.display(scoreCard);
        displayer.setOnAddListener(function () {
            var json = ScoreCardJSONParser.toJSON(scoreCard);
            json.lastModified = Date.now();
            var fromLocalStorage = localStorage.getItem('scorecard');
            if (fromLocalStorage) {
                var localJson = JSON.parse(fromLocalStorage);
                if (id != null) {
                    localJson[id] = json;
                }
                else {
                    localJson.push(json);
                    id = localJson.length;
                }
                localStorage.setItem('scorecard', JSON.stringify(localJson));
            }
            else {
                localStorage.setItem('scorecard', JSON.stringify([json]));
                id = 0;
            }
        });
    }
});
define("scorecard/ConsoleScoreCardDisplayer", ["require", "exports"], function (require, exports) {
    "use strict";
    var ConsoleScoreCardDisplayer = (function () {
        function ConsoleScoreCardDisplayer() {
        }
        ConsoleScoreCardDisplayer.prototype.display = function (scoreCard) {
            var titleStr = '|';
            for (var i = 0; i < scoreCard.getEndSize(); i++) {
                titleStr += " Shot " + (i + 1) + " |";
            }
            titleStr += ' Total | Grouping (in) |\n';
            console.log(titleStr);
            for (var _i = 0, _a = scoreCard.getEnds(); _i < _a.length; _i++) {
                var end = _a[_i];
                var endStr = '|';
                for (var _b = 0, _c = end.getShots(); _b < _c.length; _b++) {
                    var shot = _c[_b];
                    endStr += " " + shot.getDisplay() + " |";
                }
                endStr += " " + end.getScore() + " | " + end.getGroupCircumference() + " |\n";
                console.log(endStr);
            }
        };
        return ConsoleScoreCardDisplayer;
    }());
    return ConsoleScoreCardDisplayer;
});
//# sourceMappingURL=app.js.map
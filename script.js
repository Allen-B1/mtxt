var M;
(function (M) {
    // parses a string into a series of tokens
    function parseTokens(input) {
        var out = [];
        var current = "";
        var brack = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i] == " " && brack.length == 0) {
                out.push(current);
                current = "";
                continue;
            }
            if (input[i] == "]" || input[i] == ")") {
                brack.pop();
                current += input[i];
                if (brack.length == 0) {
                    out.push(current);
                    current = "";
                }
                continue;
            }
            if (input[i] == "[" || input[i] == "(") {
                brack.push(input[i]);
            }
            current += input[i];
        }
        out.push(current);
        return out;
    }
    var Note = /** @class */ (function () {
        function Note(input) {
            var res = /^([0-9]*)([A-GR])([#bx])?([0-9]?)(\.|\^|_|\.\.|\>)?$/.exec(input);
            if (res !== null) {
                this.duration = Number(res[1]) || 4;
                this.pitch = res[2];
                this.accidental = res[3] || "";
                this.octave = Number(res[4]) || 4;
                this.articulation = res[5] || "";
            }
            else {
                throw new Error("Note invalid: '" + input + "'");
            }
        }
        Object.defineProperty(Note.prototype, "hertz", {
            get: function () {
                if (this.pitch == "R")
                    return 0;
                var intervals = [
                    1,
                    16 / 15,
                    9 / 8,
                    6 / 5,
                    5 / 4,
                    4 / 3,
                    25 / 18,
                    3 / 2,
                    8 / 5,
                    5 / 3,
                    16 / 9,
                    15 / 8,
                ];
                var octave = this.octave;
                if (this.pitch == "A" || this.pitch == "B") {
                    octave += 1;
                }
                var pitch = ({
                    "A": 0,
                    "B": 2,
                    "C": 3,
                    "D": 5,
                    "E": 7,
                    "F": 8,
                    "G": 10
                }[this.pitch]) + ({
                    "b": -1,
                    "n": 0,
                    "": 0,
                    "#": +1,
                    "x": +2
                }[this.accidental]);
                var hertz = 440 * intervals[pitch] * ((1 << octave) / 32);
                return hertz;
            },
            enumerable: true,
            configurable: true
        });
        return Note;
    }());
    M.Note = Note;
    var Chord = /** @class */ (function () {
        function Chord(input) {
            this.notes = [];
            input.split("-").forEach(function (item) {
                this.notes.push(new Note(item));
            });
        }
        return Chord;
    }());
    M.Chord = Chord;
    var Beamed = /** @class */ (function () {
        function Beamed(input) {
            this.notes = parseRun(input.slice(1, -1));
        }
        return Beamed;
    }());
    M.Beamed = Beamed;
    var Barline = /** @class */ (function () {
        function Barline(input) {
        }
        return Barline;
    }());
    M.Barline = Barline;
    function parseRun(input) {
        var out = [];
        var tokens = parseTokens(input);
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (token[0] == "[") {
                out.push(new Beamed(token));
            }
            else if (token[0] == "|") {
                out.push(new Barline(token[0]));
            }
            else if (token.indexOf("-") !== -1) {
                out.push(new Chord(token));
            }
            else {
                out.push(new Note(token));
            }
        }
        return out;
    }
    M.parseRun = parseRun;
})(M || (M = {}));

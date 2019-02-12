/// <reference path="script.ts" />
var MSvg;
(function (MSvg) {
    /* (xpos, ypos) is the top-left corner of the measure
     * width: width of measure
     */
    function drawMeasure(input, scale, width, initXpos, ypos) {
        var out = "";
        var horizontal = (width - scale * 3) / 4; // replace 4 with # of beats
        var xpos = initXpos;
        for (var i = 0; i < input.length; i++) {
            var obj = input[i];
            if (obj instanceof M.Note) {
                var octave = obj.octave;
                if (obj.pitch == "A" || obj.pitch == "B")
                    octave++;
                var noteYpos = 10 - (obj.pitch.charCodeAt(0) - "A".charCodeAt(0) - 2 + 7 * (octave - 4));
                /* NOTEHEAD */
                out += '<circle cx="' + xpos + '" cy="' + ypos + noteYpos * scale + '" r="' + (scale * 3 / 4) + '" ' +
                    (obj.type >= 4 ?
                        'fill="#000"' :
                        'stroke="#000" fill="transparent"') +
                    '/>';
                // if note is pointing down
                var down = noteYpos <= 4;
                /* STEM */
                if (obj.type >= 2) {
                    let x = xpos + (down ? -1 : 1) * (scale / 2);
                    let y = ypos + noteYpos * scale + (down ? 0 : -scale * 5);
                    let h = scale * 5;
                    out += '<rect x="' + x + '" y="' + y + '" width="1" height="' + h + '" />';
                }
                /* FLAG */
                if (obj.type >= 8) {
                    let y1 = ypos + noteYpos * scale + (down ? 1 : -1) * (scale * 5);
                    let x1 = xpos + (down ? -1 : 1) * (scale / 2);
                    let y2 = y1 + (down ? -1 : 1) * scale * 2;
                    let x2 = x1 + scale * 2;
                    var n = Math.log2(obj.type) - 2;
                    for (var i = 0; i < n; i++) {
                        out += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="black" />';
                        y1 += (down ? -1 : 1) * scale;
                        y2 += (down ? -1 : 1) * scale;
                    }
                }
                xpos += obj.duration * horizontal;
            }
            if (obj instanceof M.Barline) {
                if (i !== input.length - 1) {
                    xpos += scale * 2;
                    continue;
                }
                xpos += scale;
                out += '<rect x="' + (initXpos + width) + '" y="' + ypos + '" width="1" height="' + scale * 8 + '" />';
            }
        }
        return out;
    }
    /* draws a system (measures on one line)
     */
    function drawSystem(measures, scale, width, ypos) {
        var out = "";
        var nmeasures = measures.filter((x) => x.length > 1).length;
        var measureWidth = width / nmeasures;
        for (var i = 0; i < 5; i++) {
            out += '<rect x="0" y="' + (i * scale * 2) + '" width="100%" height="1" fill="#000" />';
        }
        var xpos = 0;
        for (var measure of measures) {
            out += drawMeasure(measure, scale, measure.length > 1 ? measureWidth : 0, xpos, ypos);
            xpos += measure.length > 1 ? measureWidth : 0;
        }
        return out;
    }
    /** Convert a run to svg
     *
     * input: run to convert
     * scale: height of 1/2 the space between staff lines or 1/8 of the height of a measure
     * width: width of output
     */
    function convert(input, scale, width) {
        var out = "";
        var measures = []; // measures of system
        var measure = [];
        for (var obj of input) {
            measure.push(obj);
            if (obj instanceof M.Barline) {
                measures.push(measure);
                measure = [obj];
            }
        }
        measures.push(measure);
        out += drawSystem(measures, scale, width, 0);
        return '<svg version="1.1" width="' + width + '" height="' + measures.length * scale * 10 + '">' + out + '</svg>';
    }
    MSvg.convert = convert;
})(MSvg || (MSvg = {}));

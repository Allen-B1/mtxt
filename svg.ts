/// <reference path="script.ts" />

namespace MSvg {
	export function convert(input: object[], scale: number) : string {
		var xpos: number = 1; // position

		var out = "";
		for (var i = 0; i < 5; i++) {
			out += '<rect x="0" y="' + (i * scale * 2) + '" width="100%" height="1" fill="#000" />';
		}

		for (var obj of input) {
			if (obj instanceof M.Note) {
				var octave: number = obj.octave;
				if (obj.pitch == "A" || obj.pitch == "B")
					octave++;

				var ypos = 10 - (obj.pitch.charCodeAt(0) - "A".charCodeAt(0) - 2 +  7 * (octave - 4));
				out += '<circle cx="' + xpos * scale + '" cy="' + ypos * scale + '" r="' + (scale * 3 / 4) + '" ' + 
					(obj.type >= 4 ?
						'fill="#000"' : 
						'stroke="#000" fill="transparent"') +
				'/>';
				xpos += obj.duration * 2;
			} else if (obj instanceof M.Barline) {
				
			}
		}

		return '<svg version="1.1">' + out + '</svg>';
	}
}

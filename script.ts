enum Clef {
	// How far away from first line of staff C4 is
	TREBLE = +10,
	ALTO = +4,
	BASS = -2
}

class Score {
	public notes: string = "";
	
	toSVG(size: number) : string {
		var svg = "";

		for (var i = 0; i < 5; i++) {
			svg += '<rect x="0" y="' + (i * size) + '" width="100%" height="1" fill="#000" />';
		}

		var notelist = this.notes.split(" ").filter(Boolean);
		var posX = 0;
		for (var note of notelist) {
			// barline
			if (note == "|") {
				svg += '<rect x="' + (posX * size) + '" y="0" width="1" height="' + (size * 4) + '" fill="#000" />';
				posX += 1;
			} else if (note == "||") { 
				svg += '<rect x="' + (posX * size) + '" y="0" width="1" height="' + (size * 4) + '" fill="#000" />';
				svg += '<rect x="' + (posX * size + 5) + '" y="0" width="1" height="' + (size * 4) + '" fill="#000" />';				
				posX += 1
			} else if (/^([1234]?)([ABCDEFG])([0-9]?)$/.exec(note) != null) {
				var arr = /^([1234]?)([ABCDEFG])([0-9]?)$/.exec(note);
				var duration: number = Number(arr[1]) || 1;
				var pitch: string = arr[2];
				var octave: number = Number(arr[3]) || 4; 

				if (pitch == "A" || pitch == "B") 
					octave++;
		
				var posY = Clef.TREBLE - (pitch.charCodeAt(0) - "A".charCodeAt(0) - 2 +  7 * (octave - 4));
				
				// Draw notehead
				svg += '<circle cx="' + posX * size + '" cy="' + (posY * size / 2) + '" r="' + (size / 4) + '" ' + 
					(duration == 1 ?
					'fill="#000"' :
					'stroke="#000" fill="transparent"') +
				' />';

				// Draw stem
				if (duration != 4) {
					let stemX: number, stemY: number, stemH: number;
					var up = posY <= 4;
					if (!up) {
						stemX = (posX  * size) + (size / 4);
						stemY = (posY * size / 2) - (size * 3);
					} else {
						stemX = (posX  * size) - (size / 4);
						stemY = (posY * size / 2);						
					}
					stemH = size * 3;
					svg += '<rect x="' + stemX + '" y="' + stemY + '" height="' + stemH + '" width="1" fill="#000" />'
				}

				posX += duration;
			}
		}
		
		return '<svg version="1.1">' + svg + "</svg>";
	}
}

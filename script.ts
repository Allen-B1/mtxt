enum Clef {
	// How far away from first line of staff C4 is
	TREBLE = +10,
	ALTO = +4,
	BASS = -2
}

abstract class MElement {
	draw(xpos: number, size: number) : string {
		return "";
	}
}

interface MElementType {
	new (input: string) : MElement;
	test (input: string) : boolean;
}


class Note extends MElement {
	private type: number; // 1: Quarter, 2: Half, 3: Dotted half, 4: Whole, 8: Eighth, 16: Sixteenth	
	private pitch: string;
	private octave: number;
	static test(input: string) : boolean {
		return /^([1234]?)([ABCDEFG])([0-9]?)$/.test(input);
	}

	constructor(input: string) {
		super();
		var arr = /^([1234]?)([ABCDEFG])([0-9]?)$/.exec(input);
		this.type = Number(arr[1]) || 1;
		this.pitch = arr[2];
		this.octave = Number(arr[3]) || 4; 
	}

	get duration() : number {
		if (this.type <= 4) 
			return this.type;
		else 
			return 1 / this.type;
	}

	draw(xpos: number, size: number) : string {
		var svg: string = "";
		var octave = this.octave
		if (this.pitch == "A" || this.pitch == "B") 
			octave++;

		var ypos = Clef.TREBLE - (this.pitch.charCodeAt(0) - "A".charCodeAt(0) - 2 +  7 * (octave - 4));
		
		// Draw notehead
		svg += '<circle cx="' + xpos * size + '" cy="' + (ypos * size / 2) + '" r="' + (size / 4) + '" ' + 
			(this.type == 1 ?
			'fill="#000"' :
			'stroke="#000" fill="transparent"') +
		' />';

		// Draw stem
		if (this.type != 4) {
			let stemX: number, stemY: number, stemH: number;
			var up = ypos <= 4;
			if (!up) {
				stemX = (xpos  * size) + (size / 4);
				stemY = (ypos * size / 2) - (size * 3);
			} else {
				stemX = (xpos  * size) - (size / 4);
				stemY = (ypos * size / 2);						
			}
			stemH = size * 3;
			svg += '<rect x="' + stemX + '" y="' + stemY + '" height="' + stemH + '" width="1" fill="#000" />'
		}
		
		return svg;
	}	
}

class Barline extends MElement {
	private type: string;

	static test(input: string) : boolean {
		return input == "|" || input == "||";
	}

	constructor(input: string) {
		super();
		this.type = input;
	}

	draw(xpos: number, size: number) : string {
		var svg = "";
		svg += '<rect x="' + (xpos * size) + '" y="0" width="1" height="' + (size * 4) + '" fill="#000" />';
		if (this.type == "||") {
			svg += '<rect x="' + (xpos * size + 5) + '" y="0" width="1" height="' + (size * 4) + '" fill="#000" />';				
		}
		return svg;
	}		
}

var MElementTypes: MElementType[] = [Note, Barline];

class Score {
	public notes: string = "";

	get elements() : MElement[] {
		return [];
	}
	
	toSVG(size: number) : string {
		var svg = "";

		for (var i = 0; i < 5; i++) {
			svg += '<rect x="0" y="' + (i * size) + '" width="100%" height="1" fill="#000" />';
		}

		var notelist = this.notes.split(" ").filter(Boolean);
		var xpos = 0;
		for (var note of notelist) {
			for (var Type of MElementTypes) {
				if (Type.test(note)) {
					var element = new Type(note);
					svg += element.draw(xpos, size);
					xpos++;
					continue;
				}
			}
		}
		
		return '<svg version="1.1">' + svg + "</svg>";
	}
}

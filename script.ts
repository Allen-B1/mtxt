namespace M {
	// parses a string into a series of tokens
	function parseTokens(input: string): string[] {
		var out: string[] = [];
		var current = "";
		var brack: string[] = [];
		for (let i = 0; i < input.length; i++) {
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

	export class Note {
		type: number; // 1: whole, 2: half, 4: quarter, 8: eighth, etc.
		dotted: number; // 0: none, 1: single, 2: double
		pitch: string;
		octave: number;
		accidental: string;
		articulation: string;
		constructor(input: string) {
			var res = /^([0-9]*)(\.)?([A-GR])([#bx])?([0-9]?)(\.|\^|_|\.\.|\>)?$/.exec(input);
			if (res !== null) {
				this.type = Number(res[1]) || 4;
				this.dotted = (res[2] || "").length;
				this.pitch = res[3];
				this.accidental = res[4] || "";
				this.octave = Number(res[5]) || 4;
				this.articulation = res[6] || "";
			} else {
				throw new Error("Note invalid: '" + input + "'");
			}
		}

		get hertz() : number {
			if (this.pitch == "R") 
				return 0;
		
			var intervals = [
				1,
				16/15,
				9/8,
				6/5,
				5/4,
				4/3,
				25/18,
				3/2,
				8/5,
				5/3,
				16/9,
				15/8,
			];
			
			var octave = this.octave;
			if (this.pitch == "A" || this.pitch == "B") {
				octave += 1;
			}
		
			var pitch: number = ({
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
		}

		get duration() : number {
			var duration = (1 / this.type) * 4;
			if (this.dotted == 1) {
				duration *= 1.5;
			} else if (this.dotted == 2) {
				duration *= 1.75;
			}
			return duration;
		}
	}

	/* TODO: Change from
	 *	4C4-4E4
	 * to
	 *	4C4E4
	 */
	export class Chord {
		notes: Note[] = [];
		constructor(input: string) {
			input.split("-").forEach((item) => {
				this.notes.push(new Note(item));
			})
		}
	}

	export class Beamed {
		notes: object[];
		constructor(input: string) {
			this.notes = parseRun(input.slice(1, -1));
		}
	}

	export class Barline {
		constructor(input: string) {
			
		}
	}

	export function parseRun(input: string): object[] {
		var out: object[] = [];

		var tokens = parseTokens(input);
		for (var token of tokens) {
			if (token[0] == "[") {
				out.push(new Beamed(token));
			} else if(token[0] == "|") {
				out.push(new Barline(token[0]));
			} else if (token.indexOf("-") !== -1) {
				out.push(new Chord(token));
			} else {
				try {
					out.push(new Note(token));
				} catch(err) {
					
				}
			}
		}
		return out;
	}
}

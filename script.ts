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
		duration: number; // 1: whole, 2: half, 4: quarter, 8: eighth, etc.
		pitch: string;
		octave: number;
		accidental: string;
		articulation: string;
		constructor(input: string) {
			var res = /^([0-9]*)([A-GR])([#bx])?([0-9]?)(\.|\^|_|\.\.|\>)?$/.exec(input);
			if (res !== null) {
				this.duration = Number(res[1]) || 4;
				this.pitch = res[2];
				this.accidental = res[3] || "";
				this.octave = Number(res[4]) || 4;
				this.articulation = res[5] || "";
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
	}

	export class Chord {
		notes: Note[] = [];
		constructor(input: string) {
			input.split("-").forEach(function (item) {
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
				out.push(new Note(token));
			}
		}
		return out;
	}
}

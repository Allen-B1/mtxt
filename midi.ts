/// <reference path="script.ts" />

namespace MPlay {
	export var Context = new AudioContext();

	export function PlayNote(note: M.Note, bpm: number) : Promise<any> {
		return new Promise<any>(function(resolve) {
			if (note.hertz != 0) {
				var osc = Context.createOscillator();
				var gain = Context.createGain();
				osc.frequency.value = note.hertz;
				osc.type = "sine";
				osc.connect(gain);
				gain.connect(Context.destination);
				osc.start(0);
			}
		
			setTimeout(function() {
				if (note.hertz != 0) {
					gain.gain.exponentialRampToValueAtTime(0.00001, Context.currentTime + 0.04)
				}
				resolve(note);
			}, note.duration * (1 / bpm * 60) * 1000);
		});
	}

	export function PlayObject(obj: object, bpm: number) : Promise<any> {
		if (obj instanceof M.Note) {
			return PlayNote(obj as M.Note, bpm);
		} else if (obj instanceof M.Chord) {
			return Promise.all(obj.notes.map(x => PlayNote(x, bpm)));
		} else if (obj instanceof M.Beamed) {
			return PlayNotes(obj.notes, bpm);
		} else {
			return Promise.resolve(null);
		}
	}

	export function PlayNotes(notes: object[], bpm: number) : Promise<any> {
		return new Promise(function(resolve) {
			var next = (i) => {
				if (notes.length > i) {
					PlayObject(notes[i], bpm).then(function() {
						next(i + 1);
					})
				} else {
					resolve(notes[i - 1]);
				}
			};
			next(0);
		});	
	}
}

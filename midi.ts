/// <reference path="script.ts" />

namespace MPlay {
	export var Context = new AudioContext();

	export function PlayNote(note: M.Note, bpm: number) : Promise<any> {
		return new Promise<any>(function(resolve) {
			var osc = Context.createOscillator();
			osc.frequency.value = note.hertz;
			osc.connect(Context.destination);
			osc.start(0);
	
			setTimeout(function() {
				osc.stop();
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

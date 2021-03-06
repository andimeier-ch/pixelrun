import * as levels from './core/levels.js';
import DOMDisplay from './core/DOMDisplay.js'
import CanvasDisplay from './core/CanvasDisplay.js'
import Level from './core/Level.js';
import State from './core/State.js';


function trackKeys(keys) {
	let down = Object.create(null);
	function track(event) {
		if (keys.includes(event.key)) {
			down[event.key] = event.type === 'keydown';
			event.preventDefault();
		}
	}

	window.addEventListener('keydown', track);
	window.addEventListener('keyup', track);

	down.unregister = () => {
		window.removeEventListener('keydown', track);
		window.removeEventListener('keyup', track);
	};

	return down;
}


function runAnimation(frameFunc) {
	let lastTime = null;
	function frame(time) {
		if (lastTime != null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000;
			if (frameFunc(timeStep) === false) return;
		}
		lastTime = time;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}


function runLevel(level, Display) {
	let display = new Display(document.body, level);
	let state = State.start(level);
	let ending = 1;
	let paused = false;
	const arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp']);

	return new Promise(resolve => {
		window.addEventListener('keyup', event => {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			if (paused) {
				runAnimation(frame);
			}
			paused = !paused;
		});

		runAnimation(frame);

		function frame(time) {
			if (paused) return false;
			state = state.update(time, arrowKeys);
			display.syncState(state);
			if (state.status === 'playing') {
				return true;
			} else if (ending > 0) {
				ending -= time;
				return true;
			} else {
				display.clear();
				arrowKeys.unregister();
				resolve(state.status);
				return false;
			}
		}
	});
}


async function runGame(plans, Display) {
	let level = 0;
	let lifes = 3;
	while (level < plans.length && lifes > 0) {
		console.log(lifes);
		let status = await runLevel(new Level(plans[level]), Display);
		if (status === 'won') level++;
		else if (status === 'lost') lifes--;
	}
	if (lifes > 0) document.querySelector('#message').textContent = 'You\'ve won!';
	else document.querySelector('#message').textContent = 'Game Over';
}


runGame(levels.GAME_LEVELS, CanvasDisplay);
import Vec from "../core/Vec.js";
import State from "../core/State.js";

class Monster {

	constructor(pos, speed) {
		this.pos = pos;
		this.speed = speed;
	}

	get type() { return 'monster'; }

	static create(pos) {
		return new Monster(pos.plus(new Vec(0, -1)), new Vec(2, 0))
	}

	update(time, state) {
		let newPos = this.pos.plus(this.speed.times(time));
		if (!state.level.touches(newPos, this.size, 'wall')) {
			return new Monster(newPos, this.speed);
		} else {
			return new Monster(newPos, this.speed.times(-1));
		}
	}

	collide(state) {
		let player = state.actors.find(a => a.type === 'player');
		if (player.pos.y > this.pos.y) {
			return new State(state.level, state.actors, 'lost');
		} else {
			let actors = state.actors;
			let monster = actors.indexOf('monster');
			actors.splice(monster, 1);
			return new State(state.level, actors, 'playing');
		}
	}

}

Monster.prototype.size = new Vec(1.2, 2);



export default Monster;
import Vec from "../core/Vec.js";
import State from "../core/State.js";

class Monster {

	constructor(pos, speed) {
		this.pos = pos;
		this.speed = speed;
	}

	get type() { return 'monster'; }

	static create(pos) {
		return new Monster(pos.plus(new Vec(0, -1)), new Vec(4, 0))
	}

	update(time, state) {
		let player = state.player;
		let speed = this.speed.times(player.pos.x < this.pos.x ? -1 : 1);
		let newPos = this.pos.plus(speed.times(time));
		if (state.level.touches(newPos, this.size, 'wall')) return this;
		else return new Monster(newPos, this.speed);
	}

	collide(state) {
		let player = state.player;
		if (player.pos.y - 0.5 + player.size.y < this.pos.y) {
			let actors = state.actors.filter(a => a !== this);
			return new State(state.level, actors, state.status);
		} else {
			return new State(state.level, state.actors, 'lost');
		}
	}

}

Monster.prototype.size = new Vec(1.2, 2);



export default Monster;
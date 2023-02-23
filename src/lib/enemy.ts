export class Enemy {
	static readonly SPEED = 3
	static readonly WIDTH = 64
	static readonly HEIGHT = 64
	static readonly MAX_HEALTH = 6
	constructor(
		public x: number,
		public y: number,
		public health: number = Enemy.MAX_HEALTH,
		public speed: number = Enemy.SPEED
	) {}
}

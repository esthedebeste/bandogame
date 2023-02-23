<script lang="ts">
	import { Enemy } from "$lib/enemy"
	import { Ship } from "$lib/ship"
	import { Shot } from "$lib/shot"
	import { onMount } from "svelte"

	let width: number
	let height: number
	let ship = new Ship()
	let shots: Shot[] = []
	let enemies: Enemy[] = []

	function move(event: MouseEvent) {
		ship.x = event.pageX - Ship.WIDTH / 2
		// ship.y = event.offsetY
	}

	let ptime = 0
	function draw(time: number) {
		const delta = time - ptime
		for (const shot of shots) {
			shot.y -= delta
		}
		for (let index = shots.length - 1; index >= 0; index--)
			for (const enemy of enemies)
				if (
					shots[index].x + Shot.WIDTH > enemy.x &&
					shots[index].x < enemy.x + Enemy.WIDTH &&
					shots[index].y > enemy.y &&
					shots[index].y < enemy.y + Enemy.HEIGHT
				) {
					shots.splice(index, 1)
					enemy.health -= 1
					break
				}

		shots = shots
		for (const enemy of enemies) {
			enemy.y += (enemy.speed * delta) / 10
		}
		enemies = enemies.filter(enemy => enemy.health > 0)

		ptime = time
		requestAnimationFrame(draw)
	}

	onMount(() => {
		ptime = performance.now()
		requestAnimationFrame(draw)
		setInterval(() => {
			shots.push(
				new Shot(ship.x + Ship.WIDTH / 2 - Shot.WIDTH / 2, height - Ship.HEIGHT - 10 - Shot.HEIGHT)
			)
			shots = shots.filter(shot => shot.y > -Shot.HEIGHT)
		}, 100)
		setInterval(() => {
			enemies.push(new Enemy(Math.random() * (width - Enemy.WIDTH), -Enemy.HEIGHT))
			enemies = enemies.filter(enemy => enemy.x < width && enemy.y < height)
		}, 1000)
	})
</script>

<svelte:head>
	<title>sickest game ever holyyy shitttt</title>
</svelte:head>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} on:mousemove={move} />

<img
	id="ragey"
	src="/ragey.webp"
	alt="ship"
	style:left="{ship.x}px"
	style:bottom="10px"
	draggable={false}
/>
{#each shots as shot}
	<img class="shot" src="/shot.webp" alt=":3" style:left="{shot.x}px" style:top="{shot.y}px" />
{/each}
{#each enemies as enemy}
	<img
		class="enemy"
		src="/bando.jpeg"
		alt="bando's pfp (enemy)"
		style:left="{enemy.x}px"
		style:top="{enemy.y}px"
		style:filter="hue-rotate({(Enemy.MAX_HEALTH - enemy.health) * 60}deg)"
	/>
{/each}

<style>
	img {
		position: absolute;
		user-select: none;
	}
	img#ragey {
		width: 140px;
		height: 70px;
	}
	img.shot {
		width: 25px;
		height: 50px;
	}
	img.enemy {
		width: 64px;
		height: 64px;
	}
</style>

// FIX THIS YO!
// 1. generate food & poison all around the map ✅
// 2. remove poison after a while!?
// 3. make sure that poison & food is not generated on top of each other and/or on top of the snake ✅
// 4. add Score ✅

const canvasSize = 600;
const canvasSquareSize = 30;
let snake;
let food;
let poisons = [];

let score = 0;

function setup() {
	createCanvas(canvasSize, canvasSize);

	snake = new Snake();
	food = new Food();
}

function draw() {
	frameRate(15);
	background(255);

	if (snake.eat(food)) {
		snake.addToTail(food);
		food = new Food();
	}

	snake.update();
	snake.draw();

	food.draw();

	poisons.forEach(p => {
		p.draw();

		if (snake.eat(p)) {
			snake.tail = [];
			poisons = [];
		}
	});

	if (poisons.length < score) {
		poisons.push(new Poison());
	}

	score = snake.tail.length;
	fill(0);
	textSize(22);
	text(`Score: ${score}`, width - 90, 30);
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		snake.move(0, -1);
	} else if (keyCode === DOWN_ARROW) {
		snake.move(0, 1);
	} else if (keyCode === LEFT_ARROW) {
		snake.move(-1, 0);
	} else if (keyCode === RIGHT_ARROW) {
		snake.move(1, 0);
	}
}

class Snake {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.size = canvasSize / canvasSquareSize;
		this.tail = [];
		this.dx = 0;
		this.dy = 0;
	}

	addToTail(food) {
		const piece = {
			x: food.x - this.dx,
			y: food.y - this.dy
		};

		this.tail.unshift(piece);
	}

	update() {
		for (let i = 0; i < this.tail.length - 1; i++) {
			this.tail[i].x = this.tail[i + 1].x;
			this.tail[i].y = this.tail[i + 1].y;
		}

		if (this.tail.length > 0) {
			this.tail[this.tail.length - 1].x = this.x;
			this.tail[this.tail.length - 1].y = this.y;
		}

		this.x += this.dx;
		this.y += this.dy;

		if (this.x < 0) {
			this.x = 0;
		}

		if (this.x > width - this.size) {
			this.x = width - this.size;
		}

		if (this.y < 0) {
			this.y = 0;
		}

		if (this.y > height - this.size) {
			this.y = height - this.size;
		}
	}

	move(x, y) {
		this.dx = this.size * x;
		this.dy = this.size * y;
	}

	draw() {
		noStroke();
		fill(100);
		rect(this.x, this.y, this.size, this.size);

		this.tail.forEach(piece => {
			fill('rgba(0,0,0, 0.25)');
			rect(piece.x, piece.y, this.size, this.size);
		});
	}

	eat(food) {
		const d = dist(this.x, this.y, food.x, food.y);

		return d === 0;
	}
}

class Food {
	constructor() {
		this.size = canvasSize / canvasSquareSize;
		this.x = undefined;
		this.y = undefined;

		this.positionFood();
	}

	positionFood() {
		this.x = Math.floor(Math.random() * canvasSquareSize) * this.size;
		this.y = Math.floor(Math.random() * canvasSquareSize) * this.size;

		let overlap = false;

		for (let i = 0; i < poisons.length; i++) {
			const p = poisons[i];
			if (this.x === p.x && this.y === p.y) {
				overlap = true;
				break;
			}
		}

		if (overlap) {
			this.positionFood();
		}
	}

	draw() {
		fill(0, 255, 0);
		ellipseMode(CORNER);
		// circle(this.x, this.y, this.size);
		text('🍏', this.x - 3, this.y + this.size - 2);
	}
}

class Poison {
	constructor() {
		this.size = canvasSize / canvasSquareSize;
		this.x = Math.floor(Math.random() * canvasSquareSize) * this.size;
		this.y = Math.floor(Math.random() * canvasSquareSize) * this.size;

		setTimeout(() => {
			let idx = poisons.findIndex(p => p === this);
			poisons.splice(idx, 1);
		}, 10000);
	}

	draw() {
		fill(255, 0, 0);
		ellipseMode(CORNER);
		// circle(this.x, this.y, this.size);
		text('🌶', this.x - 3, this.y + this.size - 2);
	}
}

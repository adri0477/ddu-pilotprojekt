// Taget fra stackoverflow.com
function shuffle(array) {
	var currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
//Sleep promise funktion taget fra stackoverflow
function sleep(millisecondsDuration) {
	return new Promise((resolve) => {
		setTimeout(resolve, millisecondsDuration);
	});
}

//Resten er selv kodet med kommentare på engelsk fordi det er nemmest.
let cardType = {};

//P5 preload load all cardtypes with their respective assets
function preload() {
	//Diffrent card types and their two variants
	cardType = {
		1: [loadImage('assets/1,1.png'), loadImage('assets/1,2.png')],
		2: [loadImage('assets/2,1.png'), loadImage('assets/2,2.png')],
		3: [loadImage('assets/3,1.png'), loadImage('assets/3,2.png')],
		4: [loadImage('assets/4,1.png'), loadImage('assets/4,2.png')],
		5: [loadImage('assets/5,1.png'), loadImage('assets/5,2.png')],
		6: [loadImage('assets/6,1.png'), loadImage('assets/6,2.png')],
		7: [loadImage('assets/7,1.png'), loadImage('assets/7,2.png')],
		8: [loadImage('assets/8,1.png'), loadImage('assets/8,2.png')],
		9: [loadImage('assets/9,1.png'), loadImage('assets/9,2.png')],
		10: [loadImage('assets/10,1.png'), loadImage('assets/10,2.png')],
		11: [loadImage('assets/11,1.png'), loadImage('assets/11,2.png')],
		12: [loadImage('assets/12,1.png'), loadImage('assets/12,2.png')],
		13: [loadImage('assets/13,1.png'), loadImage('assets/13,2.png')],
		14: [loadImage('assets/14,1.png'), loadImage('assets/14,2.png')],
		15: [loadImage('assets/15,1.png'), loadImage('assets/15,2.png')],
		16: [loadImage('assets/16,1.png'), loadImage('assets/16,2.png')],
		17: [loadImage('assets/17,1.png'), loadImage('assets/17,2.png')],
	};
}

//Card variants
const variants = {
	CARD: 0,
	TEXT: 1,
};

//card sides
const sides = {
	FRONT: 0,
	BACK: 1,
};

//Card class
class Card {
	constructor(x, y, type, variant, wh = 150) {
		//x,y pos
		this.x = x;
		this.y = y;
		//type, variant and side
		this.type = type;
		this.variant = variant;
		this.side = sides.BACK;
		//Width&height
		this.wh = wh;
		//Is enabled
		this.enabled = true;
		//Is selected
		this.selected = false;
		//Set image according to type and variant
		this.img = cardType[this.type][variant];
		//Set backside color
		this.backSideColor = '#404EED';
		this.frontBorderSideColor = '';
	}

	display() {
		this.frontSideBorderColor = this.enabled ? '#F6F6F6' : '#5865F2';
		// Set backside color
		//If side is back show color else show front img
		if (this.side == sides.BACK) {
			fill(this.backSideColor);
			rect(this.x, this.y, this.wh, this.wh);
			return;
		}
		if (this.side == sides.FRONT) {
			fill(this.frontSideBorderColor);
			rect(this.x - 2, this.y - 2, this.wh + 4);
			image(this.img, this.x, this.y, this.wh, this.wh);
		}
	}
	//Set side to front
	flipToFront = () => (this.side = sides.FRONT);

	//Side = back
	flipToBack = () => (this.side = sides.BACK);

	//Flip side to other type
	flip() {
		this.side = this.side ? sides.FRONT : sides.BACK;
	}
	//Set card x,y
	setXY(x, y) {
		this.x = x;
		this.y = y;
	}
	//Disable card
	disable = () => (this.enabled = false);

	//enable card
	enable = () => (this.enable = true);

	//Select the card (will also flip to front)
	select() {
		this.selected = true;
		this.flipToFront();
	}
	//Remove selection and flip back
	async deSelect(instant = false) {
		this.selected = false;
		if (instant) {
			this.flipToBack();
		} else {
			await sleep(1000).then(() => this.flipToBack());
		}
	}
}

//Handles game logic, rendering and takes list of cards as input.
class GameContainer {
	constructor(cards, doShuffle = false, cardWH = 150) {
		//Set card w and h
		this.cardWH = cardWH;
		//No. of columns to use
		this.columns = 8;
		//Get cards as array and shuffle if wanted
		this.cards = doShuffle ? shuffle(cards) : cards;
		//Calculate rows based on no. of cards and no. of columns
		this.rows = Math.floor(cards.length / this.columns);

		//Current clicked card false == none
		this.clickedCard = false;
		//Currently flipped cards
		this.selectedCards = [];

		//No. of players 0 for one or 1 for two
		this.players = 0;
		//Score of the two players
		this.score = [0, 0];
		//Current player
		this.currentPlayer = 0;

		//Decides if the player can click
		this.canClick = true;
		this.time = 0;

		//For each row of this.rows
		for (let n = 0, i = 0; n <= this.rows; n++) {
			if (i >= this.cards.length) break;
			// Y pos = row no. with 10 px spacing
			let y = n * this.cardWH + 10 * n + 10;

			//For each column of current row
			for (let m = 0; m <= this.columns; m++) {
				//If current card in list is done stop loop
				if (i >= this.cards.length) break;

				//Set card xy
				this.cards[i].setXY(m * this.cardWH + 10 * m + 10, y);
				//Increment card counter
				i++;
			}
		}
		//New map for storing the cards
		this.cardMap = new Map();
		//add all cards and set x|y as key
		for (const card of this.cards)
			this.cardMap.set(card.x + '|' + card.y, card);
	}
	draw() {
		//For each card display them using their methods
		for (const n of this.cardMap) {
			n[1].display();
		}
		fill(255);
		textSize(20);
		text(
			'Player ones score: ' +
				this.score[0] +
				' / ' +
				this.cards.length / 2,
			(this.columns - 1) * this.cardWH + (this.columns - 1) * 10 + 10,
			(this.rows - 1) * this.cardWH + (this.rows - 1) * 10 + this.cardWH
		);
		text(
			'Time: ' + this.time,
			(this.columns - 1) * this.cardWH + (this.columns - 1) * 10 + 10,
			(this.rows - 1.5) * this.cardWH + (this.rows - 1) * 10 + this.cardWH
		);
	}
	handleClick(e) {
		if (!this.canClick) return;
		this.clickedCard = undefined;
		//for each card in cardMap check if they are clicked, and set clickedCard
		this.cardMap.forEach((val, key) => {
			if (
				e.x > val.x &&
				e.x < val.x + this.cardWH &&
				e.y > val.y &&
				e.y < val.y + this.cardWH &&
				val.enabled
			)
				this.clickedCard = key;
		});

		//Return if no card is clicked
		if (!this.clickedCard) return;

		if (!this.time) this.time = Date.now();

		//If the clicked card is selected
		if (this.selectedCards.includes(this.clickedCard)) {
			//Remove from selected cards
			this.selectedCards.splice(
				this.selectedCards.indexOf(this.clickedCard),
				1
			);
			//Deselect and return
			this.cardMap.get(this.clickedCard).deSelect(true);
			return;
		}

		//Select card
		this.selectedCards.push(this.clickedCard);
		this.cardMap.get(this.clickedCard).select();

		//If both cards are selected
		if (this.selectedCards[0] && this.selectedCards[1]) {
			this.canClick = false;

			const t1 = this.cardMap.get(this.selectedCards[0]).type;
			const t2 = this.cardMap.get(this.selectedCards[1]).type;
			//Check if they are the same type
			if (t1 == t2) {
				//Correct
				//Disable cards, reset clickedCard and selectedCards then return
				this.canClick = true;
				this.cardMap.get(this.selectedCards[0]).disable();
				this.cardMap.get(this.selectedCards[1]).disable();
				this.clickedCard = false;
				this.selectedCards = [];
				this.score[this.currentPlayer] += 1;

				if (this.score[this.currentPlayer] == 17)
					this.time = (Date.now() - this.time) / 1000;
				return;
			}
			//Wrong! Flip cards reset clickedCard and selectedCards
			this.cardMap.get(this.selectedCards[0]).deSelect();
			this.cardMap
				.get(this.selectedCards[1])
				.deSelect()
				.then(() => {
					this.canClick = true;
				});
			this.clickedCard = false;
			this.selectedCards = [];
		}
	}
}

function setup() {
	//Create list of cards and pass to game controller
	let cardList = [];
	for (const n in cardType) {
		cardList.push(new Card(0, 0, n, variants.CARD));
		cardList.push(new Card(0, 0, n, variants.TEXT));
	}
	gc = new GameContainer(cardList);
	//Create the canvas vased on window size
	createCanvas(window.innerWidth, window.innerHeight - 1);
}

function draw() {
	//Clear background and tell the game container to draw
	background('#2C2F33');
	gc.draw();
}
// O
function mouseClicked(e) {
	gc.handleClick(e);
}

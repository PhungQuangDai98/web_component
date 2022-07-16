// Language: javascript
// Path: js/index.js
const styles =
		'<style>*::after,*::before{box-sizing:border-box;}:root{--cell-size:100px;--mark-size:calc(var(--cell-size) * .9);}body{margin:0;}.board{width:100vw;height:100vh;display:grid;justify-content:center;align-content:center;grid-template-columns:repeat(3,auto);}.cell{width:100px;height:100px;border:1px solid rgb(88,88,88);display:flex;justify-content:center;align-items:center;position:relative;cursor:pointer;}.cell:first-child,.cell:nth-child(2),.cell:nth-child(3){border-top:none;}.cell:last-child,.cell:nth-child(7),.cell:nth-child(8){border-bottom:none;}.cell:nth-child(3n + 1){border-left:none;}.cell:nth-child(3n + 3){border-right:none;}.cell.x,.cell.circle{cursor:not-allowed;}.board.x .cell:not(.x):not(.circle):hover::before,.board.x .cell:not(.x):not(.circle):hover::after,.board.circle .cell:not(.x):not(.circle):hover::before{background-color:rgb(218,216,216);}.cell.x::before,.cell.x::after,.cell.circle::before{background-color:#000;}.cell.x::before,.cell.x::after,.board.x .cell:not(.x):not(.circle):hover::before,.board.x .cell:not(.x):not(.circle):hover::after{content:"";width:calc(var(--mark-size) * .15);height:var(--mark-size);position:absolute;}.cell.x::before,.board.x .cell:not(.x):not(.circle):hover::before{transform:rotate(-45deg);}.cell.x::after,.board.x .cell:not(.x):not(.circle):hover::after{transform:rotate(45deg);}.cell.circle::before,.cell.circle::after,.board.circle .cell:not(.x):not(.circle):hover::before,.board.circle .cell:not(.x):not(.circle):hover::after{content:"";border-radius:50%;position:absolute;}.cell.circle::before,.board.circle .cell:not(.x):not(.circle):hover::before{width:var(--mark-size);height:var(--mark-size);}.cell.circle::after,.board.circle .cell:not(.x):not(.circle):hover::after{width:calc(var(--mark-size) * .7);height:calc(var(--mark-size) * .7);background-color:#fff;}.winning-message{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(10,10,10,.575);justify-content:center;align-items:center;color:#fff;font-size:3rem;flex-direction:column;}.winning-message button{font-size:1.5rem;background-color:#fff;border:1px solid #000;padding:.25em .5em;cursor:pointer;border-radius:6px;}.winning-message button:hover{background-color:rgb(56,55,55);color:#fff;border:1px solid #fff;}.winning-message.show{display:flex;}</style>',
	html =
		'<div class="board" id="board"><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div><div class="cell" data-cell></div>\n</div><div class="winning-message" id="win"><div data-winning-message-text></div><button type="button" id="btn_restart">Restart</button></div>';
class TicTacToe extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	connectedCallback() {
		this.render();
		this.game();
	}
	render() {
		this.shadowRoot.innerHTML = `${styles}${html}`;
	}
	game() {
		const cellColumn = this.shadowRoot.querySelectorAll("[data-cell]");
		const board = this.shadowRoot.getElementById("board");
		const winingMessage = this.shadowRoot.getElementById("win");
		const winningMessageText = this.shadowRoot.querySelector(
			"[data-winning-message-text]"
		);
		const restartButton = this.shadowRoot.getElementById("btn_restart");

		let circleTurn;
		const X_CLASS = "x";
		const CIRCLE_CLASS = "circle";
		const WINNING_COMBINATIONS = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		const PlaceMark = (cell, currentClass) => {
			cell.classList.add(currentClass);
		};

		const SwapTurn = () => {
			circleTurn = !circleTurn;
		};

		const SetBoardHoverClass = () => {
			board.classList.remove(CIRCLE_CLASS);
			board.classList.remove(X_CLASS);
			board.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
		};

		const IsWin = (currentClass) => {
			return WINNING_COMBINATIONS.some((combination) => {
				return combination.every((index) => {
					return cellColumn[index].classList.contains(currentClass);
				});
			});
		};

		const IsDraw = () => {
			return [...cellColumn].every((cell) => {
				return (
					cell.classList.contains(X_CLASS) ||
					cell.classList.contains(CIRCLE_CLASS)
				);
			});
		};

		const EndGame = (draw) => {
			if (draw) {
				winningMessageText.innerText = "Draw!";
			} else {
				winningMessageText.innerText = `${circleTurn ? "O's" : "X's"} Wins`;
			}
			winingMessage.classList.add("show");
		};

		const handleClick = function (event) {
			const cell = event.target;
			console.log(circleTurn);
			const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
			PlaceMark(cell, currentClass);
			if (IsWin(currentClass)) {
				EndGame(false);
			} else if (IsDraw()) {
				EndGame(true);
			} else {
				SwapTurn();
				SetBoardHoverClass();
			}
		};

		const StartGame = () => {
			circleTurn = false;
			cellColumn.forEach((cell) => {
				cell.classList.remove(CIRCLE_CLASS);
				cell.classList.remove(X_CLASS);
				cell.removeEventListener("click", handleClick);
				cell.addEventListener("click", handleClick, { once: true });
			});
			SetBoardHoverClass();
			winingMessage.classList.remove("show");
		};
		restartButton.addEventListener("click", StartGame);
		StartGame();
	}
}
window.customElements.define("tic-tac-toe", TicTacToe);

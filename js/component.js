//Language : javascript
//Path : js/component.js
class Counter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.count = 0;
	}

	connectedCallback() {
		this.render();
		this.shadowRoot.querySelector(".counter").addEventListener("click", () => {
			this.count++;
			this.shadowRoot.querySelector(".counter").innerHTML = this.count;
		});
	}
	render() {
		console.log("render");
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					font-size: 1.5rem;
					font-weight: bold;
					text-align: center;
				}
				.counter {
					display: inline-block;
					border: 1px solid #ccc;
					padding: 0.5rem;
					border-radius: 0.25rem;
					background-color: #fff;
					color: #000;
				}
				.counter:hover {
					cursor: pointer;
					background-color: #ccc;
				}
				.counter:active {
					background-color: #aaa;
				}
			</style>
			<div class="counter">0</div>
		`;
	}
}

customElements.define("counter-component", Counter);

import {By, promise} from "selenium-webdriver";
import {RadioOption} from "./RadioOption";

export class CheckboxOption extends RadioOption {
	constructor(selector: By) {
		super(selector);
	}

	public toggle() {
		return super.select();
	}

	public select(): promise.Promise<any> {
		return this.isSelected().then((isSelected) => {
			if (!isSelected) {
				this.toggle();
			}
		});
	}

	public unselect() {
		return this.isSelected().then((isSelected) => {
			if (isSelected) {
				this.toggle();
			}
		});
	}
}

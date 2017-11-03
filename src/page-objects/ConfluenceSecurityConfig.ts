import {by, element} from "protractor";
import {promise} from "selenium-webdriver";
import {CheckboxOption} from "../utils/elements/CheckboxOption";
import {ConfluenceAction} from "./ConfluenceAction";
import {ConfluenceBase} from "./ConfluenceBase";

export class ConfluenceSecurityConfig extends ConfluenceBase {

	public viewSecurityAction = new ConfluenceAction({
		path: "admin/viewsecurityconfig.action",
	});

	public editSecurityAction = new ConfluenceAction({
		path: "admin/editsecurityconfig.action",
	});

	constructor() {
		super();
	}

	public getWebSudoCheckBox(): CheckboxOption {
		return new CheckboxOption(by.name("webSudoEnabled"));
	}

	public isWebSudoEnabled(): promise.Promise<boolean> {
		this.viewSecurityAction.open({refreshAlways: true});
		return this.getWebSudoCheckBox().isSelected();
	}

	public enableWebSudo(): void {
		this.executeAndSave(() => {
			this.getWebSudoCheckBox().select();
		});
	}

	public disableWebSudo(): void {
		this.executeAndSave(() => {
			this.getWebSudoCheckBox().unselect();
		});
	}

	private executeAndSave(changeOptionsFn: () => void) {
		this.editSecurityAction.open({refreshAlways: true});

		changeOptionsFn();

		element(by.id("confirm")).click();
	}

}

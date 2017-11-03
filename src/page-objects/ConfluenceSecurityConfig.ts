import {by} from "protractor";
import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {CheckboxOption} from "../utils/elements/CheckboxOption";
import {ConfluenceAction} from "./ConfluenceAction";
import {ConfluenceBase} from "./ConfluenceBase";

const asyncElement = pageObjectUtils.asyncElement;

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
		this.edit();
		this.getWebSudoCheckBox().select();
		this.save();
	}

	public disableWebSudo(): void {
		this.edit();
		this.getWebSudoCheckBox().unselect();
		this.save();
	}

	private edit(): void {
		this.editSecurityAction.open({refreshAlways: true});
	}

	private save(): void {
		asyncElement(by.id("confirm")).click();
	}
}

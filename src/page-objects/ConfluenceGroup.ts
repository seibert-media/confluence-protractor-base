import {by, element} from "protractor";
import {Key, promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceAction} from "./ConfluenceAction";
import {ConfluenceBase} from "./ConfluenceBase";

const asyncElement = pageObjectUtils.asyncElement;

export class ConfluenceGroup extends ConfluenceBase {

	public groupActions = {
		browseGroups: new ConfluenceAction({
			path: "admin/users/browsegroups.action",
		}),
	};

	private groupname: string;

	constructor(groupname: string) {
		super();
		this.groupname = groupname;
	}

	public getGroupname() {
		return this.groupname;
	}

	public create(): any {
		this.groupActions.browseGroups.open();
		element(by.id("switch-button")).click();
		const formContainer = "#create-group-form";
		asyncElement(by.css(formContainer + ' input[name="name"]')).sendKeys(this.groupname);
		return element(by.css(formContainer + " input[type='submit']")).click();
	}

	public exists(): promise.Promise<boolean> {
		this.groupActions.browseGroups.open();
		this.filterGroup();
		return asyncElement(by.id("group-row-" + this.groupname)).isPresent();
	}

	public remove() {
		this.groupActions.browseGroups.open();
		this.filterGroup();
		const removeGroupButton = asyncElement(by.id(this.groupname + "-group-link"));
		removeGroupButton.click();
		return asyncElement(by.name("confirm")).click();
	}

	private filterGroup() {
		const filterInput = asyncElement(by.name("searchTerm"));
		filterInput.sendKeys(this.groupname);
		filterInput.sendKeys(Key.ENTER);
	}

}

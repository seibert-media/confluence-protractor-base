import {browser, by, element, ExpectedConditions} from "protractor";
import {Locator} from "protractor/built/locators";
import {By, promise} from "selenium-webdriver";
import {CheckboxOption} from "../utils/elements/CheckboxOption";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceBase} from "./ConfluenceBase";
import {ConfluenceSpace} from "./ConfluenceSpace";
import {UserActions} from "./UserActions";

// page object utils imports
const asyncElement = pageObjectUtils.asyncElement;

const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

export class ConfluenceUser extends ConfluenceBase {

	public readonly username: string;
	public readonly fullName: string;
	public readonly email: string;
	public readonly password: string;

	public readonly userActions: UserActions;

	public readonly personalSpace: ConfluenceSpace;

	constructor(username: string, fullName: string, email: string, password: string) {
		super();

		pageObjectUtils.assertNotNull(username, "options.username is required");

		this.username = username;
		this.fullName = fullName;
		this.email = email;
		this.password = password;

		const personalSpaceKey = "~" + username;
		this.personalSpace = new ConfluenceSpace(personalSpaceKey);

		this.userActions = new UserActions(username, fullName);
	}

	public login(loginUsername?: string, loginPassword?: string) {
		super.login(loginUsername || this.username, loginPassword || this.password);
	}

	public create() {
		this.userActions.createUser.open();

		asyncElement(by.name("username")).sendKeys(this.username);
		asyncElement(by.name("fullName")).sendKeys(this.fullName);
		asyncElement(by.name("email")).sendKeys(this.email);

		const sendMailInput = new CheckboxOption(by.name("sendEmail"));
		sendMailInput.element().isPresent().then((isMailServerConfigured) => {
			if (isMailServerConfigured) {
				sendMailInput.unselect();
			}
		});

		asyncElement(by.name("password")).sendKeys(this.password);
		asyncElement(by.name("confirm")).sendKeys(this.password);

		asyncElement(by.css('#create-user-form [type="submit"]')).click();
	}

	public createIfNotExists() {
		this.isInSearchIndex().then(function(isInSearchIndex) {
			if (!isInSearchIndex) {
				this.create();
			}
		});
	}

	public remove() {
		this.userActions.removeUser.open();
		asyncElement(by.id("confirm")).click();
	}

	public isInGroup(groupName: string) {
		this.userActions.userAdminView.open({refreshAlways: true});
		return element(this.groupSelector(groupName)).isPresent();
	}

	public waitUntilUserAppearsInGroup(groupName: string) {
		return browser.wait(this.isInGroup.bind(this, groupName), DEFAULT_LOADING_TIMEOUT);
	}

	public waitUntilUserDisappearsFromGroup(groupName: string) {
		browser.wait(ExpectedConditions.not(this.isInGroup.bind(this, groupName)), DEFAULT_LOADING_TIMEOUT);
	}

	public hasGroup(groupName: string): promise.Promise<boolean> {
		this.userActions.userAdminView.open();

		const selector = '[href="domembersofgroupsearch.action?membersOfGroupTerm=' + groupName + '"]';
		return asyncElement(this.groupSelector(groupName)).isPresent();
	}

	public isInSearchIndex() {
		this.userActions.searchUser.open({refreshAlways: true});

		let userProfileSearchPath = this.userActions.userProfile.path;

		if (this.confluenceVersion().lessThan("5.9")) {
			userProfileSearchPath = "display/~" + this.username + "?src=search";
		}

		return element(by.css('a.search-result-link[href="/' + userProfileSearchPath + '"]')).isPresent();
	}

	public waitUntilUserInSearchIndex() {
		return browser.wait(this.isInSearchIndex.bind(this), DEFAULT_LOADING_TIMEOUT);
	}

	public addGroup(groupname: string) {
		return this.changeGroup(groupname, "select");
	}

	public removeGroup(groupname: string) {
		return this.changeGroup(groupname, "unselect");
	}

	public viewPersonalSpace() {
		this.userActions.viewPersonalSpace.open();
	}

	public createPersonalSpace() {
		this.userActions.createPersonalSpace.open();
		return element(by.css('input[value="Create"]')).click();
	}

	public removePersonalSpace() {
		this.personalSpace.remove();
	}

	private groupSelector(groupName: string): By {
		return by.css('[href="domembersofgroupsearch.action?membersOfGroupTerm=' + groupName + '"]');
	}

	private changeGroup(groupname: string, operation: string) {
		const form = "form#editusergroupsform";
		const groupCheckbox = form + " input[name='newGroups']#" + groupname;
		this.userActions.editUserGroups.open();
		const checkboxOption = new CheckboxOption(by.css(groupCheckbox));
		checkboxOption[operation]();
		return element(by.css(form + " input[type='submit']")).click();
	}
}

import {by} from "protractor";
import {pageObjectUtils} from "../../utils/pageObjectUtils";
import {ConfluenceAction} from "../ConfluenceAction";
import {promise} from "selenium-webdriver";

const asyncElement = pageObjectUtils.asyncElement;

const tablePrefixes = {
	ANONYMOUS: "a",
	GROUP: "g",
	USER: "u",
};

export class SpacePermissionAction extends ConfluenceAction {

	private spaceKey: string;

	constructor(spaceKey: string) {
		super({path: "spaces/spacepermissions.action?key=" + spaceKey});
		this.spaceKey = spaceKey;
	}

	public getGroupPermission(permission: string, group: string): any {
		pageObjectUtils.assertNotNull(group, "getGroupPermission needs a group parameter");
		const additionalSelector = '[data-permission-group="' + group + '"]';
		return this.getPermission(tablePrefixes.GROUP, permission, additionalSelector);
	}

	public getAnonymousPermission(permission: string): any {
		return this.getPermission(tablePrefixes.ANONYMOUS, permission);
	}

	public getUserPermission(permission: string, user: string): any {
		pageObjectUtils.assertNotNull(user, "getUserPermisson needs a user parameter");
		const additionalSelector = '[data-permission-user="' + user + '"]';
		return this.getPermission(tablePrefixes.USER, permission, additionalSelector);
	}

	private getPermission(tablePrefix: string, permission: string, additionalSelector = ""): promise.Promise<any> {
		const tableSelector = "table#" + tablePrefix + "PermissionsTable ";
		const permissionSelector = '[data-permission="' + permission + '"]';

		const selector = tableSelector + permissionSelector + additionalSelector;
		return asyncElement(by.css(selector)).getAttribute("data-permission-set");
	}

}

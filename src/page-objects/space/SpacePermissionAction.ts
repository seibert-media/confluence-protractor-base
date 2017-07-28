import {by} from "protractor";
import {pageObjectUtils} from "../../utils/pageObjectUtils";
import {ConfluenceAction} from "../ConfluenceAction";

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

	public getGroupPermission(permisson, group): any {
		pageObjectUtils.assertNotNull(group, "getGroupPermission needs a group parameter");
		const additionalSelector = '[data-permission-group="' + group + '"]';
		return this.getPermission(tablePrefixes.GROUP, permisson, additionalSelector);
	}

	public getAnonymousPermission(permisson): any {
		return this.getPermission(tablePrefixes.ANONYMOUS, permisson);
	}

	public getUserPermission(permisson, user): any {
		pageObjectUtils.assertNotNull(user, "getUserPermisson needs a user parameter");
		const additionalSelector = '[data-permission-user="' + user + '"]';
		return this.getPermission(tablePrefixes.USER, permisson, additionalSelector);
	}

	private getPermission(tablePrefix, permission, additionalSelector = "") {
		const tableSelector = "table#" + tablePrefix + "PermissionsTable ";
		const permissionSelector = '[data-permission="' + permission + '"]';

		const selector = tableSelector + permissionSelector + additionalSelector;
		return asyncElement(by.css(selector)).getAttribute("data-permission-set");
	}
}

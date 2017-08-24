import {ConfluenceAction} from "./ConfluenceAction";

export class UserActions {

	private readonly _username: string;
	private readonly _fullname: string;

	private readonly _createUser = new ConfluenceAction({
		path: "admin/users/createuser.action",
	});
	private readonly _removeUser = new ConfluenceAction({
		path: "admin/users/removeuser.action?_username=" + encodeURIComponent(this._username),
	});
	private readonly _userProfile = new ConfluenceAction({
		path: "display/~" + encodeURIComponent(this._username),
	});
	private readonly _userAdminView = new ConfluenceAction({
		path: "admin/users/viewuser.action?_username=" + encodeURIComponent(this._username),
	});
	private readonly _searchUser = new ConfluenceAction({
		path: "dosearchsite.action?queryString=" + this._fullname.replace(" ", "+"),
	});
	private readonly _editUserGroups = new ConfluenceAction({
		path: "admin/users/editusergroups-start.action?_username=" + encodeURIComponent(this._username),
	});
	private readonly _viewPersonalSpace = new ConfluenceAction({
		path: "spaces/viewspace.action?key=~" + encodeURIComponent(this._username),
	});
	private readonly _createPersonalSpace = new ConfluenceAction({
		path: "spaces/createpersonalspace.action",
	});

	constructor(username: string, fullname: string) {
		this._username = username;
		this._fullname = fullname;
	}

	get username(): string {
		return this._username;
	}

	get createUser(): ConfluenceAction {
		return this._createUser;
	}

	get removeUser(): ConfluenceAction {
		return this._removeUser;
	}

	get userProfile(): ConfluenceAction {
		return this._userProfile;
	}

	get userAdminView(): ConfluenceAction {
		return this._userAdminView;
	}

	get searchUser(): ConfluenceAction {
		return this._searchUser;
	}

	get editUserGroups(): ConfluenceAction {
		return this._editUserGroups;
	}

	get viewPersonalSpace(): ConfluenceAction {
		return this._viewPersonalSpace;
	}

	get createPersonalSpace(): ConfluenceAction {
		return this._createPersonalSpace;
	}

}
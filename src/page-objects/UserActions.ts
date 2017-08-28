import {ConfluenceAction} from "./ConfluenceAction";

export class UserActions {

	public readonly username: string;
	public readonly fullname: string;

	public readonly createUser: ConfluenceAction;
	public readonly removeUser: ConfluenceAction;
	public readonly userProfile: ConfluenceAction;
	public readonly userAdminView: ConfluenceAction;
	public readonly searchUser: ConfluenceAction;
	public readonly editUserGroups: ConfluenceAction;
	public readonly viewPersonalSpace: ConfluenceAction;
	public readonly createPersonalSpace: ConfluenceAction;

	constructor(username: string, fullname: string) {
		this.username = username;
		this.fullname = fullname;

		this.createUser = new ConfluenceAction({
			path: "admin/users/createuser.action",
		});
		this.removeUser = new ConfluenceAction({
			path: "admin/users/removeuser.action?_username=" + encodeURIComponent(this.username),
		});
		this.userProfile = new ConfluenceAction({
			path: "display/~" + encodeURIComponent(this.username),
		});
		this.userAdminView = new ConfluenceAction({
			path: "admin/users/viewuser.action?_username=" + encodeURIComponent(this.username),
		});
		this.searchUser = new ConfluenceAction({
			path: "dosearchsite.action?queryString=" + this.fullname.replace(" ", "+"),
		});
		this.editUserGroups = new ConfluenceAction({
			path: "admin/users/editusergroups-start.action?_username=" + encodeURIComponent(this.username),
		});
		this.viewPersonalSpace = new ConfluenceAction({
			path: "spaces/viewspace.action?key=~" + encodeURIComponent(this.username),
		});
		this.createPersonalSpace = new ConfluenceAction({
			path: "spaces/createpersonalspace.action",
		});
	}
}

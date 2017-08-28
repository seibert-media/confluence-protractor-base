import {ConfluenceAction} from "./ConfluenceAction";

export class UserActions {

	public readonly username: string;
	public readonly fullname: string;

	public readonly createUser = new ConfluenceAction({
		path: "admin/users/createuser.action",
	});
	public readonly removeUser = new ConfluenceAction({
		path: "admin/users/removeuser.action?_username=" + encodeURIComponent(this.username),
	});
	public readonly userProfile = new ConfluenceAction({
		path: "display/~" + encodeURIComponent(this.username),
	});
	public readonly userAdminView = new ConfluenceAction({
		path: "admin/users/viewuser.action?_username=" + encodeURIComponent(this.username),
	});
	public readonly searchUser = new ConfluenceAction({
		path: "dosearchsite.action?queryString=" + this.fullname.replace(" ", "+"),
	});
	public readonly editUserGroups = new ConfluenceAction({
		path: "admin/users/editusergroups-start.action?_username=" + encodeURIComponent(this.username),
	});
	public readonly viewPersonalSpace = new ConfluenceAction({
		path: "spaces/viewspace.action?key=~" + encodeURIComponent(this.username),
	});
	public readonly createPersonalSpace = new ConfluenceAction({
		path: "spaces/createpersonalspace.action",
	});

	constructor(username: string, fullname: string) {
		this.username = username;
		this.fullname = fullname;
	}
}

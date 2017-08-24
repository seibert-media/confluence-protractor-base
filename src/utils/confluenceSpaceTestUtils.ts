import {ConfluenceSpace} from "../page-objects/ConfluenceSpace";

const screenshotReporter = require("../jasmineReporters/screenshotReporter").screenshotReporter;
const pageObjectUtils = require("../utils/pageObjectUtils").pageObjectUtils;

export const confluenceSpaceTestUtils = {
	testAnonymousPermissions: (spacePageObject: ConfluenceSpace, permissions: any) => {
		testPermissions(spacePageObject, permissions, PermissionMethod.ANONYMOUS);
	},
	testGroupPermissions: (spacePageObject: ConfluenceSpace, permissions: any, group: any) => {
		testPermissions(spacePageObject, permissions, PermissionMethod.GROUP, group);
	},
	testUserPermissions: (spacePageObject: ConfluenceSpace, permissions: any, user: any) => {
		testPermissions(spacePageObject, permissions, PermissionMethod.USER, user);
	},
};

enum PermissionMethod {
	ANONYMOUS = "getAnonymousPermission",
	GROUP = "getGroupPermission",
	USER = "getUserPermission"
}

function createPermissionMapFromList(permissionList: string[]) {
	const allPermissions = {
		viewspace: false,
		removeowncontent: false,
		editspace: false,
		removepage: false,
		editblog: false,
		removeblog: false,
		createattachment: false,
		removeattachment: false,
		comment: false,
		removecomment: false,
		setpagepermissions: false,
		removemail: false,
		exportspace: false,
		setspacepermissions: false,
	};

	permissionList.forEach(permissionName => {
		if (allPermissions[permissionName]) {
			throw new Error("Unknown permission: " + permissionName);
		}

		allPermissions[permissionName] = true;
	});

	return allPermissions;
}

// TODO: Replace explicit any typing with Permission Object logic (will also allow calling SpacePermissionAction methods *much* more type safe)
function testPermissions(spacePageObject: ConfluenceSpace, permissions: any, permissionMethod: PermissionMethod, additionalPermissionParam?: any) {
	const spacePermissionsAction = spacePageObject.spaceActions.spacePermissions;

	if (Array.isArray(permissions)) {
		permissions = createPermissionMapFromList(permissions);
	}

	beforeEach(() => {
		screenshotReporter.disable();
		spacePermissionsAction.open();

		pageObjectUtils.takeScreenshot("permissions for space (" + spacePageObject.getSpaceKey() + ").png");
	});

	afterAll(screenshotReporter.enable);

	Object.keys(permissions).forEach(permissionName => {
		const permitted = permissions[permissionName];
		const permittedText = permitted ? "" : "NO ";

		const confluenceVersion = spacePageObject.confluenceVersion();

		it("has " + permittedText + '"' + permissionName + '" permission', () => {
			if (permissionName === "removeowncontent" && confluenceVersion.lessThan("5.10")) {
				console.log('Ignore "removeowncontent" because version is < 5.10. Version: ' + confluenceVersion);
				return;
			}

			expect(spacePermissionsAction[permissionMethod](permissionName, additionalPermissionParam)).toBe("" + permitted);
		});
	});

}

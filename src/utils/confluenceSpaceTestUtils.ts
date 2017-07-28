const screenshotReporter = require("../jasmineReporters/screenshotReporter").screenshotReporter;
const pageObjectUtils = require("../utils/pageObjectUtils").pageObjectUtils;

export const confluenceSpaceTestUtils = {
	testAnonymousPermissions: (spacePageObject, permissions) => {
		testPermissions(spacePageObject, permissions, permissionMethods.ANONYMOUS);
	},
	testGroupPermissions: (spacePageObject, permissions, group) => {
		testPermissions(spacePageObject, permissions, permissionMethods.GROUP, group);
	},
	testUserPermissions: (spacePageObject, permissions, user) => {
		testPermissions(spacePageObject, permissions, permissionMethods.USER, user);
	},
};

const permissionMethods = {
	ANONYMOUS: "getAnonymousPermission",
	GROUP: "getGroupPermission",
	USER: "getUserPermission",
};

function createPermissionMapFromList(permissionList) {
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

	permissionList.forEach((permissionName) => {
		if (allPermissions[permissionName]) {
			throw new Error("Unknown permission: " + permissionName);
		}

		allPermissions[permissionName] = true;
	});

	return allPermissions;
}

function testPermissions(spacePageObject, permissions, permissionMethod, additionalPermissionParam?) {
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

	Object.keys(permissions).forEach((permissionName, index) => {
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

var screenshotReporter = require('../jasmineReporters/screenshotReporter');
var pageObjectUtils = require('../utils/pageObjectUtils');

var confluenceSpaceTestUtils = {
	testAnonymousPermissions: function (spacePageObject, permissions) {
		testPermissions(spacePageObject, permissions, permissionMethods.ANONYMOUS);
	},
	testGroupPermissions: function (spacePageObject, permissions, group) {
		testPermissions(spacePageObject, permissions, permissionMethods.GROUP, group);
	},
	testUserPermissions: function (spacePageObject, permissions, user) {
		testPermissions(spacePageObject, permissions, permissionMethods.USER, user);
	}
};

var permissionMethods = {
	ANONYMOUS: 'getAnonymousPermission',
	GROUP: 'getGroupPermission',
	USER: 'getUserPermission'
};

function createPermissionMapFromList(permissionList) {
	var allPermissions = {
		'viewspace': false,
		'removeowncontent': false,
		'editspace': false,
		'removepage': false,
		'editblog': false,
		'removeblog': false,
		'createattachment': false,
		'removeattachment': false,
		'comment': false,
		'removecomment': false,
		'setpagepermissions': false,
		'removemail': false,
		'exportspace': false,
		'setspacepermissions': false
	};

	permissionList.forEach(function (permissionName) {
		if (allPermissions[permissionName]) {
			throw new Error('Unknown permission: ' + permissionName);
		}

		allPermissions[permissionName] = true;
	});

	return allPermissions;
}

function testPermissions(spacePageObject, permissions, permissionMethod, additionalPermissionParam) {
	var spacePermissionsAction = spacePageObject.actions.spacePermissions;

	if (Array.isArray(permissions)) {
		permissions = createPermissionMapFromList(permissions);
	}

	beforeEach(function () {
		screenshotReporter.disable();
		spacePermissionsAction.open();

		pageObjectUtils.takeScreenshot('permissions for space (' + spacePageObject.getSpaceKey() + ').png');
	});

	afterAll(screenshotReporter.enable);

	Object.keys(permissions).forEach(function (permissionName, index) {
		var permitted = permissions[permissionName];
		var permittedText = permitted ? '' : 'NO ';

		var confluenceVersion = spacePageObject.confluenceVersion();

		it('has ' + permittedText + '"' + permissionName + '" permission', function () {
			if (permissionName === 'removeowncontent' && confluenceVersion.lessThan('5.10')) {
				console.log('Ignore "removeowncontent" because version is < 5.10. Version: ' + confluenceVersion);
				return;
			}

			expect(spacePermissionsAction[permissionMethod](permissionName, additionalPermissionParam)).toBe('' + permitted);
		});
	});
}

module.exports = confluenceSpaceTestUtils;

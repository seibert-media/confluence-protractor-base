var screenshotReporter = require('../jasmineReporters/screenshotReporter');

var confluenceSpaceTestUtils = {
	testAnonymousPermissions: function (spacePageObject, permissionsSet) {
		testPermissions(spacePageObject, permissionsSet, permissionMethods.ANONYMOUS);
	},
	testGroupPermissions: function (spacePageObject, permissionsSet, group) {
		testPermissions(spacePageObject, permissionsSet, permissionMethods.GROUP, group);
	},
	testUserPermissions: function (spacePageObject, permissionsSet, user) {
		testPermissions(spacePageObject, permissionsSet, permissionMethods.USER, user);
	}
};

var permissionMethods = {
	ANONYMOUS: 'getAnonymousPermission',
	GROUP: 'getGroupPermission',
	USER: 'getUserPermission'
};

function testPermissions(spacePageObject, permissionsSet, permissionMethod, additionalPermissionParam) {
	var spacePermissionsAction = spacePageObject.actions.spacePermissions;


	beforeEach(function () {
		spacePermissionsAction.open();
	});

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	Object.keys(permissionsSet).forEach(function (permissionName, index) {
		var permitted = permissionsSet[permissionName];
		var permittedText = permitted ? '' : 'NO ';

		if (index === 0) {
			screenshotReporter.enable()
		}

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

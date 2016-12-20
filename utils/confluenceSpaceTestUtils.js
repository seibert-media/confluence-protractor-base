var screenshotReporter = require('../jasmineReporters/screenshotReporter');

var confluenceSpaceTestUtils = {
	testAnonymousPermissions: function (spacePermissionsAction, permissionsSet) {
		testPermissions(spacePermissionsAction, permissionsSet, permissionMethods.ANONYMOUS);
	},
	testGroupPermissions: function (spacePermissionsAction, permissionsSet, group) {
		testPermissions(spacePermissionsAction, permissionsSet, permissionMethods.GROUP, group);
	},
	testUserPermissions: function (spacePermissionsAction, permissionsSet, user) {
		testPermissions(spacePermissionsAction, permissionsSet, permissionMethods.USER, user);
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

		it('has ' + permittedText + '"' + permissionName + '" permission', function () {
			expect(spacePermissionsAction[permissionMethod](permissionName, additionalPermissionParam)).toBe('' + permitted);
		});
	});
}

module.exports = confluenceSpaceTestUtils;

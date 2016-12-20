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

	Object.keys(permissionsSet).forEach(function (permissionName) {
		var permitted = permissionsSet[permissionName];
		var permittedText = permitted ? '' : 'NO ';

		it('has ' + permittedText + '"' + permissionName + '" permission', function () {
			expect(spacePermissionsAction[permissionMethod](permissionName, additionalPermissionParam)).toBe('' + permitted);
		})
	});
}

module.exports = confluenceSpaceTestUtils;

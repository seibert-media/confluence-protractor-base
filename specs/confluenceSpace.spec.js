var ConfluenceSpace = require('../page-objects/ConfluenceSpace');
var confluenceSpaceTestUtils = require('../utils/confluenceSpaceTestUtils');

describe('ConfluenceSpace (page object)', function() {

	var demonstrationSpace = new ConfluenceSpace('ds', 'Demonstration Space');
	beforeAll(function () {
		demonstrationSpace.authenticateAsAdmin();
	});

	describe('assertSpaceExists', function () {
		var notExistingSpace = new ConfluenceSpace('NOT_EXISTING_SPACE_KEY', 'Not existing space');

		it('detects existing space', function () {
			demonstrationSpace.assertSpaceExists();
		});

		it('detects existing space', function () {
			notExistingSpace.assertSpaceExistsNot();
		});
	});

	describe('spacePermissions', function () {
		describe('for "confluence-users" group', function () {
			var confluenceUsersPermissions = {
				'viewspace': true,
				'removeowncontent': true,
				'editspace': true,
				'removepage': true,
				'editblog': true,
				'removeblog': true,
				'createattachment': true,
				'removeattachment': true,
				'comment': true,
				'removecomment': true,
				'setpagepermissions': true,
				'removemail': true,
				'exportspace': true,
				'setspacepermissions': false
			};

			var group = 'confluence-users';
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceUsersPermissions, group);
		});

		describe('for "confluence-administrators" group', function () {
			var confluenceAdministratorsPermissions = {
				'viewspace': true,
				'removeowncontent': true,
				'editspace': true,
				'removepage': true,
				'editblog': true,
				'removeblog': true,
				'createattachment': true,
				'removeattachment': true,
				'comment': true,
				'removecomment': true,
				'setpagepermissions': true,
				'removemail': true,
				'exportspace': true,
				'setspacepermissions': true
			};

			var group = 'confluence-administrators';
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceAdministratorsPermissions, group);
		});

		describe('anonymous user', function () {

			var anonymousPermissions = {
				'viewspace': true,
				'removeowncontent': true,
				'editspace': true,
				'removepage': true,
				'editblog': true,
				'removeblog': true,
				'createattachment': true,
				'removeattachment': true,
				'comment': true,
				'removecomment': true,
				'setpagepermissions': false,
				'removemail': true,
				'exportspace': true,
				'setspacepermissions': false
			};

			confluenceSpaceTestUtils.testAnonymousPermissions(demonstrationSpace, anonymousPermissions);
		});
	});


	describe('create() and remove() as non admin user', function () {
		var adarasTestSpace = new ConfluenceSpace('ADARA', 'Adara\'s Test Space');

		beforeEach(function () {
			adarasTestSpace.login();
		});

		it('creates a space', function () {
			adarasTestSpace.create();
			adarasTestSpace.assertSpaceExists();
		});

		describe('spacePermissions', function () {
			describe('for "confluence-users" group', function () {
				var confluenceUsersPermissions = {
					'viewspace': true,
					'removeowncontent': true,
					'editspace': true,
					'removepage': false,
					'editblog': true,
					'removeblog': false,
					'createattachment': true,
					'removeattachment': false,
					'comment': true,
					'removecomment': false,
					'setpagepermissions': false,
					'removemail': false,
					'exportspace': true,
					'setspacepermissions': false
				};

				var group = 'confluence-users';
				confluenceSpaceTestUtils.testGroupPermissions(adarasTestSpace, confluenceUsersPermissions, group);
			});

			describe('creator user permissions (Adara.Moss)', function () {

				var creatorUserPermissions = {
					'viewspace': true,
					'removeowncontent': true,
					'editspace': true,
					'removepage': true,
					'editblog': true,
					'removeblog': true,
					'createattachment': true,
					'removeattachment': true,
					'comment': true,
					'removecomment': true,
					'setpagepermissions': true,
					'removemail': true,
					'exportspace': true,
					'setspacepermissions': true
				};

				var username = 'Adara.Moss';
				confluenceSpaceTestUtils.testUserPermissions(adarasTestSpace, creatorUserPermissions, username);
			});

			describe('anonymous user', function () {

				var anonymousPermissions = {
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

				confluenceSpaceTestUtils.testAnonymousPermissions(adarasTestSpace, anonymousPermissions);
			});
		});

		it('removes a space', function () {
			adarasTestSpace.authenticate();
			adarasTestSpace.remove();
			adarasTestSpace.assertSpaceExistsNot();
		});
	});
});

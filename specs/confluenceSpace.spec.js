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

		it('detects NOT existing space', function () {
			notExistingSpace.assertSpaceExistsNot();
		});
	});

	describe('spacePermissions', function () {
		describe('for "confluence-users" group', function () {
			var confluenceUsersPermissionsAsMap = {
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
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceUsersPermissionsAsMap, group);
		});

		describe('for "confluence-administrators" group', function () {
			var confluenceAdministratorsPermissionsAsList = [
				'viewspace',
				'removeowncontent',
				'editspace',
				'removepage',
				'editblog',
				'removeblog',
				'createattachment',
				'removeattachment',
				'comment',
				'removecomment',
				'setpagepermissions',
				'removemail',
				'exportspace',
				'setspacepermissions'
			];

			var group = 'confluence-administrators';
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceAdministratorsPermissionsAsList, group);
		});

		describe('anonymous user', function () {
			var anonymousPermissionsAsList = [
				'viewspace',
				'removeowncontent',
				'editspace',
				'removepage',
				'editblog',
				'removeblog',
				'createattachment',
				'removeattachment',
				'comment',
				'removecomment',
				'removemail',
				'exportspace'
			];

			confluenceSpaceTestUtils.testAnonymousPermissions(demonstrationSpace, anonymousPermissionsAsList);
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
				var confluenceUsersPermissionsAsList = [
					'viewspace',
					'removeowncontent',
					'editspace',
					'editblog',
					'createattachment',
					'comment',
					'exportspace'
				];

				var group = 'confluence-users';
				confluenceSpaceTestUtils.testGroupPermissions(adarasTestSpace, confluenceUsersPermissionsAsList, group);
			});

			describe('creator user permissions (Adara.Moss)', function () {

				var creatorUserPermissionsAsList = [
					'viewspace',
					'removeowncontent',
					'editspace',
					'removepage',
					'editblog',
					'removeblog',
					'createattachment',
					'removeattachment',
					'comment',
					'removecomment',
					'setpagepermissions',
					'removemail',
					'exportspace',
					'setspacepermissions'
				];

				var username = 'Adara.Moss';
				confluenceSpaceTestUtils.testUserPermissions(adarasTestSpace, creatorUserPermissionsAsList, username);
			});

			describe('anonymous user', function () {

				var anonymousPermissionsAsList = [];

				confluenceSpaceTestUtils.testAnonymousPermissions(adarasTestSpace, anonymousPermissionsAsList);
			});
		});

		it('removes a space', function () {
			adarasTestSpace.authenticate();
			adarasTestSpace.remove();
			adarasTestSpace.assertSpaceExistsNot();
		});
	});
});

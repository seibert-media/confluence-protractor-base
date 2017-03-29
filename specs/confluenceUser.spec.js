var ConfluenceUser = require('../page-objects/ConfluenceUser');
var ConfluenceGroup = require('../page-objects/ConfluenceGroup');

describe('ConfluenceUser (page object)', function () {

	var user = new ConfluenceUser('testuser_björn_müller', 'Björn Müller', 'dev0@seibert-media.net', 'pass123456');

	beforeAll(function () {
		user.authenticateAsAdmin();
	});

	it('has test user not before test', function () {
		user.actions.userProfile.open();
		expect(browser.getTitle()).toContain('Page Not Found');
	});

	describe('create()', function () {
		it('creates a user with a profile', function () {
			user.create();

			user.actions.userProfile.open();
			expect(browser.getTitle()).toContain(user.fullName);
		})
	});

	describe('created user', function () {
		it('is in search index', function () {
			user.waitUntilUserInSearchIndex();
			expect(user.isInSearchIndex()).toBe(true);
		});

		it('is in the group "confluence-users"', function () {
			expect(user.hasGroup('confluence-users')).toBe(true);
		});

		it('is NOT in the group "not-existing-group"', function () {
			expect(user.hasGroup('not-existing-group')).toBe(false);
		});
	});

	describe('remove()', function () {
		it('removes the user', function () {
			user.remove();

			user.actions.userProfile.open();
			expect(browser.getTitle()).toContain('Page Not Found');
		})
	});

	describe('group membership', function () {
		beforeAll(function () {
			user.create();
		});

		afterAll(function () {
			user.remove();
		});

		it('has NOT the group "department-technologies"', function () {
			expect(user.hasGroup("confluence-administrators")).toBe(false);
		});

		it('adds user to group "department-technologies"', function () {
			user.addGroup("confluence-administrators");

			expect(user.hasGroup("confluence-administrators")).toBe(true);
		});

		it('removes user from group "department-technologies"', function () {
			user.removeGroup("confluence-administrators");

			expect(user.hasGroup("confluence-administrators")).toBe(false);
		});
	});
});

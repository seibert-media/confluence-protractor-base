var ConfluenceUser = require('../page-objects/ConfluenceUser');
var ConfluenceGroup = require('../page-objects/ConfluenceGroup');

fdescribe('ConfluenceUser (page object)', function () {

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
		});
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

	describe('with existing user ', function () {
		beforeAll(function () {
			user.create();
		});

		afterAll(function () {
			user.remove();
			var pageObjectUtils = require('../utils/pageObjectUtils');
			pageObjectUtils.takeScreenshot("test.jpg");
		});

		describe('group membership', function () {
			var groupName = "confluence-administrators";

			it('has NOT the group "' + groupName + '"', function () {
				expect(user.hasGroup(groupName)).toBe(false);
			});

			it('adds user to group "' + groupName + '"', function () {
				user.addGroup(groupName);

				user.waitUntilUserAppearsInGroup(groupName);

				expect(user.hasGroup(groupName)).toBe(true);
			});

			it('removes user from group "' + groupName + '"', function () {
				user.removeGroup(groupName);

				user.waitUntilUserDisappearsFromGroup(groupName);

				expect(user.hasGroup(groupName)).toBe(false);
			});
		});

		describe('personal space', function () {
			beforeAll(function () {
				user.login();
			});

			it('has no personal space before test', function () {
				user.personalSpace.assertSpaceExistsNot();
			});

			it('creates a personal space', function () {
				user.createPersonalSpace();
				user.personalSpace.waitForSpaceToAppearInSpaceDirectory();
			});

			it('opens personal space', function () {
				user.viewPersonalSpace();
				expect(browser.getTitle()).toContain(user.fullName);
			});

			it('opens personal space by page id', function () {
				user.personalSpace.spaceHomeByPageId();
				expect(browser.getTitle()).toContain(user.fullName);
			});

			it('removes a personal space', function () {
				user.authenticateAsAdmin();
				user.removePersonalSpace();
				user.personalSpace.waitForSpaceToDisappearFromSpaceDirectory();
			});
		});
	});
});

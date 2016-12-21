var ConfluenceUser = require('../page-objects/ConfluenceUser');

describe('ConfluenceUser (page object)', function() {

	var user = new ConfluenceUser('user', 'Test User', 'dev0@seibert-media.net', 'user');

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

	describe('remove()', function () {
		it('removes the user', function () {
			user.remove();

			user.actions.userProfile.open();
			expect(browser.getTitle()).toContain('Page Not Found');
		})
	});
});

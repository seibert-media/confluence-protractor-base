var failFastReporter = require('../jasmineReporters/failFastReporter');
var ConfluenceUser = require('../../page-objects/ConfluenceUser');

describe('Prepare Test Setup', function () {

	var user = new ConfluenceUser('user', 'user', 'dev0@seibert-media.net', 'user');

	beforeAll(function () {
		failFastReporter.enable();
		user.authenticateAsAdmin();
	});

	afterAll(failFastReporter.disable());

	describe('create()', function () {

		it('creates a user with a profile', function () {
			user.create();
			user.actions.userProfile.open();

			expect(browser.getTitle()).toContain(user.fullName);
		});
	});

	describe('personal space', function () {

		it('creates a personal space', function () {
			user.login();
			user.createPersonalSpace();

			user.personalSpace.waitForSpaceToAppearInSpaceDirectory();
		});
	});
});

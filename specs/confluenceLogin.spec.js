
var confluenceConfig = require("../confluenceConfig");
var ConfluenceLogin = require('../page-objects/ConfluenceLogin');

describe('Confluence Login', function() {

	var confluenceLogin = new ConfluenceLogin();

	describe('with admin user', function () {
		beforeEach(function () {
			confluenceLogin.loginAsAdmin();
		});

		afterEach(function () {
			confluenceLogin.logout();
		});

		it('opens dashboard', function() {

			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it('logs in the admin users', function () {
			expect(confluenceLogin.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});
	});


	describe('with test user', function () {
		var testUser = confluenceConfig.USERS.TEST_USER;

		beforeEach(function () {
			confluenceLogin.login(testUser.USERNAME, testUser.PASSWORD);
		});

		afterEach(function () {
			confluenceLogin.logout();
		});

		it('opens dashboard', function() {
			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it('logs in the admin users', function () {
			expect(confluenceLogin.currentUsername()).toBe(testUser.USERNAME);
		});
	});

});

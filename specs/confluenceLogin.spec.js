
var confluenceConfig = require("../confluenceConfig");
var ConfluenceLogin = require('../page-objects/ConfluenceLogin');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('ConfluenceLogin (page object)', function() {

	var confluenceLogin = new ConfluenceLogin();

	describe('loginAsAdmin', function () {
		beforeEach(function () {
			confluenceLogin.loginAsAdmin();
		});

		afterEach(function () {
			confluenceLogin.logout();
		});

		it('opens the dashboard', function() {
			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it('logs in the admin users', function () {
			expect(confluenceLogin.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});
	});


	describe('login() with test user', function () {
		var testUser = confluenceConfig.USERS.TEST_USER;

		beforeEach(function () {
			confluenceLogin.login(testUser.USERNAME, testUser.PASSWORD);
		});

		afterEach(function () {
			confluenceLogin.logout();
		});

		it('logs in the test users', function () {
			expect(confluenceLogin.currentUsername()).toBe(testUser.USERNAME);
		});

		it('opens dashboard', function() {
			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it('switches the user without logout', function () {
			confluenceLogin.loginAsAdmin();
			expect(confluenceLogin.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		})
	});

	afterEach(function () {
		pageObjectUtils.takeScreenshot()
	});
});

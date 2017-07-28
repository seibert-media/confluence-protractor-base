
var confluenceConfig = require("../confluenceConfig");
var ConfluenceBase = require('../page-objects/ConfluenceBase');

describe('ConfluenceBase (page object)', function() {

	var confluenceBase = new ConfluenceBase();

	describe('openAdminPage', function () {
		it('opens admin page', function() {
			confluenceBase.openAdminPage();
			expect(browser.getTitle()).toEqual(confluenceConfig.ADMIN_TITLE);
		});

		it('logs in the admin users', function () {
			confluenceBase.openAdminPage();
			expect(confluenceBase.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});
	});

	afterEach(function () {
		pageObjectUtils.takeScreenshot()
	});
});

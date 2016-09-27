
var ConfluenceBase = require('../page-objects/ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('ConfluenceBase (page object)', function() {

	var confluenceBase = new ConfluenceBase();
	var confluenceConfig = confluenceBase.confluenceConfig();

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

});

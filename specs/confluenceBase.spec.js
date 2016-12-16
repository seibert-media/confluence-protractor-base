
var ConfluenceBase = require('../page-objects/ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('ConfluenceBase (page object)', function() {

	var confluenceBase = new ConfluenceBase();
	var confluenceConfig = confluenceBase.confluenceConfig();

	describe('openAdminPage', function () {

		afterEach(function () {
			confluenceBase.logout();
		});

		it('opens admin page', function() {
			confluenceBase.openAdminPage();
			expect(browser.getTitle()).toEqual(confluenceConfig.ADMIN_TITLE);
		});

		it('logs in the admin users', function () {
			confluenceBase.openAdminPage();
			expect(confluenceBase.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});

		it('opens a specific admin if specified', function () {
			var generalAdminAction = 'admin/viewgeneralconfig.action';
			confluenceBase.openAdminPage(generalAdminAction);
			expect(browser.getCurrentUrl()).toContain(generalAdminAction);
		})
	});

});

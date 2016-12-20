
var ConfluenceBase = require('../page-objects/ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');
var Version = require('../utils/Version');
var screenshotReporter = require('../jasmineReporters/screenshotReporter');

describe('ConfluenceBase (page object)', function() {

	var confluenceBase = new ConfluenceBase();
	var confluenceConfig = confluenceBase.confluenceConfig();
	pageObjectUtils.openPage();

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	describe('confluence version caching for sync access', function () {
		beforeEach(function () {
			spyOn(confluenceBase, 'getParamFromAJS').and.callThrough();
			confluenceBase.resetConflunceVersion();
		});

		it('has not called getParamForAJS', function () {
			expect(confluenceBase.getParamFromAJS).not.toHaveBeenCalled();
		});

		it('throws in error if confluenceVersionSync() is called without caching', function () {
			expect(function () {
				confluenceBase.confluenceVersion();
			}).toThrow(new Error('No confluenceVersion is loaded. Use loadConfluenceVersion in a setup function (onPrepare)'));
		});

		it('calls getParamForAJS when loading confluence version', function () {
			expect(confluenceBase.loadConfluenceVersion()).toBeDefined();
			expect(confluenceBase.getParamFromAJS).toHaveBeenCalledWith('versionNumber');
		});

		it('caches the value after async method is resolved', function (done) {
			confluenceBase.loadConfluenceVersion().then(function (confluenceVersionAsyncResult) {
				var confluenceVersion = confluenceBase.confluenceVersion();
				expect(confluenceVersion).toBeDefined();
				expect(confluenceVersion).toEqual(confluenceVersionAsyncResult);
				done();
			}).catch(function (error) {
				done.fail(error);
			});
		});
	});

	it('has confluence version', function () {
		expect(confluenceBase.confluenceVersion()).toBeDefined();

		if (process.env.CONFLUENCE_VERSION) {
			expect(confluenceBase.confluenceVersion()).toEqual(Version.parse(process.env.CONFLUENCE_VERSION));
		} else {
			console.log('No environment variable CONFLUENCE_VERSION set')
		}
	});

	describe('openAdminPage', function () {
		beforeEach(screenshotReporter.enable)

		afterAll(function () {
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
		});

	});

});

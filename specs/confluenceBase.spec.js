
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
		});

		it('has not called getParamForAJS', function () {
			expect(confluenceBase.getParamFromAJS).not.toHaveBeenCalled();
		});

		it('throws in error if confluenceVersionSync() is called without caching', function () {
			expect(function () {
				confluenceBase.confluenceVersionSync();
			}).toThrow(new Error('Param confluenceVersion not yet set. Can only be called after a async call caches the value.'))
		});

		it('calls getParamForAJS when loading confluence version', function () {
			expect(confluenceBase.confluenceVersion()).toBeDefined();
			expect(confluenceBase.getParamFromAJS).toHaveBeenCalledWith('versionNumber');
		});

		it('caches the value after async method is resolved', function (done) {
			confluenceBase.confluenceVersion().then(function (confluenceVersionAsyncResult) {
				var confluenceVersion = confluenceBase.confluenceVersionSync();
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

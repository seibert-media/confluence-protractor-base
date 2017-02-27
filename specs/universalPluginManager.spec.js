var UniversalPluginManager = require('../page-objects/UniversalPluginManager');

describe('UniversalPluginManager (page object)', function() {

	function createTestPluginPath(path) {
		return require('path').resolve(process.cwd(), __dirname + '/../test-data/' + path);
	}

	var universalPluginManager = new UniversalPluginManager();

	var testPluginPath = createTestPluginPath('tutorial-confluence-macro-demo-1.0.0-SNAPSHOT.jar');
	var brokenPluginPath = createTestPluginPath('broken-plugin.jar');

	var pluginName = 'tutorial-confluence-macro-demo';

	var PLUGIN_UPLOAD_TIMEOUT = 3 * 60 * 1000;

	beforeAll(function () {
		universalPluginManager.authenticateAsAdmin();
	});

	describe('uploadPlugin()', function () {

		it('installs the plugin', function () {
			universalPluginManager.uploadPlugin(pluginName, testPluginPath, PLUGIN_UPLOAD_TIMEOUT);

			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	describe('uninstallPlugin()', function() {
		it('uninstalls this plugin', function () {
			universalPluginManager.uninstallPlugin(pluginName);
			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(false);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	describe('uploadPlugin() error handling', function () {

		var TIMEOUT_RETRY_FACTOR = 2;

		beforeEach(function () {
			universalPluginManager.uninstallPlugin(pluginName);
		});

		function fakeUploadPluginInput() {
			var originalSendKeys = protractor.WebElement.prototype.sendKeys;

			spyOn(protractor.WebElement.prototype, 'sendKeys').and.callFake(function (path) {
				if (path === testPluginPath) {
					originalSendKeys.call(this, brokenPluginPath);
					// reset spy
					protractor.WebElement.prototype.sendKeys = originalSendKeys;
				} else {
					originalSendKeys.apply(this, arguments);
				}
			});
		}

		it('retries plugin install on fail', function () {
			fakeUploadPluginInput();
			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', testPluginPath, PLUGIN_UPLOAD_TIMEOUT);

			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

		it('does not retry the installation if maxAttempts set to 1', function () {
			var maxAttempts = 1;
			fakeUploadPluginInput();

			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', testPluginPath, PLUGIN_UPLOAD_TIMEOUT, maxAttempts);

			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(false);

		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

	});


});

var UniversalPluginManager = require('../page-objects/UniversalPluginManager');

describe('UniversalPluginManager (page object)', function() {

	var universalPluginManager = new UniversalPluginManager();

	var relativePluginPath = '/../test-data/tutorial-confluence-macro-demo-1.0.0-SNAPSHOT.jar';
	var testPluginPath = __dirname + relativePluginPath;
	var expectedPath = require('path').resolve(process.cwd(), testPluginPath);

	var pluginKey = 'com.example.plugins.tutorial.confluence.tutorial-confluence-macro-demo'
	var PLUGIN_UPLOAD_TIMEOUT = 3 * 60 * 1000;

	beforeAll(function () {
		universalPluginManager.authenticateAsAdmin();
	});

	describe('uploadPlugin()', function () {

		it('installs the plugin', function () {
			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', testPluginPath, PLUGIN_UPLOAD_TIMEOUT);

			expect(universalPluginManager.pluginInstalled(pluginKey)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	describe('uninstallPlugin()', function() {
		it('uninstalls this plugin', function () {
			universalPluginManager.uninstallPlugin(pluginKey);
			expect(universalPluginManager.pluginInstalled(pluginKey)).toBe(false);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	describe('uploadPlugin() error handling', function () {

		var TIMEOUT_RETRY_FACTOR = 2;

		beforeEach(function () {
			universalPluginManager.uninstallPlugin(pluginKey);
		});

		function fakeUploadPluginInput() {
			var originalSendKeys = protractor.WebElement.prototype.sendKeys;
			var failingPath = __dirname + '/failing-plugin-path.xyz';

			spyOn(protractor.WebElement.prototype, 'sendKeys').and.callFake(function (path) {
				if (path === expectedPath) {
					originalSendKeys.call(this, failingPath);
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

			expect(universalPluginManager.pluginInstalled(pluginKey)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

		it('does not retry the installation if maxAttempts set to 1', function () {
			var maxAttempts = 1;
			fakeUploadPluginInput();

			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', testPluginPath, PLUGIN_UPLOAD_TIMEOUT, maxAttempts);

			expect(universalPluginManager.pluginInstalled(pluginKey)).toBe(false);

		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

	});


});

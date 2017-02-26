var UniversalPluginManager = require('../page-objects/UniversalPluginManager');

describe('UniversalPluginManager (page object)', function() {

	var universalPluginManager = new UniversalPluginManager();

	var relativePluginPath = '/../test-data/tutorial-confluence-macro-demo-1.0.0-SNAPSHOT.jar';
	var testPluginPath = __dirname + relativePluginPath;

	describe('uploadPlugin()', function () {

		var PLUGIN_UPLOAD_TIMEOUT = 3 * 60 * 1000;

		it('installs the plugin', function () {
			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', testPluginPath, PLUGIN_UPLOAD_TIMEOUT);
		}, PLUGIN_UPLOAD_TIMEOUT);

	});

});

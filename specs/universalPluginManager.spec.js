var UniversalPluginManager = require('../page-objects/UniversalPluginManager');

fdescribe('UniversalPluginManager (page object)', function() {

	var universalPluginManager = new UniversalPluginManager();

	describe('uploadPlugin()', function () {

		var PLUGIN_UPLOAD_TIMEOUT = 120000;

		it('installs the plugin', function () {
			universalPluginManager.uploadPlugin('tutorial-confluence-macro-demo', './test-data/tutorial-confluence-macro-demo-1.0.0-SNAPSHOT.jar', PLUGIN_UPLOAD_TIMEOUT);
		}, PLUGIN_UPLOAD_TIMEOUT);

	});

});

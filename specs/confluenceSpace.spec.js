var ConfluenceSpace = require('../page-objects/ConfluenceSpace');

describe('ConfluenceSpace (page object)', function() {

	var demonstrationSpace = new ConfluenceSpace('ds', 'Demonstration Space');
	beforeAll(function () {
		demonstrationSpace.authenticateAsAdmin();
	});

	describe('assertSpaceExists', function () {
		var notExistingSpace = new ConfluenceSpace('NOT_EXISTING_SPACE_KEY', 'Not existing space');

		it('detects existing space', function () {
			demonstrationSpace.assertSpaceExists();
		});

		it('detects existing space', function () {
			notExistingSpace.assertSpaceExistsNot();
		});
	});

	describe('create() and remove()', function () {
		var pageObjectTestSpace = new ConfluenceSpace('UIT', 'Test space for UI-Test');

		it('creates a space', function () {
			pageObjectTestSpace.create();
			pageObjectTestSpace.assertSpaceExists();
		});

		it('removes a space', function () {
			pageObjectTestSpace.remove();
			pageObjectTestSpace.assertSpaceExistsNot();
		});
	});
});

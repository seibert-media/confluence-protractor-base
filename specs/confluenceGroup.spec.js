var ConfluenceGroup = require('../page-objects/ConfluenceGroup');

describe('ConfluenceGroup (page object)', function() {

	var group = new ConfluenceGroup("department-legals");

	beforeAll(function () {
		group.authenticateAsAdmin();
	});

	it('group does NOT exist before test', function () {
		expect(group.exists()).toBe(false);
	});

	it('creates and lists group', function () {
		group.create();

		expect(group.exists()).toBe(true);
	});

	it('removes group', function () {
		group.remove();

		expect(group.exists()).toBe(false);
	});
});

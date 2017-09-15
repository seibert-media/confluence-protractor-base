import {ConfluenceGroup} from "../page-objects/ConfluenceGroup";

describe("ConfluenceGroup (page object)", () => {

	const group = new ConfluenceGroup("department-legals");

	beforeAll(() => {
		group.authenticateAsAdmin();
	});

	it("group does NOT exist before test", () => {
		expect(group.exists()).toBe(false);
	});

	it("creates and lists group", () => {
		group.create();

		expect(group.exists()).toBe(true);
	});

	it("removes group", () => {
		group.remove();

		expect(group.exists()).toBe(false);
	});
});

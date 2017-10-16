import {browser} from "protractor";
import {ConfluenceUser} from "../page-objects/ConfluenceUser";

describe("ConfluenceUser (page object)", () => {

	const user = new ConfluenceUser("testuser_björn_müller", "Björn Müller", "bmueller@example.com", "pass123456");

	beforeAll(() => {
		user.loginAsAdmin();
	});

	it("has test user not before test", () => {
		user.userActions.userProfile.open();
		expect(browser.getTitle()).toContain("Page Not Found");
	});

	describe("create()", () => {
		it("creates a user with a profile", () => {
			user.create();

			user.userActions.userProfile.open();
			expect(browser.getTitle()).toContain(user.fullName);
		});
	});

	describe("created user", () => {
		it("is in search index", () => {
			user.waitUntilUserInSearchIndex();
			expect(user.isInSearchIndex()).toBe(true);
		});

		it('is in the group "confluence-users"', () => {
			expect(user.hasGroup("confluence-users")).toBe(true);
		});

		it('is NOT in the group "not-existing-group"', () => {
			expect(user.hasGroup("not-existing-group")).toBe(false);
		});
	});

	describe("remove()", () => {
		it("removes the user", () => {
			user.remove();

			user.userActions.userProfile.open();
			expect(browser.getTitle()).toContain("Page Not Found");
		});
	});

	describe("with existing user ", () => {
		beforeAll(() => {
			user.create();
		});

		afterAll(() => {
			// TODO fails in 6.1 as user-login creates a mysteric daft, which makes the user un-deletable
			// user.remove();
		});

		describe("group membership", () => {
			const groupName = "confluence-administrators";

			it('has NOT the group "' + groupName + '"', () => {
				expect(user.hasGroup(groupName)).toBe(false);
			});

			it('adds user to group "' + groupName + '"', () => {
				user.addGroup(groupName);
				user.waitUntilUserAppearsInGroup(groupName);

				expect(user.hasGroup(groupName)).toBe(true);
			});

			it('removes user from group "' + groupName + '"', () => {
				user.removeGroup(groupName);
				user.waitUntilUserDisappearsFromGroup(groupName);

				expect(user.hasGroup(groupName)).toBe(false);
			});
		});

		describe("personal space", () => {
			beforeAll(() => {
				user.login();
			});

			it("has no personal space before test", () => {
				user.personalSpace.assertSpaceExistsNot();
			});

			it("creates a personal space", () => {
				user.createPersonalSpace();
				user.personalSpace.waitForSpaceToAppearInSpaceDirectory();
			});

			it("opens personal space", () => {
				user.viewPersonalSpace();
				expect(browser.getTitle()).toContain(user.fullName);
			});

			it("opens personal space by page id", () => {
				user.personalSpace.spaceHomeByPageId();
				expect(browser.getTitle()).toContain(user.fullName);
			});

			it("removes a personal space", () => {
				user.loginAsAdmin();
				user.removePersonalSpace();
				user.personalSpace.waitForSpaceToDisappearFromSpaceDirectory();
			});
		});
	});
});

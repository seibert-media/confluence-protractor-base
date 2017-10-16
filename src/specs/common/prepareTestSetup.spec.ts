import {browser} from "protractor";
import {failFastReporter} from "../../jasmineReporters/failFastReporter";
import {ConfluenceUser} from "../../page-objects/ConfluenceUser";
import {ConfluenceSecurityConfig} from "../../page-objects/ConfluenceSecurityConfig";

describe("Prepare Test Setup", () => {

	const user = new ConfluenceUser("user", "user", "user@example.com", "user");

	beforeAll(() => {
		failFastReporter.enable();
		user.authenticateAsAdmin();
		const confluenceSecurityConfig = new ConfluenceSecurityConfig();
		confluenceSecurityConfig.disableWebSudo();
	});

	afterAll(failFastReporter.disable);

	describe("create()", () => {

		it("creates a user with a profile", () => {
			user.create();
			user.userActions.userProfile.open();

			expect(browser.getTitle()).toContain(user.fullName);
		});
	});

	describe("personal space", () => {

		beforeAll(() => {
			user.login();
		});

		it("creates a personal space", () => {
			user.createPersonalSpace();

			user.personalSpace.waitForSpaceToAppearInSpaceDirectory();
		});
	});
});

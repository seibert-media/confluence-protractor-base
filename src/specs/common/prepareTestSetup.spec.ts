import {browser} from "protractor";
import {failFastReporter} from "../../jasmineReporters/failFastReporter";
import {ConfluenceSecurityConfig} from "../../page-objects/ConfluenceSecurityConfig";
import {ConfluenceUser} from "../../page-objects/ConfluenceUser";

describe("Prepare Test Setup", () => {

	const user = new ConfluenceUser("user", "user", "user@example.com", "user");

	beforeAll(() => {
		failFastReporter.enable();
		user.authenticateAsAdmin();
	});

	afterAll(failFastReporter.disable);

	describe("disableWebSudo()", () => {

		it("disables websudo", () => {
			const confluenceSecurityConfig = new ConfluenceSecurityConfig();
			confluenceSecurityConfig.disableWebSudo();

			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(false);
		});
	});

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

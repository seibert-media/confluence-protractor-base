import {ConfluenceSecurityConfig} from "../page-objects/ConfluenceSecurityConfig";

describe("ConfluenceSecurityConfig (page object)", () => {

	const confluenceSecurityConfig = new ConfluenceSecurityConfig();

	beforeAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();
		confluenceSecurityConfig.enableWebSudo();
		confluenceSecurityConfig.authenticateAsAdmin();
	});

	afterAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();
		confluenceSecurityConfig.disableWebSudo();
	});

	describe("disableWebSudo()", () => {
		it("disables the web sudo configuration", () => {
			confluenceSecurityConfig.disableWebSudo();

			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(false);
		});
	});

	describe("enableWebSudo()", () => {
		it("enable the web sudo configuration", () => {
			confluenceSecurityConfig.enableWebSudo();
			confluenceSecurityConfig.authenticateAsAdmin();

			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(true);
		});
	});

});

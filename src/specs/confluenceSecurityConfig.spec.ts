import {ConfluenceSecurityConfig} from "../page-objects/ConfluenceSecurityConfig";

xdescribe("ConfluenceSecurityConfig (page object)", () => {

	const confluenceSecurityConfig = new ConfluenceSecurityConfig();

	beforeAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();

		confluenceSecurityConfig.enableWebSudo();
	});

	afterAll(() => {
		confluenceSecurityConfig.disableWebSudo();
	});

	describe("disableWebSudo()", () => {
		it("disables the web sudo configuration", () => {
			confluenceSecurityConfig.disableWebSudo();
		});

		it("is disabled", () => {
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(false);
		});
	});

	describe("enableWebSudo()", () => {
		it("enable the web sudo configuration", () => {
			confluenceSecurityConfig.enableWebSudo();
			confluenceSecurityConfig.authenticateAsAdmin();
		});

		it("is enabled", () => {
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(true);
		});
	});

});

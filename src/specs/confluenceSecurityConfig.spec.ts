import {ConfluenceSecurityConfig} from "../page-objects/ConfluenceSecurityConfig";

describe("ConfluenceSecurityConfig (page object)", () => {

	const confluenceSecurityConfig = new ConfluenceSecurityConfig();

	beforeAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();
		confluenceSecurityConfig.disableWebSudo();
	});

	afterAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();
		confluenceSecurityConfig.disableWebSudo();
	});

	describe("disableWebSudo()", () => {
		fit("disables the web sudo configuration", () => {
			confluenceSecurityConfig.disableWebSudo();
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(false);
		});
	});

	describe("enableWebSudo()", () => {
		fit("enable the web sudo configuration", () => {
			confluenceSecurityConfig.enableWebSudo();
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(true);
		});
	});

});

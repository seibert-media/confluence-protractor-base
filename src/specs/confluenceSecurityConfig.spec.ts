import {ConfluenceSecurityConfig} from "../page-objects/ConfluenceSecurityConfig";

describe("ConfluenceSecurityConfig (page object)", () => {

	const confluenceSecurityConfig = new ConfluenceSecurityConfig();

	let savedWebSudoState: boolean;

	beforeAll(() => {
		confluenceSecurityConfig.authenticateAsAdmin();

		confluenceSecurityConfig.isWebSudoEnabled().then((isWebSudoEnabled) => {
			savedWebSudoState = isWebSudoEnabled;

			// enable before test
			confluenceSecurityConfig.disableWebSudo();
		})
	});

	afterAll(() => {
		// reset web sudo
		confluenceSecurityConfig.isWebSudoEnabled().then((isWebSudoEnabled) => {
			if (savedWebSudoState === isWebSudoEnabled) {
				return;
			}

			if (savedWebSudoState) {
				confluenceSecurityConfig.enableWebSudo();
			} else {
				confluenceSecurityConfig.disableWebSudo();
			}
		});
	});

	describe("disableWebSudo()", () => {
		fit("disables the web sudo configuration", () => {
			confluenceSecurityConfig.disableWebSudo()
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(false);
		})
	});

	describe("enableWebSudo()", () => {
		fit("enable the web sudo configuration", () => {
			confluenceSecurityConfig.enableWebSudo()
			expect(confluenceSecurityConfig.isWebSudoEnabled()).toBe(true);
		})
	});

});

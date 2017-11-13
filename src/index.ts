export {
	ConfluenceBase,
	ConfluenceLogin,
	ConfluenceEditor,
	ConfluenceUser,
	ConfluenceSpace,
	ConfluenceAction,
	UniversalPluginManager,
	ConfluenceGroup,
	ConfluencePage,
	pageObjectUtils,
	confluenceSpaceTestUtils,
	Version,
	RadioOption,
	CheckboxOption,
	AutocompleteSearch,
	failFastReporter,
	screenshotReporter,
	loadConfluenceConfig,
	protractorConfig,
};

import {failFastReporter} from "./jasmineReporters/failFastReporter";
import {screenshotReporter} from "./jasmineReporters/screenshotReporter";
import {loadConfluenceConfig} from "./loadConfluenceConfig";
import {ConfluenceAction} from "./page-objects/ConfluenceAction";
import {ConfluenceBase} from "./page-objects/ConfluenceBase";
import {ConfluenceEditor} from "./page-objects/ConfluenceEditor";
import {ConfluenceGroup} from "./page-objects/ConfluenceGroup";
import {ConfluenceLogin} from "./page-objects/ConfluenceLogin";
import {ConfluencePage} from "./page-objects/ConfluencePage";
import {ConfluenceSpace} from "./page-objects/ConfluenceSpace";
import {ConfluenceUser} from "./page-objects/ConfluenceUser";
import {UniversalPluginManager} from "./page-objects/UniversalPluginManager";
import {protractorConfig} from "./protractorConfig";
import {confluenceSpaceTestUtils} from "./utils/confluenceSpaceTestUtils";
import {AutocompleteSearch} from "./utils/elements/AutocompleteSearch";
import {CheckboxOption} from "./utils/elements/CheckboxOption";
import {RadioOption} from "./utils/elements/RadioOption";
import {pageObjectUtils} from "./utils/pageObjectUtils";
import {Version} from "./utils/Version";

export const confluenceProtractorBase = {
	loadConfluenceConfig: require("./loadConfluenceConfig"),
	protractorConfig: require("./protractorConfig"),
	pageObjects: {
		ConfluenceLogin: require("./page-objects/ConfluenceLogin").ConfluenceLogin,
		ConfluenceBase: require("./page-objects/ConfluenceBase").ConfluenceBase,
		ConfluenceSpace: require("./page-objects/ConfluenceSpace").ConfluenceSpace,
		ConfluencePage: require("./page-objects/ConfluencePage").ConfluencePage,
		ConfluenceAction: require("./page-objects/ConfluenceAction").ConfluenceAction,
		ConfluenceGroup: require("./page-objects/ConfluenceGroup").ConfluenceGroup,
		ConfluenceUser: require("./page-objects/ConfluenceUser").ConfluenceUser,
		ConfluenceEditor: require("./page-objects/ConfluenceEditor").ConfluenceEditor,
		ConfluenceMacro: require("./page-objects/ConfluenceMacro").ConfluenceMacro,
		ConfluenceSecurityConfig: require("./page-objects/ConfluenceSecurityConfig").ConfluenceSecurityConfig,
		UniversalPluginManager: require("./page-objects/UniversalPluginManager").UniversalPluginManager,
	},
	utils: {
		pageObjectUtils: require("./utils/pageObjectUtils").pageObjectUtils,
		confluenceSpaceTestUtils: require("./utils/confluenceSpaceTestUtils").confluenceSpaceTestUtils,
		Version: require("./utils/Version").Version,
		elements: {
			RadioOption: require("./utils/elements/RadioOption").RadioOption,
			CheckboxOption: require("./utils/elements/CheckboxOption").CheckboxOption,
			AutocompleteSearch: require("./utils/elements/AutocompleteSearch").AutocompleteSearch,
		},
	},
	jasmineReporters: {
		failFastReporter: require("./jasmineReporters/failFastReporter").failFastReporter,
		screenshotReporter: require("./jasmineReporters/screenshotReporter").screenshotReporter,
	},
};

export default confluenceProtractorBase;

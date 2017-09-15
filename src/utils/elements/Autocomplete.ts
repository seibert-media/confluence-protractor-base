export interface AutocompleteOptions {
	inputElement: any;
	searchTerm: string;
	resultContainer: any;
	// optionals
	resultElement?: any;
	noResultText?: string;
}

export interface AutocompleteSearchOptions {
	searchPrefix?: string;
	skipClear?: boolean;
}

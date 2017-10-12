export interface CustomLocation {
	href?: string;
	protocol?: string;
	host?: string;
	hostname?: string;
	port?: string;
	pathname?: string;
	search?: string;
	hash?: string;
	// non-standard
	path?: string;
	pathWithSearch?: string;
	pathWithSearchAndHash?: string;
}

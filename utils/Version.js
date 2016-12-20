function Version(version, major, minor, patch) {
	this.version = version;
	this.major = major;
	this.minor = minor;
	this.patch = patch;
}

Version.prototype.toString = function () {
	return this.version;
}

function checkNumberStringAndDefault(versionPart) {
	if (!versionPart) {
		return undefined;
	}
	if (!/^\d+$/.test(versionPart)) {
		throw new Error('Version must only contain numbers, bus found: ' + versionPart);
	}
	return parseInt(versionPart, 10);
}

Version.compare = function (versionA, versionB) {
	var majorCompare = versionA.major - versionB.major;
	var minorCompare = versionA.minor - versionB.minor;
	var patchCompare = versionA.patch - versionB.patch;

	if (majorCompare !== 0 || isNaN(minorCompare)) {
		return majorCompare;
	}

	if (minorCompare !== 0 || isNaN(patchCompare)) {
		return minorCompare;
	}

	return patchCompare;
};


Version.parse = function (version) {
	if (version instanceof Version) {
		return new Version(version.version, version.major, version.minor, version.patch);
	}
	var versionSplit = version.split('.');
	var major = checkNumberStringAndDefault(versionSplit[0]);
	var minor = checkNumberStringAndDefault(versionSplit[1]);
	var patch = checkNumberStringAndDefault(versionSplit[2]);

	return new Version(version, major, minor, patch);
};

module.exports = Version;

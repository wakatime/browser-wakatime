/**
 * Returns domain from given URL.
 *
 * @param url
 * @returns {string}
 */
function getDomainFromUrl(url) {
	return new URL(url).origin;
}

module.exports = getDomainFromUrl;
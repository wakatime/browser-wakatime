/**
 * Returns domain from given URL.
 *
 * @param url
 * @returns {string}
 */
function getDomainFromUrl(url) {
    var parts = url.split('/');

    return parts[0] + "//" + parts[2];
}

module.exports = getDomainFromUrl;
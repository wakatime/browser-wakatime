/**
 * Creates an array from list using \n as delimiter
 * and checks if the str is located in the list.
 *
 * @param str
 * @param list
 * @returns {boolean}
 */
function contains(str, list) {
    var lines = list.split('\n');

    for (var i = 0; i < lines.length; i ++) {

        // Trim all lines from the list one by one
        var cleanLine = lines[i].trim();

        // If by any chance one line in the list is empty, ignore it
        if(cleanLine === '') continue;

        // If current line contains the str return true
        if (cleanLine.indexOf(str) > -1) {
            return true;
        }
    }

    return false;
}

module.exports = contains;

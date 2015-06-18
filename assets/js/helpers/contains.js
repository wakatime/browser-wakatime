/**
 * Creates an array from list using \n as delimiter
 * and checks if the line is located in the list.
 *
 * @param line
 * @param list
 * @returns {boolean}
 */
function contains(line, list) {
    var lines = list.split('\n');

    for (var i = 0; i < lines.length; i ++) {
        if (line.indexOf(lines[i]) > - 1) {
            return true;
        }
    }

    return false;
}

module.exports = contains;
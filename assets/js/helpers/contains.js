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

    for(var i in lines) {
        // Use regex to remove all whitespace
        var cleanLine = lines[i].replace(/\s/g, '');
        if(cleanLine.length === 0) continue;
        if (line.indexOf(cleanLine) >= 0) return true;
    }

    return false;
}

module.exports = contains;
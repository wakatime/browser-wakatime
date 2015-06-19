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

        // Trim all lines from the list one by one
        var cleanLine = lines[i].trim();

        // If by any chance one line in the list is empty, ignore it
        if(cleanLine === '') continue;

        // If line contains the clean line return true
        if (line.indexOf(cleanLine) > - 1) {
            return true;
        }
    }

    return false;
}

module.exports = contains;
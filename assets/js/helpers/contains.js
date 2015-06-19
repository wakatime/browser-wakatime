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

        // If by any chance one line in the list is empty or contains a blank space, ignore it
        // It would probably be better to use regex here to detect blank space, but since
        // this is not likely to be triggered anyway, there is no need for that yet.
        if(lines[i] === '' || lines[i] === ' ') continue;

        if (line.indexOf(lines[i]) > - 1) {
            return true;
        }
    }

    return false;
}

module.exports = contains;
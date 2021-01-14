/**
 * Creates an array from list using \n as delimiter
 * and checks if any element in list is contained in the url.
 *
 * @param url
 * @param list
 * @returns {boolean}
 */
function contains(url, list) {
  var lines = list.split('\n');

  for (var i = 0; i < lines.length; i++) {
    // Trim all lines from the list one by one
    var cleanLine = lines[i].trim();

    // If by any chance one line in the list is empty, ignore it
    if (cleanLine === '') continue;

    var lineRe = new RegExp(cleanLine.replace('.', '.').replace('*', '.*'));

    // If url matches the current line return true
    if (lineRe.test(url)) {
      return true;
    }
  }

  return false;
}

module.exports = contains;

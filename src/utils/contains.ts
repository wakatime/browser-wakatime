/**
 * Creates an array from list using \n as delimiter
 * and checks if any element in list is contained in the url.
 */
export default function contains(url: string, list: string): boolean {
  const lines = list.split('\n');

  for (let i = 0; i < lines.length; i++) {
    // Trim all lines from the list one by one
    const cleanLine = lines[i].trim();

    // If by any chance one line in the list is empty, ignore it
    if (cleanLine === '') continue;

    const lineRe = new RegExp(cleanLine.replace('.', '.').replace('*', '.*'));

    // If url matches the current line return true
    if (lineRe.test(url)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns boolean if needle is found in haystack or not.
 */
export default function inArray<T>(needle: T, haystack: T[]): boolean {
  for (let i = 0; i < haystack.length; i++) {
    if (needle == haystack[i]) {
      return true;
    }
  }

  return false;
}

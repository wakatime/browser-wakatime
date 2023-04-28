/**
 * Returns domain from given URL.
 */
export default function getDomainFromUrl(url: string): string {
  const parts = url.split('/');

  return parts[0] + '//' + parts[2];
}

/**
 * Returns domain from given URL.
 */
export function getDomainFromUrlWithoutProtocol(url: string): string {
  const parts = url.split('/');

  return parts[2];
}

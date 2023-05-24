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
export function getDomain(url: string): string {
  const splittedUrl = url.replace(/(https?:\/\/)?(www.)?/i, '').split('.');
  const domain = splittedUrl.slice(splittedUrl.length - 2).join('.');
  if (domain.includes('/')) {
    return domain.split('/')[0];
  }

  return domain;
}

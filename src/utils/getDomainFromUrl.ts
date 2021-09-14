/**
 * Returns domain from given URL.
 */
export default function getDomainFromUrl(url: string): string {
    const parts = url.split('/');

    return parts[0] + '//' + parts[2];
}

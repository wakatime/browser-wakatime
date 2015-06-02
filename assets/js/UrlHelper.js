class UrlHelper {

    static getDomainFromUrl(url)
    {
        var parts = url.split('/');

        return parts[0] + "//" + parts[2];
    }

}

export default UrlHelper;

var config = {
    // Extension name
    name: 'WakaTime',
    // Time for idle state of the browser
    // The user is considered idle if there was
    // no activity in the browser for x seconds
    detectionIntervalInSeconds: 60,
    //default logging type
    loggingType: 'domain',
    // By default logging is enabled
    loggingEnabled: true,
    // Url to which to send the heartbeat
    heartbeatApiUrl: 'https://wakatime.com/api/v1/users/current/heartbeats',
    // Url from which to detect if the user is logged in
    currentUserApiUrl: 'https://wakatime.com/api/v1/users/current',
    // The url to logout the user from wakatime
    logoutUserUrl: 'https://wakatime.com/logout',
    // Different colors for different states of the extension
    colors: {
        allGood: '',
        notLogging: 'gray',
        notSignedIn: 'red',
        lightTheme: 'white'
    },
    // Tooltips for each of the extension states
    tooltips: {
        allGood: '',
        notLogging: 'Not logging',
        notSignedIn: 'Not signed In'
    },
    // Default theme
    theme: 'light',
    // Valid extension states
    states: [
        'allGood',
        'notLogging',
        'notSignedIn',
        'blacklisted',
        'whitelisted'
    ]
};

export default config;
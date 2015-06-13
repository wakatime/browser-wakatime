/**
 * Returns UNIX timestamp
 *
 * @returns {number}
 */
function currentTimestamp(){
    return Math.round((new Date()).getTime() / 1000);
}

export default currentTimestamp;

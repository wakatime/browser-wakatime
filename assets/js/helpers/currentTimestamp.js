/**
 * Returns UNIX timestamp
 */
export default function(){
    return Math.round((new Date()).getTime() / 1000);
}

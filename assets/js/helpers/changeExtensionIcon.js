/**
 * It changes the extension icon color.
 * Supported values are: 'red', 'white' and ''.
 *
 * @param  string color = ''
 * @return null
 */
export default function changeExtensionIcon(color = '') {

    var canvas = document.getElementById('icon');
    var context = canvas.getContext('2d');

    var x = 0;
    var y = 0;
    var width = 19;
    var height = 19;
    var imageObj = new Image();

    imageObj.onload = function() {
      context.drawImage(imageObj, x, y, width, height);

      var imageData = context.getImageData(x, y, width, height);

      chrome.browserAction.setIcon({
          imageData: imageData
      });
    };

    if(color !== ''){
        color = '-' + color;
    }

    imageObj.src = 'graphics/wakatime-logo-48' + color + '.png';
}

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

// Saves options to chrome.storage.sync.
function save_options(e) {
  e.preventDefault();

  var theme = document.getElementById('theme').value;
  var blacklist = document.getElementById('blacklist').value;

  chrome.storage.sync.set({
    theme: theme,
    blacklist: blacklist
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.style.display = 'block';
    status.innerHTML = '<strong>Well done!</strong> Options have been saved.';

    //TODO: This is a nice place for fade in and fade out...
    
    setTimeout(function() {
      status.textContent = '';
      status.style.display = 'none';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    theme: 'light',
    blacklist: ''
  }, function(items) {
    document.getElementById('theme').value = items.theme;
    document.getElementById('blacklist').value = items.blacklist;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

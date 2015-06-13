/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var config = require('./config');

import $ from "jquery";

function detectCheckedRadio(name) {
    for (var i = 0; i < document.getElementsByName(name).length; i ++) {
        var button = document.getElementsByName(name)[i];

        if (button.checked === true) {
            return button.value;
        }
    }
}

// Saves options to chrome.storage.sync.
function save_options(e) {
    e.preventDefault();

    var theme = document.getElementById('theme').value;
    var blacklist = document.getElementById('blacklist').value;
    var loggingType = detectCheckedRadio('loggingType');

    chrome.storage.sync.set({
        theme: theme,
        blacklist: blacklist,
        loggingType: loggingType
    }, function () {
        // Update status to let user know options were saved.
        var status = $('#status');
        status.html('<strong>Well done!</strong> Options have been saved.');

        status.fadeIn(1500, function () {
            setTimeout(function () {
                status.fadeOut(1500, function () {
                    status.html('');
                });
            }, 750);
        });

    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        theme: config.theme,
        blacklist: '',
        loggingType: config.loggingType
    }, function (items) {
        document.getElementById('theme').value = items.theme;
        document.getElementById('blacklist').value = items.blacklist;
        document.getElementById(items.loggingType + 'Type').checked = true;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

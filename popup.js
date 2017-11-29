// Copyright (c) 2014 The Chromium Authors. All rights reserved.

function getCurrentTab(callback) {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    callback(tab);
  });
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}
/*
function getInfoFromDom(domcontent) {
    var JobTitle = document.getElementsByClassName('jobtitle')[0].value;

    var para = document.createElement("p");
    //var text = items.toSource();
    var node = document.createTextNode(JobTitle);
    //var node = document.createTextNode(userID);
    para.appendChild(node);
    //alert(userID);
    document.getElementsByTagName('body')[0].appendChild(para);
}*/

function submitJobInformation() {
    getCurrentTab(function(tab) {
        var url = tab.url;
        console.assert(typeof url === 'string', 'tab.url should be a string');

        var indeedUrlRegex = /^https?:\/\/(?:[^./?#]+\.)?indeed\.com/;
        var userID = window.sessionStorage.getItem('userID');
        // noinspection ConstantIfStatementJS
        if (true) {//(indeedUrlRegex.test(url)) {
            // ...if it matches, send a message specifying a callback too
            chrome.tabs.executeScript(null, {file: "content.js"});
            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, function(domContent) {
                console.log('I received the following DOM content:\n' + domContent.location);
                var para = document.createElement("p");
                var node = document.createTextNode(domContent.location + ' ' + domContent.title + ' ' + domContent.company + ' ' + domContent.description);
                para.appendChild(node);
                //alert(userID);
                document.getElementsByTagName('body')[0].appendChild(para);
            });
        }

    });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
    var items = {};
    items[url] = color;

    chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {
    /*getCurrentTabUrl((url) => {
        var dropdown = document.getElementById('dropdown');

        // Ensure the background color is changed and saved when the dropdown
        // selection changes.
        dropdown.addEventListener('change', () => {
          changeBackgroundColor(dropdown.value);
          saveBackgroundColor(url, dropdown.value);
        });
    });*/
    var btnSignIn = document.getElementById('btnSignIn');
    var btnSubmit = document.getElementById('btnSubmit');
    btnSignIn.addEventListener('click', function() {location.href = "signIn.html"});
    btnSubmit.addEventListener('click', submitJobInformation);
});

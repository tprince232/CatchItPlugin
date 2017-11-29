
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

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        console.log(xhr.responseText);

                    }
                    return false;
                };

                /*var para = document.createElement("p");
                var node = document.createTextNode();
                para.appendChild(node);
                document.getElementsByTagName('body')[0].appendChild(para);*/
                var userID = window.sessionStorage.getItem("userID");

                var postURL = "https://dsg1.crc.nd.edu/cse30246/catchit/api/jobposting.php";
                var params = "&id=" + userID + "&company=" + domContent.company + "&location=" +
                    domContent.location + "&jobtitle=" + domContent.title + "&deadline=" + "" + "&source=indeed.com" +
                    "&details="  + domContent.description + "&url=" + url;
                postURL = postURL + '?' + params;
                console.log(postURL);
                xhr.open("GET", postURL, true);
                xhr.send();
            });
        }

    });
}

document.addEventListener('DOMContentLoaded', () => {

    var btnSignIn = document.getElementById('btnSignIn');
    var btnSubmit = document.getElementById('btnSubmit');
    btnSignIn.addEventListener('click', function() {location.href = "signIn.html"});
    btnSubmit.addEventListener('click', submitJobInformation);
});

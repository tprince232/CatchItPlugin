
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
        var glassdoorUrlRegex = /^https?:\/\/(?:[^./?#]+\.)?glassdoor\.com/;

        //var userID = window.sessionStorage.getItem('userID');
        var source="None";
        var content_script = "content.js";
        if (indeedUrlRegex.test(url)) {
            source = "indeed.com";
        }
        else if (glassdoorUrlRegex.test(url)) {
            source = "glassdoor.com";
            content_script = "content_gd.js";
        }
        else {
            document.getElementById("report").innerHTML = "Inapplicable Web Page";
            document.getElementById("report").style.color = "red";
        }
        if (source !== "None") {
            // ...if it matches, send a message specifying a callback too
            chrome.tabs.executeScript(null, {file: content_script});
            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, function(domContent) {
                try {
                    console.log('I received the following DOM content:\n' + domContent.title);
                }
                catch(err) {
                    document.getElementById("report").innerHTML = "Inapplicable Web Page";
                    document.getElementById("report").style.color = "red";
                    return
                }
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        var result = xhr.responseText;
                        console.log(result);
                        if (xhr.responseText === "invalid_pass") {
                            console.log("in the if!");
                            document.getElementById('report').innerHTML = "Successful upload!";
                            document.getElementById('report').style.color = "blue";
                        }
                        document.getElementById('report').innerHTML = "Successful upload!";
                        document.getElementById('report').style.color = "green";
                    }
                    return false;
                };

                var postURL = "https://dsg1.crc.nd.edu/cse30246/catchit/api/jobposting.php/";
                var params = "id=" + window.userID + "&company=" + domContent.company + "&location=" +
                    domContent.location + "&jobtitle=" + domContent.title + "&deadline=" + "" + "&source=" + source +
                    "&details="  + domContent.description + "&url=" + url;

                console.log(postURL);
                xhr.open("POST", postURL, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(params);
            });
        }

    });
}


document.addEventListener('DOMContentLoaded', () => {

    var btnSignIn = document.getElementById('btnSignIn');
    var btnSubmit = document.getElementById('btnSubmit');

    window.userID = window.sessionStorage.getItem("userID");
    if (window.userID === null) {
        chrome.storage.sync.get(null, function(items) {
            window.userID =  items.userID;
            console.log(window.userID);

            if (window.userID === null) {
                document.getElementById("btnSignIn").innerHTML = "Sign In";
            }
        });
    }
    console.log(window.userID);

    btnSignIn.addEventListener('click', function() {location.href = "signIn.html"});
    btnSubmit.addEventListener('click', submitJobInformation);
});

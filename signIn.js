// var https = require('https');

document.addEventListener('DOMContentLoaded', function () {
    var ln = document.getElementsByTagName("a")[0];  //no other links can be added
    var loc = ln.href;
    ln.onclick = function () {
        chrome.tabs.create({active: true, url: loc});
    };
    chrome.storage.sync.set({'userID': null}, function() {
        // Notify that we saved.
        console.log('User ID set to null');
    });

    document.getElementById("submit").addEventListener('click',  function() {

        var username = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                if(xhr.responseText === "invalid_email") {
                    document.getElementById("report").innerHTML = "Invalid Email";
                }
                else if (xhr.responseText === "invalid_pass") {
                    document.getElementById("report").innerHTML = "Invalid Password";
                }
                else {
                    var userID = Number(xhr.responseText);
                    console.assert(userID, 'user login response should be an int');
                    window.sessionStorage.setItem("userID", userID);
                    chrome.storage.sync.set({'userID': userID}, function() {
                        // Notify that we saved.
                        console.log('New userID saved');
                    });
                    location.href = "popup.html";
                }
            }
            return false;
        };
        var postURL = "https://dsg1.crc.nd.edu/cse30246/catchit/api/login.php/";
        var params = "email=" + username + "&psw=" + password;

        console.log(URL);
        xhr.open("POST", postURL, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);

    });
});
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {

        var spans = document.getElementsByTagName('span');
        var i = 0;

        var data = {};
        /*for (i; i<spans.length; i++) {
            var prop = spans[i].getAttribute('itemprop');
            if (prop) {

            }
        }*/
        var title = 'var'; //spans.querySelector('[itemprop=title]').textContent;
        data.title = title; //'val';//document.getElementsByClassName("jobtitle")[0].innerHTML;
        data.company = 'val'; //document.getElementsByClassName("company")[0].innerHTML;
        data.location = 'val'; //document.getElementsByClassName("loc")[0].value;
        data.description = 'val';//document.getElementById("job_summary").innerHTML;

        sendResponse(data)
    }
});
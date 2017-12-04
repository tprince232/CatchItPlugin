// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {

        //var spans = document.getElementsByTagName('span');
        //var i = 0;

        var data = {};
        /*for (i; i<spans.length; i++) {
            var prop = spans[i].getAttribute('itemprop');
            if (prop) {

            }
        }*/
        data.title = document.getElementsByClassName("breadcrumb ib ")[1].textContent;
        data.company = document.getElementsByClassName("breadcrumb ib ")[4].textContent;
        var state = document.getElementsByClassName("breadcrumb ib ")[2].textContent;
        var city = document.getElementsByClassName("breadcrumb ib ")[3].textContent;

        data.location = city + ", " + state;
        data.description = document.getElementsByClassName("jobDescriptionContent desc")[0].innerHTML;

        sendResponse(data)
    }
});
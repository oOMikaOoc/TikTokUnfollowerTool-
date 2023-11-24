// document.getElementById('masquerAmis').addEventListener('click', function() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "masquerAmis"});
//     });
//   });


  document.getElementById('clickAbonnementsButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "cliquerAbonnements"});
    });
});


chrome.runtime.onInstalled.addListener(function() {
    console.log("Service Worker installé");
  });

chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.url.includes('https://mon.tiktokv.com/monitor_browser/collect/batch/') && details.method === "POST") {
        console.log("Requête POST détectée :", details.url);

        // Après un court délai, envoyer un message au script de contenu
        setTimeout(() => {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "masquerAmis"});
          });
        }, 10); // Délai en millisecondes
      }
    },
    {urls: ["*://mon.tiktokv.com/monitor_browser/collect/batch/*"]}
  );
  
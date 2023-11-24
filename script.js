console.log("Script de contenu chargé sur TikTok");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "cliquerAbonnements") {
      cliquerSurTousLesAbonnements();
  }
});

function cliquerSurTousLesAbonnements() {
  const boutonsAbonnements = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2'); // Remplacez par le bon sélecteur
  boutonsAbonnements.forEach((btn, index) => {
      // Générer un délai aléatoire entre 400 et 900 ms
      const delaiAleatoire = Math.floor(Math.random() * (900 - 400 + 1)) + 400;

      setTimeout(() => {
          if (btn.textContent.includes('Abonnements')) {
              btn.click();
          }
      }, delaiAleatoire);
  });
}

// Fonction pour masquer les éléments "Amis"
function masquerElementsAmis() {
  const boutonsAmis = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2');
  let compteur = 0; // Compteur pour sauter les 30 premiers éléments

  boutonsAmis.forEach(btn => {
    if (compteur >= 15) { // Commence à masquer à partir du 16ème élément
      if (btn.textContent.includes('Amis') || btn.textContent.includes('Suivre')) {
        btn.closest('li').style.display = 'none';
      }
    }
    compteur++;
  });
}

function supprimerElementsAmis() {
  const boutonsAmis = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2');
  let compteur = 0;

  boutonsAmis.forEach(btn => {
    if (compteur >= 100) {
      if (btn.textContent.includes('Amis') || btn.textContent.includes('Suivre')) {
        const liParent = btn.closest('li');
        if (liParent) {
          liParent.remove(); // Supprime l'élément 'li' du DOM
        }
      }
    }
    compteur++;
  });
}


function compterLiNonMasques() {
  const elementsLi = document.querySelectorAll('div[class*="DivUserListContainer"] li');

  let compteurNonMasques = 0;
  
  elementsLi.forEach(li => {
    if (li.style.display !== 'none') {
      compteurNonMasques++;
    }
  });

  console.log("li non masqué" + compteurNonMasques)
  return compteurNonMasques;
}

// Fonction pour observer les changements dans le DOM
function observerDOM() {
  const observer = new MutationObserver((mutations) => {
    // Vérifie si la modal est présente
    const targetNode = document.querySelector('div[class*="DivUserListContainer"]');
    if (targetNode) {
      if (compterLiNonMasques() > 25) {
        supprimerElementsAmis();
      }
    }
  });

  // Configuration de l'observer
  const config = { childList: true, subtree: true };

  // Démarrer l'observation sur un élément parent constant
  observer.observe(document.body, config);
}

// Démarrer l'observation
observerDOM();

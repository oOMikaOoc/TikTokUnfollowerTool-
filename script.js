console.log("Script de contenu chargé sur TikTok");

let observerDOM;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "cliquerAbonnements") {
      cliquerSurTousLesAbonnements();
  }
});


/**
 * Fonction asynchrone pour cliquer sur tous les boutons "Abonnements" dans une page TikTok.
 * Elle parcourt chaque bouton correspondant au sélecteur spécifié, effectue un clic, 
 * puis attend un délai aléatoire avant de passer au bouton suivant.
 * 
 * @param {number} minDelai - Le délai minimum (en millisecondes) avant de cliquer sur le bouton suivant.
 * @param {number} maxDelai - Le délai maximum (en millisecondes) pour le même but.
 * 
 * La fonction commence par mettre à jour et afficher le total des boutons "Abonnements" présents.
 * Si un observateur DOM (observerDOM) est actif, il est déconnecté pour éviter les interférences pendant l'exécution de la fonction.
 * Chaque bouton "Abonnements" trouvé est cliqué. Après chaque clic, la fonction met à jour un compteur et attend un délai aléatoire 
 * compris entre minDelai et maxDelai avant de passer au bouton suivant. 
 * Ce délai aléatoire permet d'éviter les comportements qui semblent automatisés et peut aider à respecter 
 * les limites de fréquence d'actions imposées par TikTok.
 * Après avoir parcouru tous les boutons, l'observateur DOM est réactivé pour continuer à surveiller les changements dans la page.
 */

function delai(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function cliquerSurTousLesAbonnements(minDelai = 600, maxDelai = 1300) {
  total = mettreAJourCompteurAbonnements();
  if (observerDOM) {
    observerDOM.disconnect(); // Désactive l'observateur
  }
  compteurDeBoutonClique = 0;
  const boutonsAbonnements = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2');

  for (const btn of boutonsAbonnements) {
    const delaiAleatoire = Math.floor(Math.random() * (maxDelai - minDelai + 1)) + minDelai;
    if (btn.textContent.includes('Abonnements')) {
      btn.click();
      compteurDeBoutonClique += 1;
      mettreAJourCompteur(compteurDeBoutonClique, total);
    }
    await delai(delaiAleatoire);
  }

  if (observerDOM) {
    observerDOM.observe(document.body, { childList: true, subtree: true });
  }
}


function mettreAJourCompteur(index, total) {
  const compteurDiv = document.getElementById('compteur-abonnement');
  if (compteurDiv) {
    compteurDiv.innerText = `Nombre de boutons "Abonnement" traités : ${index} sur ${total}`;
  }
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

function supprimerElementsAmis(nombreDeLiConserve) {
  const boutonsAmis = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2');
  let compteur = 0;
  const nombreTotal = boutonsAmis.length;

  boutonsAmis.forEach(btn => {
    // Vérifie si le compteur est inférieur à la longueur totale moins 15
    if (compteur >= nombreDeLiConserve && compteur < nombreTotal - 0) {
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



function ajouterDivCompteur() {
  // Vérifier si la div du compteur existe déjà
  if (!document.getElementById('compteur-abonnement')) {
    // Sélectionner l'en-tête de la modal
    const modalHeader = document.querySelector('div[class*="DivHeaderContainer"][class*="edpgb5h1"]');

    if (modalHeader) {
      // Créer la div pour le compteur
      const compteurDiv = document.createElement('div');
      compteurDiv.id = 'compteur-abonnement';
      compteurDiv.style.padding = '10px';
      compteurDiv.style.backgroundColor = '#f0f0f0';
      compteurDiv.style.borderTop = '1px solid #ddd';
      compteurDiv.style.borderBottom = '1px solid #ddd';
      compteurDiv.style.marginTop = '5px';
      compteurDiv.innerText = 'Nombre de boutons "Abonnement" : 0';

      // Insérer la div dans l'en-tête de la modal
      modalHeader.appendChild(compteurDiv);

      // Ajouter un écouteur de clic sur la div du compteur
      compteurDiv.addEventListener('click', mettreAJourCompteurAbonnements);

    } else {
      console.error("En-tête de la modal non trouvé");
    } 
  }
}

function mettreAJourCompteurAbonnements() {
  const boutonsAbonnements = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2');
  let compteurAbonnements = 0;

  boutonsAbonnements.forEach(btn => {
    if (btn.textContent.includes('Abonnements')) {
      compteurAbonnements++;
    }
  });

  const compteurDiv = document.getElementById('compteur-abonnement');
  if (compteurDiv) {
    compteurDiv.innerText = `Nombre de boutons "Abonnement" : ${compteurAbonnements}`;
  }

  return compteurAbonnements;
}

function triggerScrollReload(element) {
  const currentScroll = element.scrollTop;
  // Défilement vers le haut
  element.scrollTop = currentScroll - 50;

  // Retour en bas pour déclencher le rechargement
  setTimeout(() => {
    element.scrollTop = currentScroll -5;
  }, 200); // Retarde légèrement le retour pour permettre la détection du changement
}

function compterLiNonMasques() {
  const elementsLi = document.querySelectorAll('div[class*="DivUserListContainer"] li');

  let compteurNonMasques = 0;
  
  elementsLi.forEach(li => {
    if (li.style.display !== 'none') {
      compteurNonMasques++;
    }
  });

  return compteurNonMasques;
}

// Fonction pour observer les changements dans le DOM
function observerDOMmutation() {
  observerDOM = new MutationObserver((mutations) => {
    // Vérifie si la modal est présente
    const targetNode = document.querySelector('div[class*="DivUserListContainer"]');
    if (targetNode) {
      nombreDeLiConserve = 10;// nombre de li conservé
      if (compterLiNonMasques() > nombreDeLiConserve) {
        ajouterDivCompteur()
        supprimerElementsAmis(nombreDeLiConserve);

        // Utilisation de la fonction triggerScrollReload pour simuler un scroll haut puis bas
        let containerScroll = document.querySelector('div[class*="DivUserListContainer"]');
        triggerScrollReload(containerScroll);
      }
    }
  });

  // Configuration de l'observer
  const config = { childList: true, subtree: true };

  // Démarrer l'observation sur un élément parent constant
  observerDOM.observe(document.body, config);
}

// Démarrer l'observation

observerDOMmutation();

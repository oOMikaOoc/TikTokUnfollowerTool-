console.log("Script de contenu chargé sur TikTok");

let observerDOM;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "cliquerAbonnements") {
      cliquerSurTousLesAbonnements();
  }
});

function cliquerSurTousLesAbonnements() {
  total = mettreAJourCompteurAbonnements();
  if (observerDOM) {
    observerDOM.disconnect(); // Désactive l'observateur
  }
  compteurDeBoutonClique = 0;
  const boutonsAbonnements = document.querySelectorAll('.tiktok-s6a072-Button-StyledFollowButtonV2'); // Remplacez par le bon sélecteur
  boutonsAbonnements.forEach((btn) => {
    const delaiAleatoire = Math.floor(Math.random() * (900 - 400 + 1)) + 400;
    setTimeout(() => {
      if (btn.textContent.includes('Abonnements')) {
        btn.click();
        compteurDeBoutonClique += 1
        mettreAJourCompteur(compteurDeBoutonClique, total);
      }
    }, delaiAleatoire);
  });
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

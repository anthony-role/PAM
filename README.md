# PAM · Joutes sportives (since 2012)

Site du palmarès et de la saisie en direct des joutes sportives de la PAM.

- **Hébergement** : Netlify (site statique, gratuit), relié à un dépôt GitHub.
- **Historique 2012-2025** : intégré directement dans la page, toujours affiché.
- **Nouvelles éditions** : enregistrées dans Firebase Firestore (gratuit à cette échelle) et visibles en direct par tout le monde.
- **Saisie** : chacun peut saisir depuis son téléphone après avoir tapé une fois le **code PAM**. Pas besoin de compte Google.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site (palmarès, éditions, épreuves, joueurs, jour J, règlement), historique compris |
| `pam.jpg` | Photo de l'équipe |
| `firebase-config.js` | Les 6 valeurs de ton projet Firebase, **à remplir** |
| `firestore.rules` | Règles de sécurité, à copier dans Firebase |
| `data/historique.json` | L'historique tiré des fichiers Excel |
| `integrer-historique.ps1` | Recopie `data/historique.json` dans `index.html` (seulement si tu modifies l'historique) |
| `netlify.toml` | Réglages Netlify (rien à modifier) |

---

## Mise en ligne, pas à pas (environ 20 minutes)

Utilise tes **comptes personnels** (pas l'adresse professionnelle).

### Étape 1 · Créer le projet Firebase

1. Va sur <https://console.firebase.google.com> > **Créer un projet** (nom : `pam-joutes`). Tu peux refuser Google Analytics.
2. **Créer > Firestore Database** > **Créer une base de données**, emplacement en Europe (par ex. `europe-west9` Paris), **mode production**.
3. **Créer > Authentication** > **Commencer** > onglet **Sign-in method** : active **Anonyme** (« Anonymous »). C'est tout : pas besoin de Google.
4. **Paramètres du projet** (roue dentée) > **Vos applications** > icône **Web `</>`**, nom `pam-site`, sans Firebase Hosting. Garde le bloc `firebaseConfig` affiché.

### Étape 2 · Renseigner la configuration

Ouvre `firebase-config.js` et remplace chaque `A_REMPLACER` par la valeur correspondante du bloc `firebaseConfig`.

> Ces valeurs peuvent être publiques. La protection vient des règles et du code PAM (étape 3).

### Étape 3 · Règles de sécurité et code PAM

1. **Firestore Database > Règles** : remplace tout par le contenu de `firestore.rules`, puis **Publier**.
2. **Firestore Database > Données** > **Commencer une collection** :
   - ID de la collection : `config`
   - ID du document : `acces`
   - Champ : `code`, type **string**, valeur : le code PAM de ton choix (par ex. `galinette2026`).

Donne ce code aux copains (de vive voix ou par message). Pour le changer : modifie le champ `code`. Les téléphones déjà activés le restent ; pour tout réinitialiser, supprime la collection `membres`.

### Étape 4 · Mettre le code sur GitHub

1. <https://github.com> > **New repository** : nom `pam-joutes`, visibilité **Private** (recommandé).
2. Sur la page du dépôt : **Add file > Upload files**, glisse **tout le contenu** du dossier `pam-joutes` (y compris le dossier `data`), puis **Commit changes**.

### Étape 5 · Publier avec Netlify

1. <https://app.netlify.com>, connexion avec ton compte GitHub.
2. **Add new site > Import an existing project > GitHub** > dépôt `pam-joutes`.
3. Laisse les réglages proposés et clique sur **Deploy**.
4. Renomme l'adresse si tu veux : **Site configuration > Change site name** (par ex. `pam-joutes.netlify.app`).

### Étape 6 · Vérifier

1. Ouvre le site : l'historique s'affiche.
2. Onglet **Jour J** : tape le code PAM, puis **Valider**. Le message « Saisie activée » apparaît.
3. Crée l'édition de l'année avec **Créer**.

C'est prêt : partage le lien et le code avec les copains.

---

## Le jour J

- Chacun ouvre le site sur son téléphone, onglet **Jour J**, et tape le code PAM (une seule fois par téléphone).
- L'édition en cours s'ouvre automatiquement. Chacun peut saisir les scores, places et jokers de **n'importe quelle épreuve** ; les saisies des uns et des autres s'additionnent sans s'écraser (chaque case est enregistrée séparément) et le classement se met à jour en direct chez tout le monde.
- À la fin : **Clôturer l'édition**. Elle rejoint le palmarès, les fiches joueurs et le palmarès par épreuve.

## Corriger l'historique

- **Depuis le site** : onglet Éditions > année > **Modifier / saisir**. La correction est enregistrée dans Firebase et remplace l'ancienne valeur à l'affichage.
- **Dans le fichier** : modifie `data/historique.json`, lance `integrer-historique.ps1` (clic droit > Exécuter avec PowerShell), puis renvoie `index.html` et `data/historique.json` sur GitHub.

## Modifier le site plus tard

Modifie le fichier sur GitHub : Netlify republie automatiquement en moins d'une minute. Les scores, eux, vivent dans Firebase et ne sont pas touchés.

## En cas de souci

| Message ou symptôme | Solution |
|---|---|
| « La saisie en ligne n'est pas encore active » | `firebase-config.js` contient encore `A_REMPLACER` (étape 2), ou n'a pas été envoyé sur GitHub |
| « Code incorrect » | Vérifie le champ `code` de `config/acces` (majuscules, espaces) et que les règles de l'étape 3 sont publiées |
| « La connexion anonyme n'est pas activée » | Active le fournisseur **Anonyme** (étape 1.3) |
| « Impossible de lire les éditions en ligne » | Les règles de l'étape 3 ne sont pas publiées |
| L'historique n'apparaît pas | `index.html` sur GitHub n'est pas la dernière version |

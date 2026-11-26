# PAM · Joutes sportives (since 2012)

Site du palmarès et de la saisie en direct des joutes sportives de la PAM.

- **Hébergement** : Netlify (site statique, gratuit), relié à un dépôt GitHub.
- **Données** : Firebase Firestore (gratuit à cette échelle). Les scores saisis le jour J y sont enregistrés et visibles en direct par tout le monde.
- **Saisie** : connexion avec un compte Google. Seules les adresses autorisées peuvent saisir ; tout le monde peut consulter.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site (palmarès, éditions, épreuves, joueurs, jour J, règlement) |
| `pam.jpg` | Photo de l'équipe (en-tête du palmarès et icône) |
| `firebase-config.js` | Les 6 valeurs de ton projet Firebase, **à remplir** |
| `firestore.rules` | Règles de sécurité de la base, à copier dans Firebase |
| `data/historique.json` | L'historique 2012-2025 tiré des fichiers Excel |
| `integrer-historique.ps1` | Recopie `data/historique.json` dans `index.html` (à relancer seulement si tu modifies l'historique) |
| `import.html` | Facultatif : copie l'historique dans Firebase (inutile pour l'affichage) |

**L'historique est intégré directement dans `index.html`** : il s'affiche toujours, même avant d'avoir configuré Firebase. Firebase ne sert qu'à enregistrer les nouvelles éditions (et les éventuelles corrections), qui viennent s'ajouter par-dessus.
| `netlify.toml` | Réglages Netlify (rien à modifier) |

---

## Mise en ligne, pas à pas (environ 30 minutes)

Utilise tes **comptes personnels** (pas l'adresse professionnelle).

### Étape 1 · Créer le projet Firebase

1. Va sur <https://console.firebase.google.com> et clique sur **Créer un projet** (nom : `pam-joutes`). Tu peux refuser Google Analytics.
2. Dans le menu **Créer > Firestore Database** : **Créer une base de données**, emplacement **europe-west** (par ex. `eur3` ou `europe-west9` Paris), puis **mode production**.
3. Dans **Créer > Authentication** : **Commencer**, puis active le fournisseur **Google**.
4. Dans **Paramètres du projet** (roue dentée) > **Vos applications** : clique sur l'icône **Web `</>`**, nom `pam-site`, sans Firebase Hosting. Firebase affiche un bloc `firebaseConfig` : garde-le pour l'étape 2.

### Étape 2 · Renseigner la configuration

Ouvre `firebase-config.js` et remplace chaque `A_REMPLACER` par la valeur correspondante du bloc `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

> Ces valeurs ne sont pas des mots de passe : elles peuvent être publiques. La protection vient des règles de l'étape 3.

### Étape 3 · Sécuriser la base et autoriser les joueurs

1. **Firestore Database > Règles** : remplace tout le contenu par celui du fichier `firestore.rules`, puis **Publier**.
2. **Firestore Database > Données** : **Commencer une collection**
   - ID de la collection : `config`
   - ID du document : `acces`
   - Champ : `emails`, type **array**, et ajoute une valeur (type string) par adresse Google autorisée à saisir les scores (la tienne et celles des copains).

Pour ajouter un joueur plus tard : reviens sur ce document et ajoute son adresse dans `emails`.

### Étape 4 · Mettre le code sur GitHub

1. Crée un compte sur <https://github.com> si besoin, puis **New repository** : nom `pam-joutes`, visibilité **Private** (recommandé : la photo et les pseudos restent hors des recherches GitHub).
2. Sur la page du dépôt vide : **uploading an existing file**, puis glisse **tout le contenu** du dossier `pam-joutes` (y compris le dossier `data`). Clique sur **Commit changes**.

### Étape 5 · Publier avec Netlify

1. Va sur <https://app.netlify.com>, connecte-toi avec ton compte GitHub.
2. **Add new site > Import an existing project > GitHub**, autorise l'accès au dépôt `pam-joutes`, puis sélectionne-le.
3. Laisse les réglages proposés (pas de commande de build, dossier de publication `.`) et clique sur **Deploy**.
4. Netlify donne une adresse du type `https://nom-au-hasard.netlify.app`. Tu peux la renommer dans **Site configuration > Change site name** (par ex. `pam-joutes.netlify.app`).

### Étape 6 · Autoriser l'adresse Netlify pour la connexion Google

Firebase > **Authentication > Paramètres > Domaines autorisés** > **Ajouter un domaine** : saisis `pam-joutes.netlify.app` (ton adresse Netlify, sans `https://`).

### Étape 7 · Vérifier

Ouvre `https://pam-joutes.netlify.app` : le palmarès et l'historique 2012-2025 s'affichent tout de suite. Connecte-toi (bouton en haut à droite), va dans **Jour J** et crée l'édition de l'année pour vérifier que l'enregistrement fonctionne.

C'est prêt : partage le lien avec les copains.

> Pas besoin d'importer l'historique : il est déjà dans la page. La page `import.html` reste disponible si un jour tu veux aussi en avoir une copie dans Firebase.

## Corriger l'historique

- **Depuis le site** : onglet Éditions > année > **Modifier / saisir**. La correction est enregistrée dans Firebase et remplace l'ancienne valeur à l'affichage.
- **Dans le fichier** : modifie `data/historique.json`, lance `integrer-historique.ps1` (clic droit > Exécuter avec PowerShell), puis renvoie `index.html` et `data/historique.json` sur GitHub.

---

## Le jour J

1. Onglet **Jour J** > **Se connecter** (compte Google autorisé).
2. Crée l'édition de l'année, choisis les joueurs et les épreuves, puis **Enregistrer le programme**.
3. Saisis scores ou places au fil du week-end. Tout est enregistré dans Firebase dès qu'on quitte une case, et tout le monde voit le classement en direct.
4. À la fin : **Clôturer l'édition**. Elle rejoint alors le palmarès, les fiches joueurs et le palmarès par épreuve.

## Modifier le site plus tard

Modifie le fichier sur GitHub (icône crayon, ou nouvel envoi du fichier) : Netlify republie automatiquement en moins d'une minute. Les données (scores) ne sont pas touchées, elles vivent dans Firebase.

## Sauvegarde

Les données sont dans Firestore. Pour en garder une copie, Firebase propose un export dans **Firestore Database > Import/Export** (nécessite le forfait Blaze). Sinon, l'historique de départ reste dans `data/historique.json`.

## En cas de souci

| Message | Solution |
|---|---|
| « La saisie en ligne sera active une fois firebase-config.js renseigné » | `firebase-config.js` contient encore `A_REMPLACER` (étape 2) |
| L'historique n'apparaît pas | `index.html` n'est pas la dernière version : renvoie-le sur GitHub |
| La fenêtre Google s'ouvre puis se ferme avec une erreur de domaine | Ajoute l'adresse Netlify aux domaines autorisés (étape 6) |
| « Ton adresse n'est pas autorisée » | Ajoute l'adresse dans `config/acces > emails` (étape 3) |
| « Impossible de lire les éditions en ligne » | Vérifie que les règles de l'étape 3 ont bien été publiées |

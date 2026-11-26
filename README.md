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
| `import.html` | Page à utiliser **une seule fois** pour charger l'historique 2012-2025 |
| `data/historique.json` | L'historique tiré des fichiers Excel |
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

### Étape 7 · Importer l'historique (une seule fois)

1. Ouvre `https://pam-joutes.netlify.app/import.html`.
2. Connecte-toi avec une adresse présente dans `config/acces`.
3. Clique sur **Importer l'historique**. Le message « 6 joueurs et 12 éditions importés » confirme l'opération.

C'est prêt : ouvre `https://pam-joutes.netlify.app` et partage le lien avec les copains.

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
| « Firebase n'est pas encore configuré » | `firebase-config.js` contient encore `A_REMPLACER` (étape 2) |
| La fenêtre Google s'ouvre puis se ferme avec une erreur de domaine | Ajoute l'adresse Netlify aux domaines autorisés (étape 6) |
| « Ton adresse n'est pas autorisée » | Ajoute l'adresse dans `config/acces > emails` (étape 3) |
| Le site reste vide après import | Vérifie que les règles de l'étape 3 ont bien été publiées |

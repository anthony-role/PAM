# PAM · Joutes sportives (since 2012)

Site du palmarès et de la saisie en direct des joutes sportives de la PAM.

- **Hébergement** : Netlify (gratuit), relié à un dépôt GitHub.
- **Historique 2012-2025** : intégré dans la page, toujours affiché.
- **Nouveaux évènements** : enregistrés dans Firebase Firestore (gratuit à cette échelle), visibles en direct par tout le monde.
- **Saisie** : un bouton **+ Nouvel évènement**, puis chacun saisit les résultats depuis son téléphone. Ni compte, ni code.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Le site, historique compris |
| `pam.jpg` | Photo de l'équipe |
| `firebase-config.js` | Les 6 valeurs de ton projet Firebase, **à remplir** |
| `firestore.rules` | Règles de la base, à copier dans Firebase |
| `data/historique.json` | L'historique tiré des fichiers Excel |
| `integrer-historique.ps1` | Recopie `data/historique.json` dans `index.html` (seulement si tu modifies l'historique) |
| `netlify.toml` | Réglages Netlify (rien à modifier) |

---

## Mise en ligne (environ 15 minutes)

Utilise tes **comptes personnels**.

### 1 · Créer la base Firebase

1. <https://console.firebase.google.com> > **Créer un projet** (nom : `pam-joutes`). Tu peux refuser Google Analytics.
2. Menu **Créer > Firestore Database** > **Créer une base de données** > emplacement en Europe (par ex. `europe-west9`) > **mode production**.
3. **Paramètres du projet** (roue dentée) > **Vos applications** > icône **Web `</>`**, nom `pam-site`. Firebase affiche un bloc `firebaseConfig` : garde-le ouvert.

### 2 · Brancher le site sur la base

Ouvre `firebase-config.js` et remplace chaque `A_REMPLACER` par la valeur correspondante du bloc `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Garde les guillemets.

### 3 · Coller les règles

**Firestore Database > Règles** : efface tout, colle le contenu de `firestore.rules`, clique sur **Publier**.

### 4 · GitHub puis Netlify

1. <https://github.com> > **New repository** `pam-joutes` (**Private** recommandé) > **Add file > Upload files** : glisse tout le contenu du dossier (y compris `data`) > **Commit changes**.
2. <https://app.netlify.com> > **Add new site > Import an existing project > GitHub** > `pam-joutes` > **Deploy**.

### 5 · Vérifier

Ouvre le site et clique sur **+ Nouvel évènement** (en haut à droite). L'évènement de l'année est créé et s'ouvre dans l'onglet **Jour J**.

---

## Le jour J

1. **+ Nouvel évènement** : l'évènement de l'année est créé avec une première épreuve.
2. Dans « Préparer l'édition » : renomme les épreuves, ajoute-en, coche les joueurs, puis **Enregistrer le programme**.
3. Chacun ouvre le site sur son téléphone, onglet **Jour J**, et saisit scores, places et jokers de **n'importe quelle épreuve**. Chaque case est enregistrée séparément : les saisies des uns et des autres ne s'écrasent pas, et le classement se met à jour en direct chez tout le monde.
4. À la fin : **Clôturer l'édition**.

> Toute personne qui a le lien du site peut saisir. Personne ne peut supprimer un évènement depuis le site, et l'historique 2012-2025 est inscrit dans la page elle-même : il ne peut pas être perdu.

## Corriger l'historique

- **Depuis le site** : onglet Éditions > année > **Modifier / saisir**.
- **Dans le fichier** : modifie `data/historique.json`, lance `integrer-historique.ps1` (clic droit > Exécuter avec PowerShell), puis renvoie `index.html` sur GitHub.

## En cas de souci

Le message s'affiche sous l'en-tête du site.

| Message | Solution |
|---|---|
| « la base de données n'est pas branchée » | `firebase-config.js` contient encore `A_REMPLACER`, ou la version remplie n'a pas été envoyée sur GitHub (étape 2) |
| « Firebase refuse l'enregistrement » | Les règles ne sont pas à jour : refais l'étape 3 |
| L'historique n'apparaît pas | `index.html` sur GitHub n'est pas la dernière version |

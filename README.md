# PAM · Joutes sportives (since 2012)

Site du palmarès et de la saisie en direct des joutes sportives de la PAM.

- **Hébergement** : Netlify, relié à un dépôt GitHub. Rien d'autre : pas de Firebase, pas de compte supplémentaire.
- **Historique 2012-2025** : inscrit dans la page, toujours affiché.
- **Nouveaux évènements** : enregistrés chez Netlify (Netlify Blobs), comme pour l'application Secret-Santa.
- **Saisie** : bouton **+ Nouvel évènement**, puis chacun saisit les résultats depuis son téléphone. Ni compte, ni code.

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Le site, historique compris |
| `pam.jpg` | Photo de l'équipe |
| `netlify/functions/api.mjs` | Petite fonction serveur qui enregistre les évènements chez Netlify |
| `package.json` | Indique à Netlify l'outil de stockage à installer (rien à faire) |
| `netlify.toml` | Réglages Netlify (rien à modifier) |
| `data/historique.json` | L'historique tiré des fichiers Excel |
| `integrer-historique.ps1` | Recopie `data/historique.json` dans `index.html` (seulement si tu modifies l'historique) |

---

## Mise à jour du dépôt GitHub existant

1. **Supprime** du dépôt `firebase-config.js`, `firestore.rules` et `import.html` s'ils y sont (clic sur le fichier > menu `…` > **Delete file** > **Commit changes**).
2. **Add file > Upload files** : glisse `index.html`, `netlify.toml`, `package.json`, `README.md` **et le dossier `netlify`** (il contient `functions/api.mjs`) > **Commit changes**.
3. Netlify republie tout seul (1 à 2 minutes). Dans Netlify > **Deploys**, le dernier déploiement doit être **Published** ; dans **Functions**, une fonction `api` doit apparaître.

Tu peux supprimer le projet Firebase : il ne sert plus.

## Première mise en ligne (nouveau dépôt)

1. <https://github.com> > **New repository** `pam-joutes` (**Private** recommandé) > **Add file > Upload files** : glisse tout le contenu du dossier (avec les dossiers `data` et `netlify`) > **Commit changes**.
2. <https://app.netlify.com> > **Add new site > Import an existing project > GitHub** > `pam-joutes` > **Deploy**.

Aucun autre réglage : le stockage Netlify Blobs est activé automatiquement.

## Vérifier

Ouvre le site et clique sur **+ Nouvel évènement** (en haut à droite). L'évènement de l'année est créé et s'ouvre dans l'onglet **Jour J**.

---

## Le jour J

1. **+ Nouvel évènement** : l'évènement de l'année est créé avec une première épreuve.
2. Dans « Préparer l'édition » : renomme les épreuves, ajoute-en, coche les joueurs, puis **Enregistrer le programme**.
3. Chacun ouvre le site sur son téléphone, onglet **Jour J**, et saisit scores, places et jokers de **n'importe quelle épreuve**. Chaque case est enregistrée séparément : les saisies ne s'écrasent pas. L'écran se met à jour toutes les 4 secondes chez tout le monde.
4. À la fin : **Clôturer l'édition**.

> Toute personne qui a le lien peut saisir. Rien ne peut être supprimé depuis le site, et l'historique 2012-2025 est inscrit dans la page : il ne peut pas être perdu.

## Corriger l'historique

- **Depuis le site** : onglet Éditions > année > **Modifier / saisir**.
- **Dans le fichier** : modifie `data/historique.json`, lance `integrer-historique.ps1` (clic droit > Exécuter avec PowerShell), puis renvoie `index.html` sur GitHub.

## En cas de souci

Le message s'affiche sous l'en-tête du site.

| Message | Solution |
|---|---|
| « le serveur du site ne répond pas » | Le dossier `netlify/functions` ou `package.json` manque sur GitHub, ou le déploiement Netlify a échoué (voir **Deploys**) |
| « la fonction serveur est introuvable » | Même cause : vérifie que `netlify/functions/api.mjs` est bien sur GitHub, dans ce dossier exact |
| « la saisie ne fonctionne qu'une fois le site publié » | Normal si tu ouvres `index.html` depuis ton ordinateur : utilise l'adresse Netlify |

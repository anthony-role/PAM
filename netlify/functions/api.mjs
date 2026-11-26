// Fonction serveur des Joutes PAM : enregistre les évènements dans Netlify Blobs
// (même principe que l'application Secret-Santa, aucun compte extérieur).
// Clés du magasin « pam-joutes » :
//   edition/<année>  → un évènement (programme, résultats, jokers…), ou une correction d'une année de l'historique
//   joueurs          → les joueurs ajoutés ou renommés depuis le site
// L'historique 2012-2025 est inscrit dans index.html : ce magasin ne contient que ce qui a été saisi en ligne.
// Pas de suppression possible depuis le site.
import { getStore } from "@netlify/blobs";

const magasin = () => getStore({ name: "pam-joutes", consistency: "strong" });
const ANNEE = /^(20\d\d|2100)$/;
const ID_JOUEUR = /^[a-z0-9]{1,30}$/;
const CHAMPS_EDITION = ["year", "status", "source", "date", "lieu", "players", "events", "results", "jokers", "pairs", "notes"];
const CHAMPS_JOUEUR = ["name", "order", "chip", "stroke"];

const rep = (corps, statut = 200) =>
  new Response(JSON.stringify(corps), {
    status: statut,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
const erreur = (texte, statut, code) => rep({ erreur: texte, code }, statut);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const estObjet = (v) => v && typeof v === "object" && !Array.isArray(v);

// Fusion profonde : les objets se combinent champ par champ, le reste (tableaux, textes, nombres) est remplacé.
// Ainsi deux personnes qui saisissent des cases différentes en même temps ne s'écrasent pas.
function fusionner(a, b, profondeur = 0) {
  if (profondeur > 8) return a;
  for (const k of Object.keys(b)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    if (estObjet(b[k]) && estObjet(a[k])) fusionner(a[k], b[k], profondeur + 1);
    else a[k] = b[k];
  }
  return a;
}

// Lecture-modification-écriture protégée : si quelqu'un a écrit entre-temps, on relit et on recommence.
async function mettreAJour(s, cle, patch) {
  for (let essai = 0; essai < 8; essai++) {
    const actuel = await s.getWithMetadata(cle, { type: "json" });
    const suivant = fusionner(actuel?.data ? actuel.data : {}, patch);
    const options = actuel ? { onlyIfMatch: actuel.etag } : { onlyIfNew: true };
    const r = await s.setJSON(cle, suivant, options);
    if (!r || r.modified !== false) return suivant;
    await pause(40 * (essai + 1) + Math.random() * 40);
  }
  throw Object.assign(new Error("Trop de saisies simultanées, réessaie."), { statut: 409 });
}

const garder = (obj, champs) => Object.fromEntries(Object.entries(estObjet(obj) ? obj : {}).filter(([k]) => champs.includes(k)));

export default async (req) => {
  const s = magasin();
  const chemin = new URL(req.url).pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

  try {
    // ----- Lecture : tout ce qui a été saisi en ligne -----
    if (req.method === "GET" && chemin[0] === "donnees") {
      const { blobs } = await s.list({ prefix: "edition/" });
      const lus = await Promise.all(blobs.map(async (b) => [b.key.slice("edition/".length), await s.get(b.key, { type: "json" })]));
      const editions = Object.fromEntries(lus.filter(([, e]) => e));
      const joueurs = (await s.get("joueurs", { type: "json" })) || {};
      return rep({ editions, joueurs });
    }

    if (req.method !== "POST") return erreur("Adresse inconnue.", 404, "inconnu");
    const texte = await req.text();
    if (texte.length > 200000) return erreur("Données trop volumineuses.", 413, "trop");
    let corps;
    try { corps = JSON.parse(texte); } catch { return erreur("Requête illisible.", 400, "illisible"); }

    // ----- Enregistrer (créer ou compléter) un évènement -----
    if (chemin[0] === "edition" && ANNEE.test(chemin[1] || "")) {
      const patch = garder(corps, CHAMPS_EDITION);
      if (!Object.keys(patch).length) return erreur("Rien à enregistrer.", 400, "vide");
      const e = await mettreAJour(s, `edition/${chemin[1]}`, patch);
      return rep(e);
    }

    // ----- Ajouter ou renommer un joueur -----
    if (chemin[0] === "joueur" && ID_JOUEUR.test(chemin[1] || "")) {
      const j = garder(corps, CHAMPS_JOUEUR);
      if (j.name != null) j.name = String(j.name).slice(0, 40);
      const tous = await mettreAJour(s, "joueurs", { [chemin[1]]: j });
      return rep(tous);
    }

    return erreur("Adresse inconnue.", 404, "inconnu");
  } catch (err) {
    console.error(err);
    return erreur(err.statut === 409 ? err.message : "Problème sur le serveur. Réessaie dans un instant.", err.statut || 500, "serveur");
  }
};

export const config = { path: "/api/*" };

# Recopie data/historique.json à l'intérieur de index.html (entre les repères HISTORIQUE:DEBUT et HISTORIQUE:FIN).
# À relancer seulement si tu modifies data/historique.json :
#   clic droit sur ce fichier > Exécuter avec PowerShell
$dossier = Split-Path -Parent $MyInvocation.MyCommand.Path
$page = Join-Path $dossier "index.html"
$json = Get-Content -Raw -Encoding UTF8 (Join-Path $dossier "data\historique.json")
$null = $json | ConvertFrom-Json   # vérifie que le JSON est valide (arrête le script sinon)
$json = ($json -replace "\s*\r?\n\s*", " ").Trim().Replace("<", "<")
$html = Get-Content -Raw -Encoding UTF8 $page
$bloc = "<!-- HISTORIQUE:DEBUT (copie de data/historique.json, generee par integrer-historique.ps1) -->`n<script type=`"application/json`" id=`"historique`">$json</script>`n<!-- HISTORIQUE:FIN -->"
$nouveau = [regex]::Replace($html, "(?s)<!-- HISTORIQUE:DEBUT.*?<!-- HISTORIQUE:FIN -->", { param($m) $bloc })
if ($nouveau -eq $html) { Write-Host "Aucun changement (reperes introuvables ou historique identique)." } else {
  [IO.File]::WriteAllText($page, $nouveau, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "Historique integre dans index.html."
}

// ============================================
// GLOBALE FORTSCHRITTSBERECHNUNG
// ============================================

// Alle Checkbox-IDs aus allen Seiten
const ALL_CHECKPOINTS = [
  // PC-Tipps (6 Checkboxen)
  'checkpoint-autostart',
  'checkpoint-darkmode',
  'checkpoint-screenshot',
  'checkpoint-shortcuts',
  'checkpoint-updates',
  'checkpoint-bluetooth',
  
  // Rocket League (6 Checkboxen)
  'checkpoint-tutorial',
  'checkpoint-customize',
  'checkpoint-erstes-tor',
  'checkpoint-aerials',
  'checkpoint-match-win',
  'checkpoint-training'
];

// Funktion zum Berechnen des Gesamtfortschritts
function updateGlobalProgress() {
  let completed = 0;
  
  // Zähle alle abgehakten Checkboxen
  ALL_CHECKPOINTS.forEach(id => {
    if (localStorage.getItem(id) === 'true') {
      completed++;
    }
  });
  
  // Berechne Prozentsatz
  const total = ALL_CHECKPOINTS.length;
  const percentage = Math.round((completed / total) * 100);
  
  // Aktualisiere UI
  const percentElement = document.getElementById('progress-percent');
  const fillElement = document.getElementById('progress-fill');
  
  if (percentElement) {
    percentElement.textContent = `${percentage}%`;
  }
  
  if (fillElement) {
    fillElement.style.width = `${percentage}%`;
  }
  
  // Speichere für Legacy-Support
  localStorage.setItem('progress', percentage);
  
  return percentage;
}

// Beim Laden der Seite Fortschritt aktualisieren
document.addEventListener('DOMContentLoaded', () => {
  updateGlobalProgress();
  
  // Falls wir auf einer Unterseite sind: Event-Listener für Checkboxen
  document.querySelectorAll('.checkpoint-box').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateGlobalProgress();
    });
  });
});

// ============================================
// CHEAT-CODE FÜR GEHEIME ÜBERRASCHUNG
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    alert("🎉 GEHEIMNIS GEFUNDEN! \n\nHier ist ein besonderer Minecraft-Seed für dich: **'Philipp2023'** \n\nProbier ihn aus – dort versteckt sich etwas Cooles!");
  }
});

// ============================================
// PASSWORT FÜRS TAGEBUCH
// ============================================
function checkPasswort() {
  const passwort = prompt("🔒 Gib das Passwort ein (TTMM, z. B. 1512 für den 15. Dezember):");
  if (passwort !== "1112") { // ÄNDERE HIER ZU SEINEM GEBURTSDATUM (z.B. "1503" für 15. März)
    alert("❌ Falsches Passwort! Frag Papa/Mama um Hilfe.");
    return false;
  }
  return true;
}

// Tagebuch-Link sperren
document.addEventListener('DOMContentLoaded', () => {
  const tagebuchLink = document.getElementById('tagebuch-link');
  if (tagebuchLink) {
    tagebuchLink.addEventListener('click', (e) => {
      if (!checkPasswort()) {
        e.preventDefault();
      }
    });
  }
});

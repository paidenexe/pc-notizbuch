// Fortschritt aus localStorage laden (für den Balken oben)
document.addEventListener('DOMContentLoaded', () => {
  let progress = localStorage.getItem('progress') || 0;
  document.getElementById('progress-percent').textContent = `${progress}%`;
  document.getElementById('progress-fill').style.width = `${progress}%`;
});

// Cheat-Code für geheime Überraschung
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    alert("🎉 GEHEIMNIS GEFUNDEN! \n\nHier ist ein besonderer Minecraft-Seed für dich: **'Philipp2023'** \n\nProbier ihn aus – dort versteckt sich etwas Cooles!");
  }
});

// Passwort fürs Tagebuch (wird in tagebuch.html genutzt)
function checkPasswort() {
  const passwort = prompt("🔒 Gib das Passwort ein (TT.MM., z. B. 0101 für den 1. Januar):");
  if (passwort !== "TTMM") { // Hier sein Geburtsdatum eintragen (z. B. "1503" für 15. März)
    alert("❌ Falsches Passwort! Frag Papa/Mama um Hilfe.");
    return false;
  }
  return true;
}

// Fortschritt aus localStorage laden
let progress = localStorage.getItem('progress') || 0;
document.getElementById('progress-percent').textContent = `${progress}%`;
document.getElementById('progress-fill').style.width = `${progress}%`;

// Cheat-Code für geheime Seite
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    alert("🎉 GEHEIMNIS GEFUNDEN! Hier ist ein besonderer Minecraft-Seed: **123456789** (probier ihn aus!)");
  }
});

// Passwort für Tagebuch (wird später in tagebuch.html eingebaut)
const tagebuchLink = document.getElementById('tagebuch-link');
tagebuchLink.addEventListener('click', (e) => {
  const passwort = prompt("🔒 Gib das Passwort ein (Tipp: Dein Geburtsdatum in Zahlen, z. B. 1112):");
  if (passwort !== "1112") { // Hier sein Geburtsdatum eintragen (11.12. = 1112)
    e.preventDefault();
    alert("❌ Falsches Passwort! Frag [Dein Name] um Hilfe.");
  }
});

# pc-notizbuch

resources:

https://codepen.io/pen/?template=GRYjQjJ



    <!-- Footer -->
  <footer style="
    background-color: #3c3c3c;
    border-top: 4px solid #5a5a5a;
    border-bottom: 4px solid #2a2a2a;
    padding: 28px 20px;
    box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
    margin-top: 60px;
    font-family: 'Press Start 2P', cursive;
  ">
    <p style="
      color: #ffff55;
      font-size: 11px;
      text-shadow: 3px 3px 0 #3f3f00;
      line-height: 2;
      margin: 0 0 8px 0;
    ">🎮 LEVEL UP! Happy Birthday Philipp! 🎮</p>
    <p style="
      color: #55ff55;
      font-size: 8px;
      line-height: 1.5;
      margin: 0;
      text-shadow: 2px 2px 0 #003f00;
    ">Achievement Unlocked: Erster eigener PC • @Mosch • 2025</p>
  </footer>


<!-- Fortschrittsbalken auf der index.html -->
<script>
    // Scroll zu Section
    function scrollToSection(id) {
      document.getElementById(id).scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Fortschritt speichern und aktualisieren
    function updateProgress() {
      const checkboxes = document.querySelectorAll('.checkpoint-checkbox');
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      const total = checkboxes.length;
      const percentage = Math.round((checked / total) * 100);
      
      // Speichere lokalen Fortschritt (für diese Seite)
      const pageKey = document.body.getAttribute('data-page') || 'rocketleague'; // oder 'pctipps'
      localStorage.setItem(`${pageKey}-progress`, percentage);
      
      // Füge "completed" Klasse hinzu
      checkboxes.forEach(cb => {
        const item = cb.closest('.checkpoint-item');
        if (cb.checked) {
          item.classList.add('completed');
        } else {
          item.classList.remove('completed');
        }
      });

      // Speichere jeden Checkbox-Status einzeln
      checkboxes.forEach(cb => {
        localStorage.setItem(cb.id, cb.checked);
      });

      // ⭐ NEU: Trigger globale Funktion (falls vorhanden)
      if (typeof updateGlobalProgress === 'function') {
        updateGlobalProgress();
      }
    }

    // Lade gespeicherte Checkboxen
    document.addEventListener('DOMContentLoaded', () => {
      const checkboxes = document.querySelectorAll('.checkpoint-checkbox');
      checkboxes.forEach(cb => {
        const saved = localStorage.getItem(cb.id);
        if (saved === 'true') {
          cb.checked = true;
          cb.closest('.checkpoint-item').classList.add('completed');
        }
        
        // Update Progress on change
        cb.addEventListener('change', updateProgress);
      });
      
      // Initial progress update
      updateProgress();
    });
</script>

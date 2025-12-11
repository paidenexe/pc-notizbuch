// Smooth Scroll zu Sektionen
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Checkbox-System für PC-Tipps
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.checkpoint-box[data-checkpoint^="pctips-"]');
    
    // Lade gespeicherte Zustände
    checkboxes.forEach(checkbox => {
        const checkpoint = checkbox.dataset.checkpoint;
        const saved = localStorage.getItem(checkpoint);
        if (saved === 'true') {
            checkbox.checked = true;
        }
        
        // Speichere bei Änderung
        checkbox.addEventListener('change', function() {
            localStorage.setItem(checkpoint, this.checked);
            updateMainProgress(); // Aktualisiert Hauptfortschritt
        });
    });
});

// Aktualisiert den Fortschritt auf der Hauptseite
function updateMainProgress() {
    const allCheckpoints = [
        // Hauptseite Checkboxen
        'check-autostart', 'check-darkmode', 'check-screenshots', 
        'check-shortcuts', 'check-updates', 'check-bluetooth', 
        'check-tutorial', 'check-customize', 'check-firstgoal', 
        'check-aerials', 'check-win', 'check-training',
        // PC-Tipps Checkboxen
        'pctips-autostart', 'pctips-darkmode', 'pctips-screenshots',
        'pctips-shortcuts', 'pctips-updates', 'pctips-bluetooth'
    ];
    
    const completed = allCheckpoints.filter(id => 
        localStorage.getItem(id) === 'true'
    ).length;
    
    const percentage = Math.round((completed / allCheckpoints.length) * 100);
    
    // Speichere Prozentsatz
    localStorage.setItem('totalProgress', percentage);
}

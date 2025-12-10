/*
╔═══════════════════════════════════════════════════════════════════════════╗
║                        GLOBAL PROGRESS TRACKER                            ║
║              Verwaltet den Gesamtfortschritt über alle Seiten             ║
╚═══════════════════════════════════════════════════════════════════════════╝

FUNKTIONEN:
- Berechnet Fortschritt aus allen Unterseiten
- Aktualisiert den Balken auf index.html
- Speichert nichts selbst (nur lesen!)

VERWENDUNG:
- Wird auf index.html eingebunden
- Wird automatisch bei Seitenload ausgeführt
- Wird von page-tracker.js aufgerufen bei Änderungen

*/

// ============================================================================
// KONFIGURATION - Hier alle Seiten definieren
// ============================================================================

const PAGES = {
    pctipps: 'PC-Tipps',
    rocketleague: 'Rocket League',
    steinlabor: 'Steinlabor',
    minecraft: 'Minecraft',
    programmierlabor: 'Programmierlabor'
};

// ============================================================================
// HAUPT-FUNKTION: Globalen Fortschritt berechnen
// ============================================================================

/**
 * Berechnet den Gesamtfortschritt über alle Seiten
 * Liest aus localStorage und aktualisiert UI
 * @returns {Object} { percent: number, completed: number, total: number }
 */
function updateGlobalProgress() {
    let totalCheckpoints = 0;      // Gesamtzahl aller Checkboxen
    let completedCheckpoints = 0;  // Anzahl gecheckte Checkboxen
    
    // Durch alle definierten Seiten iterieren
    Object.keys(PAGES).forEach(pageName => {
        // Daten aus localStorage laden
        const pageData = localStorage.getItem(pageName);
        
        if (pageData) {
            try {
                const data = JSON.parse(pageData);
                
                // Checkboxen zählen
                totalCheckpoints += data.length;
                completedCheckpoints += data.filter(item => item.checked).length;
                
            } catch (error) {
                console.error(`Fehler beim Laden von ${pageName}:`, error);
            }
        }
    });
    
    // Prozentsatz berechnen (verhindert Division durch 0)
    const percentage = totalCheckpoints > 0 
        ? Math.round((completedCheckpoints / totalCheckpoints) * 100) 
        : 0;
    
    // UI aktualisieren (nur wenn Elemente existieren)
    updateProgressUI(percentage, completedCheckpoints, totalCheckpoints);
    
    // Ergebnis zurückgeben (für externe Nutzung)
    return {
        percent: percentage,
        completed: completedCheckpoints,
        total: totalCheckpoints
    };
}

// ============================================================================
// UI-UPDATE: Fortschrittsbalken und Text aktualisieren
// ============================================================================

/**
 * Aktualisiert alle UI-Elemente des Fortschrittsbalkens
 * @param {number} percentage - Fortschritt in Prozent (0-100)
 * @param {number} completed - Anzahl erledigte Checkboxen
 * @param {number} total - Gesamtanzahl Checkboxen
 */
function updateProgressUI(percentage, completed, total) {
    // Fortschrittsbalken (Füllung)
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    // Prozentanzeige
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = percentage + '%';
    }
    
    // Detailtext (z.B. "42 von 100 erledigt")
    const progressDetails = document.getElementById('progress-details');
    if (progressDetails) {
        progressDetails.textContent = `${completed} von ${total} Checkpoints erledigt`;
    }
}

// ============================================================================
// DEBUG-FUNKTION: Fortschritt in Konsole anzeigen
// ============================================================================

/**
 * Zeigt detaillierte Fortschritts-Info in der Konsole
 * Nützlich zum Debuggen
 */
function showProgressDebug() {
    console.log('=== FORTSCHRITTS-DEBUG ===');
    
    Object.keys(PAGES).forEach(pageName => {
        const pageData = localStorage.getItem(pageName);
        
        if (pageData) {
            const data = JSON.parse(pageData);
            const checked = data.filter(item => item.checked).length;
            const total = data.length;
            const percent = Math.round((checked / total) * 100);
            
            console.log(`${PAGES[pageName]}: ${checked}/${total} (${percent}%)`);
        } else {
            console.log(`${PAGES[pageName]}: Keine Daten`);
        }
    });
    
    const global = updateGlobalProgress();
    console.log(`\nGESAMT: ${global.completed}/${global.total} (${global.percent}%)`);
    console.log('========================');
}

// ============================================================================
// RESET-FUNKTION: Alle Fortschritte löschen
// ============================================================================

/**
 * Löscht ALLE gespeicherten Fortschritte
 * ACHTUNG: Kann nicht rückgängig gemacht werden!
 * @param {boolean} confirm - Sicherheitsabfrage (true = ohne Nachfrage)
 */
function resetAllProgress(confirm = false) {
    // Sicherheitsabfrage (falls nicht explizit bestätigt)
    if (!confirm) {
        const userConfirm = window.confirm(
            '⚠️ WARNUNG!\n\n' +
            'Wirklich ALLE Fortschritte löschen?\n' +
            'Dies kann nicht rückgängig gemacht werden!'
        );
        
        if (!userConfirm) {
            console.log('Reset abgebrochen.');
            return false;
        }
    }
    
    // Alle Seiten-Daten löschen
    Object.keys(PAGES).forEach(pageName => {
        localStorage.removeItem(pageName);
    });
    
    // UI zurücksetzen
    updateGlobalProgress();
    
    console.log('✅ Alle Fortschritte wurden gelöscht!');
    return true;
}

// ============================================================================
// AUTO-START: Beim Seitenload ausführen
// ============================================================================

/**
 * Initialisierung beim Seitenload
 * Wird automatisch ausgeführt, sobald DOM bereit ist
 */
function initGlobalProgress() {
    // Fortschritt sofort berechnen
    updateGlobalProgress();
    
    // Reset-Button verbinden (falls vorhanden)
    const resetButton = document.getElementById('reset-progress');
    if (resetButton) {
        resetButton.addEventListener('click', () => resetAllProgress());
    }
    
    console.log('✅ Global Progress Tracker geladen');
}

// Beim Laden der Seite automatisch starten
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalProgress);
} else {
    initGlobalProgress();
}

// ============================================================================
// EXPORT FÜR EXTERNE VERWENDUNG
// ============================================================================

// Diese Funktionen sind global verfügbar:
// - updateGlobalProgress()
// - showProgressDebug()
// - resetAllProgress()

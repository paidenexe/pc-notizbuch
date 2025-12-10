/*
╔═══════════════════════════════════════════════════════════════════════════╗
║                           PAGE TRACKER                                    ║
║            Verwaltet Checkboxen auf einzelnen Unterseiten                 ║
╚═══════════════════════════════════════════════════════════════════════════╝

FUNKTIONEN:
- Speichert Checkbox-Status in localStorage
- Lädt gespeicherten Status beim Seitenload
- Benachrichtigt global-progress.js bei Änderungen

VERWENDUNG:
Jede Unterseite braucht im <body>:
  <body data-page="pctipps">
  
Und im HTML:
  <script src="page-tracker.js"></script>

*/

// ============================================================================
// KLASSE: PageTracker - Verwaltet eine einzelne Seite
// ============================================================================

class PageTracker {
    /**
     * Konstruktor - Initialisiert Tracker für eine Seite
     * @param {string} pageName - Name der Seite (z.B. 'pctipps')
     */
    constructor(pageName) {
        this.pageName = pageName;           // Name der Seite
        this.checkboxes = [];               // Array aller Checkboxen
        this.data = this.loadData();        // Gespeicherte Daten laden
        
        this.initCheckboxes();              // Checkboxen initialisieren
        this.attachEventListeners();        // Event-Listener hinzufügen
        
        console.log(`✅ PageTracker initialisiert: ${pageName}`);
    }
    
    // ========================================================================
    // DATEN LADEN: Aus localStorage lesen
    // ========================================================================
    
    /**
     * Lädt gespeicherte Checkbox-Daten aus localStorage
     * @returns {Array} Array mit Checkbox-Objekten [{id, checked}, ...]
     */
    loadData() {
        const saved = localStorage.getItem(this.pageName);
        
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error(`Fehler beim Laden von ${this.pageName}:`, error);
                return [];
            }
        }
        
        return [];
    }
    
    // ========================================================================
    // DATEN SPEICHERN: In localStorage schreiben
    // ========================================================================
    
    /**
     * Speichert aktuelle Checkbox-Zustände in localStorage
     */
    saveData() {
        try {
            localStorage.setItem(this.pageName, JSON.stringify(this.data));
            console.log(`💾 ${this.pageName} gespeichert`);
        } catch (error) {
            console.error(`Fehler beim Speichern von ${this.pageName}:`, error);
        }
    }
    
    // ========================================================================
    // CHECKBOXEN INITIALISIEREN: Status aus localStorage setzen
    // ========================================================================
    
    /**
     * Findet alle Checkboxen auf der Seite und setzt gespeicherte Zustände
     */
    initCheckboxes() {
        // Alle Checkboxen mit class="checkpoint" finden
        this.checkboxes = Array.from(
            document.querySelectorAll('input[type="checkbox"].checkpoint')
        );
        
        console.log(`📋 ${this.checkboxes.length} Checkboxen gefunden`);
        
        // Jedem Checkbox eine ID geben (falls nicht vorhanden)
        this.checkboxes.forEach((checkbox, index) => {
            if (!checkbox.id) {
                checkbox.id = `checkpoint-${index}`;
            }
            
            // Gespeicherten Status wiederherstellen
            const savedItem = this.data.find(item => item.id === checkbox.id);
            if (savedItem) {
                checkbox.checked = savedItem.checked;
            } else {
                // Neues Checkbox-Item zu Daten hinzufügen
                this.data.push({
                    id: checkbox.id,
                    checked: false
                });
            }
        });
    }
    
    // ========================================================================
    // EVENT-LISTENER: Auf Checkbox-Änderungen reagieren
    // ========================================================================
    
    /**
     * Verbindet alle Checkboxen mit Event-Listenern
     */
    attachEventListeners() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });
    }
    
    /**
     * Wird aufgerufen wenn eine Checkbox geändert wird
     * @param {HTMLInputElement} checkbox - Die geänderte Checkbox
     */
    handleCheckboxChange(checkbox) {
        // Daten aktualisieren
        const item = this.data.find(item => item.id === checkbox.id);
        if (item) {
            item.checked = checkbox.checked;
        }
        
        // Speichern
        this.saveData();
        
        // Globalen Fortschritt aktualisieren (falls Funktion existiert)
        this.updateGlobalProgress();
        
        console.log(`✅ Checkbox "${checkbox.id}": ${checkbox.checked}`);
    }
    
    // ========================================================================
    // GLOBAL PROGRESS UPDATE: Benachrichtigt die Hauptseite
    // ========================================================================
    
    /**
     * Ruft updateGlobalProgress() auf (falls vorhanden)
     * Wird benötigt damit index.html den Balken aktualisiert
     */
    updateGlobalProgress() {
        if (typeof updateGlobalProgress === 'function') {
            updateGlobalProgress();
        }
    }
    
    // ========================================================================
    // STATISTIK: Fortschritt dieser Seite anzeigen
    // ========================================================================
    
    /**
     * Zeigt Statistik dieser Seite in der Konsole
     */
    showStats() {
        const total = this.data.length;
        const checked = this.data.filter(item => item.checked).length;
        const percent = Math.round((checked / total) * 100);
        
        console.log(`📊 ${this.pageName}:`);
        console.log(`   Erledigt: ${checked}/${total} (${percent}%)`);
    }
    
    // ========================================================================
    // RESET: Alle Checkboxen dieser Seite zurücksetzen
    // ========================================================================
    
    /**
     * Setzt alle Checkboxen dieser Seite zurück
     * @param {boolean} confirm - true = ohne Nachfrage löschen
     */
    reset(confirm = false) {
        if (!confirm) {
            const userConfirm = window.confirm(
                `Fortschritt von "${this.pageName}" löschen?`
            );
            if (!userConfirm) return;
        }
        
        // Alle Checkboxen unchecken
        this.checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Daten zurücksetzen
        this.data.forEach(item => {
            item.checked = false;
        });
        
        this.saveData();
        this.updateGlobalProgress();
        
        console.log(`🔄 ${this.pageName} zurückgesetzt`);
    }
}

// ============================================================================
// AUTO-START: Tracker automatisch initialisieren
// ============================================================================

/**
 * Initialisiert PageTracker automatisch beim Seitenload
 * Liest Seitennamen aus data-page Attribut
 */
function initPageTracker() {
    // Seitenname aus <body data-page="..."> lesen
    const pageName = document.body.dataset.page;
    
    if (!pageName) {
        console.warn('⚠️ Kein data-page Attribut gefunden!');
        console.log('Füge <body data-page="seitenname"> hinzu');
        return;
    }
    
    // Tracker erstellen (global verfügbar als window.tracker)
    window.tracker = new PageTracker(pageName);
}

// Beim Laden der Seite automatisch starten
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTracker);
} else {
    initPageTracker();
}

// ============================================================================
// GLOBALE FUNKTIONEN: Von außen verwendbar
// ============================================================================

// Diese Funktionen sind global verfügbar:
// - window.tracker.showStats()
// - window.tracker.reset()

// ============================================
// PAGE TRACKER - UNIVERSELLE VERSION
// ============================================

window.saveCheckpoints = null;
window.loadCheckpoints = null;

(function() {
    'use strict';

    // ===================================
    // 1. GLOBALE VARIABLEN
    // ===================================
    let checkpoints = [];

    // ===================================
    // 2. SEITENNAME ERMITTELN
    // ===================================
    const PAGE_NAME = document.body.dataset.page;
    
    if (!PAGE_NAME) {
        console.error('❌ FEHLER: data-page Attribut fehlt im <body>');
        return;
    }

    const STORAGE_KEY = `checkpoints_${PAGE_NAME}`;
    console.log(`📄 Seite geladen: ${PAGE_NAME}`);

    // ===================================
    // 3. CHECKPOINT-DATEN SAMMELN
    // ===================================
    function initCheckpoints() {
        const checkboxElements = document.querySelectorAll('input[type="checkbox"]');
     
        checkpoints = Array.from(checkboxElements).map(checkbox => {
            const id = checkbox.id;
            const label = document.querySelector(`label[for="${id}"]`);
            
            return {
                id: id,
                element: checkbox,
                label: label,
                completed: false,
                timestamp: null
            };
        });

        console.log(`✅ ${checkpoints.length} Checkboxen gefunden für ${PAGE_NAME}`);
    }

    // ===================================
    // 4. SPEICHERN & LADEN
    // ===================================
    
    function saveCheckpoints() {
        try {
            const data = checkpoints.map(cp => ({
                id: cp.id,
                completed: cp.completed,
                timestamp: cp.timestamp
            }));

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log(`💾 Gespeichert: ${STORAGE_KEY} (${data.filter(d => d.completed).length}/${data.length})`);

            // Trigger Storage Event für andere Tabs/Fenster
            localStorage.setItem('lastUpdate', Date.now().toString());
            
            // Globalen Fortschritt aktualisieren (falls Funktion verfügbar)
            if (typeof window.updateGlobalProgress === 'function') {
                window.updateGlobalProgress();
            }

        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
        }
    }

    function loadCheckpoints() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);

            if (!savedData) {
                console.log(`ℹ️ Keine gespeicherten Daten für ${PAGE_NAME}`);
                saveCheckpoints(); // Erstelle leere Datenstruktur
                return;
            }

            const data = JSON.parse(savedData);

            if (!Array.isArray(data)) {
                console.error('❌ Geladene Daten sind kein Array!');
                return;
            }

            // Wiederherstellen der gespeicherten Zustände
            data.forEach(saved => {
                const checkpoint = checkpoints.find(cp => cp.id === saved.id);
                if (checkpoint) {
                    checkpoint.completed = saved.completed || false;
                    checkpoint.timestamp = saved.timestamp || null;
                    checkpoint.element.checked = checkpoint.completed;

                    // Visuelles Feedback
                    if (checkpoint.completed && checkpoint.label) {
                        checkpoint.label.classList.add('completed');
                    }
                }
            });

            const completedCount = checkpoints.filter(cp => cp.completed).length;
            console.log(`✅ ${completedCount}/${checkpoints.length} Checkpoints geladen für ${PAGE_NAME}`);

            updateProgressDisplay();

        } catch (error) {
            console.error('❌ Fehler beim Laden:', error);
        }
    }

    // Globale Funktionen verfügbar machen
    window.saveCheckpoints = saveCheckpoints;
    window.loadCheckpoints = loadCheckpoints;

    // ===================================
    // 5. CHECKBOX-HANDLER
    // ===================================
    
    function handleCheckboxChange(event) {
        const checkboxId = event.target.id;
        const checkpoint = checkpoints.find(cp => cp.id === checkboxId);

        if (!checkpoint) {
            console.error(`❌ Checkpoint nicht gefunden: ${checkboxId}`);
            return;
        }

        // Zustand aktualisieren
        checkpoint.completed = event.target.checked;
        checkpoint.timestamp = Date.now();

        // Visuelles Feedback
        if (checkpoint.label) {
            if (checkpoint.completed) {
                checkpoint.label.classList.add('completed');
            } else {
                checkpoint.label.classList.remove('completed');
            }
        }

        console.log(`${checkpoint.completed ? '✅' : '⬜'} ${checkboxId}`);

        // Speichern & Fortschritt aktualisieren
        saveCheckpoints();
        updateProgressDisplay();
    }

    // ===================================
    // 6. FORTSCHRITTSANZEIGE AKTUALISIEREN
    // ===================================
    
    function updateProgressDisplay() {
        const total = checkpoints.length;
        const completed = checkpoints.filter(cp => cp.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Fortschrittsbalken auf dieser Seite
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${completed}/${total}`;
        }

        console.log(`📊 ${PAGE_NAME}: ${completed}/${total} (${percentage}%)`);


        return { total, completed, percentage };
    }

    // ===================================
    // 7. EVENT-LISTENER REGISTRIEREN
    // ===================================
    
    function attachEventListeners() {
        checkpoints.forEach(checkpoint => {
            checkpoint.element.addEventListener('change', handleCheckboxChange);
        });

        console.log(`🎧 Event-Listener für ${checkpoints.length} Checkboxen registriert`);
    }

    // ===================================
    // 8. INITIALISIERUNG
    // ===================================
    
    function init() {
        initCheckpoints();
        loadCheckpoints();
        attachEventListeners();

        console.log(`✅ ${PAGE_NAME} vollständig initialisiert`);
    }

    // ===================================
    // 9. AUTO-START
    // ===================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ============================================
// GLOBALE FORTSCHRITTSBERECHNUNG
// ============================================

(function() {
    'use strict';

    // ===================================
    // KONFIGURATION
    // ===================================
    const PAGES = [
        'minecraft',
        'rocketleague', 
        'pctipps',
        'programmierlabor',
        'steinlabor'
    ];
    
        const CHECKPOINT_COUNTS = {  // ← KORRIGIERT!
        'minecraft': 6,
        'rocketleague': 6,  // ← Du hast 2 im Log, nicht 6!
        'pctipps': 6,        // ← Du hast 2 im Log, nicht 6!
        'programmierlabor': 6,
        'steinlabor': 8
    };

    // ===================================
    // 1. GESAMTFORTSCHRITT BERECHNEN
    // ===================================
    function updateGlobalProgress() {
        let totalCheckpoints = 0;
        let completedCheckpoints = 0;

        PAGES.forEach(page => {
            const storageKey = `checkpoints_${page}`;
            
            // ✅ IMMER die Gesamtzahl addieren (auch wenn keine Daten vorhanden)
            const expectedCount = CHECKPOINT_COUNTS[page] || 0;
            totalCheckpoints += expectedCount;
            
            try {
                const rawData = localStorage.getItem(storageKey);
                
                // ✅ Wenn keine Daten: 0 abgehakte Checkpoints
                if (!rawData) {
                    console.warn(`⚠️ ${page}: Keine Daten (0/${expectedCount})`);
                    return; // completedCheckpoints bleibt bei 0
                }

                const data = JSON.parse(rawData);

                // ✅ Prüfe ob data ein Array ist
                if (!Array.isArray(data)) {
                    console.error(`❌ ${page}: Daten sind kein Array!`, data);
                    return;
                }

                // ✅ Zähle abgehakte Checkpoints
                const completed = data.filter(item => item.completed === true).length;
                completedCheckpoints += completed;

                console.log(`📊 ${page}: ${completed}/${expectedCount}`);

            } catch (error) {
                console.error(`❌ Fehler beim Laden von ${page}:`, error);
            }
        });

        // ===================================
        // 2. FORTSCHRITTSBALKEN AKTUALISIEREN
        // ===================================
        const percentage = totalCheckpoints > 0 
            ? Math.round((completedCheckpoints / totalCheckpoints) * 100) 
            : 0;

        // Elemente auf der index.html
        const progressBar = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-percent');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = percentage;  // ← OHNE "%"! (HTML hat schon ein "%")
        }

        console.log(`✅ Globaler Fortschritt: ${completedCheckpoints}/${totalCheckpoints} (${percentage}%)`);

        return {
            total: totalCheckpoints,
            completed: completedCheckpoints,
            percentage: percentage
        };
    }
    
    // ===================================
    // 3. EINZELNE SEITEN-FORTSCHRITTE
    // ===================================
    function updatePageProgress(pageName) {
        const storageKey = `checkpoints_${pageName}`;
        
        try {
            const rawData = localStorage.getItem(storageKey);
            
            if (!rawData) {
                console.warn(`⚠️ ${pageName}: Keine Daten gefunden`);
                return { total: 0, completed: 0, percentage: 0 };
            }

            const data = JSON.parse(rawData);

            if (!Array.isArray(data)) {
                console.error(`❌ ${pageName}: Ungültige Daten!`);
                return { total: 0, completed: 0, percentage: 0 };
            }

            const total = data.length;
            const completed = data.filter(item => item.completed === true).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            // ✅ Aktualisiere UI auf der jeweiligen Unterseite
            const progressBar = document.getElementById(`${pageName}-progress-bar`);
            const progressText = document.getElementById(`${pageName}-progress-text`);
            const progressCount = document.getElementById(`${pageName}-progress-count`);

            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }

            if (progressText) {
                progressText.textContent = `${percentage}%`;
            }

            if (progressCount) {
                progressCount.textContent = `${completed} / ${total}`;
            }

            return { total, completed, percentage };

        } catch (error) {
            console.error(`❌ Fehler bei ${pageName}:`, error);
            return { total: 0, completed: 0, percentage: 0 };
        }
    }

    // ===================================
    // 4. ALLE SEITEN-KARTEN AKTUALISIEREN
    // ===================================
    function updateAllPageCards() {
        PAGES.forEach(page => {
            const card = document.querySelector(`[data-page="${page}"]`);
            if (!card) return;

            const progress = updatePageProgress(page);

            // Aktualisiere Fortschrittsanzeige auf der Karte
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.progress-text');

            if (progressBar) {
                progressBar.style.width = `${progress.percentage}%`;
            }

            if (progressText) {
                progressText.textContent = `${progress.completed}/${progress.total}`;
            }
        });
    }

       // ===================================
    // 7. INITIALISIERUNG
    // ===================================
    
    function init() {
        const isIndexPage = document.getElementById('progress-fill') !== null;
        
        if (isIndexPage) {
            updateGlobalProgress();
            updateAllPageCards();
            
            // Storage-Änderungen überwachen
            window.addEventListener('storage', function(e) {
                if (e.key && e.key.startsWith('checkpoints_')) {
                    console.log('🔄 Checkpoint-Änderung erkannt');
                    updateGlobalProgress();
                    updateAllPageCards();
                }
            });
            
            // Polling für selben Tab (alle 2 Sekunden)
            setInterval(function() {
                updateGlobalProgress();
                updateAllPageCards();
            }, 2000);
        }
        
        console.log('✅ Global Progress initialisiert');
    }
    
    // ===================================
    // 8. GLOBALE VERFÜGBARKEIT
    // ===================================
    
    // Funktionen global verfügbar machen
    window.updateGlobalProgress = updateGlobalProgress;
    window.updateAllPageCards = updateAllPageCards;

    // ===================================
    // 9. AUTO-START
    // ===================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



// ===================================
// 7. STORAGE-ÄNDERUNGEN ÜBERWACHEN
// ===================================
window.addEventListener('storage', function(e) {
    if (e.key === 'lastUpdate') {
        console.log('🔄 Änderung erkannt - Update Fortschritt');
        updateGlobalProgress();
        updateAllPageCards();
    }
});

// Für selben Tab (storage event feuert nur bei anderen Tabs)
setInterval(function() {
    const isIndexPage = document.getElementById('progress-fill') !== null;
    if (isIndexPage) {
        updateGlobalProgress();
    }
}, 2000); // Alle 2 Sekunden prüfen

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
    
    const CHECKPOINT_COUNTS = {
        'minecraft': 6,
        'rocketleague': 6, 
        'pctipps': 6,
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
            
            try {
                const rawData = localStorage.getItem(storageKey);
                
                // ✅ FIX: Prüfe ob Daten existieren
                if (!rawData) {
                    console.warn(`⚠️ ${page}: Keine Daten im localStorage`);
                    return; // Überspringe diese Seite
                }

                const data = JSON.parse(rawData);

                // ✅ FIX: Prüfe ob data ein Array ist
                if (!Array.isArray(data)) {
                    console.error(`❌ ${page}: Daten sind kein Array!`, data);
                    return; // Überspringe diese Seite
                }

                // ✅ Zähle Checkpoints
                totalCheckpoints += data.length;
                completedCheckpoints += data.filter(item => item.completed === true).length;

                console.log(`📊 ${page}: ${data.filter(item => item.completed).length}/${data.length}`);

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
        const progressCount = document.getElementById('global-progress-count'); // Optional

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
        }

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }

        if (progressCount) {
            progressCount.textContent = `${completedCheckpoints} / ${totalCheckpoints}`;
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
    // 5. INITIALISIERUNG
    // ===================================
    function initGlobalProgress() {
        // Prüfe ob wir auf der index.html sind
        const isIndexPage = document.getElementById('global-progress-bar') !== null;

        if (isIndexPage) {
            console.log('📊 Index-Seite erkannt - Lade Gesamtfortschritt...');
            updateGlobalProgress();
            updateAllPageCards();
        } else {
            // Auf Unterseiten: Aktualisiere nur diese Seite
            const pageName = document.body.dataset.page;
            if (pageName) {
                console.log(`📄 Unterseite erkannt: ${pageName}`);
                updatePageProgress(pageName);
            }
        }
    }

    // ===================================
    // 6. GLOBALE FUNKTIONEN BEREITSTELLEN
    // ===================================
    window.updateGlobalProgress = updateGlobalProgress;
    window.updatePageProgress = updatePageProgress;
    window.updateAllPageCards = updateAllPageCards;

    // ===================================
    // 7. AUTO-START
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalProgress);
    } else {
        initGlobalProgress();
    }

    console.log('✅ global-progress.js geladen');

})();

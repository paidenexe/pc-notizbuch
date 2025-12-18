// ===================================
// PAGE TRACKER - UNIVERSELLE VERSION
// ===================================

(function() {
    'use strict';

    const pageName = document.body.dataset.page;
    if (!pageName) {
        console.error('⚠️ Fehler: data-page Attribut fehlt im <body>');
        return;
    }

    const storageKey = `checkpoints_${pageName}`;

    // ===================================
    // 1. CHECKBOXEN LADEN & INITIALISIEREN
    // ===================================
    function initCheckboxes() {
        const checkboxes = document.querySelectorAll('.checkpoint-checkbox');
        const savedData = loadProgress();

        checkboxes.forEach(checkbox => {
            const checkpointId = checkbox.dataset.checkpoint;
            if (!checkpointId) {
                console.warn('⚠️ Checkbox ohne data-checkpoint:', checkbox);
                return;
            }

            // ✅ Gespeicherten Status laden
            const saved = savedData.find(item => item.id === checkpointId);
            if (saved) {
                checkbox.checked = saved.completed;
            }

            // ✅ Event Listener für Checkbox
            checkbox.addEventListener('change', handleCheckboxChange);

            // ✅ Scroll-Funktion für Text daneben
            setupScrollListener(checkbox, checkpointId);
        });

        console.log(`✅ ${checkboxes.length} Checkboxen geladen für ${pageName}`);
    }

    // ===================================
    // 2. SCROLL-FUNKTION (UNIVERSELL)
    // ===================================
    function setupScrollListener(checkbox, checkpointId) {
        // Suche nach Label ODER Span daneben
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        const span = checkbox.nextElementSibling;

        const clickableElement = label || span;

        if (clickableElement) {
            clickableElement.style.cursor = 'pointer';
            
            clickableElement.addEventListener('click', (e) => {
                // Verhindere, dass Checkbox getriggert wird
                if (e.target !== checkbox) {
                    e.preventDefault();
                    scrollToSection(checkpointId);
                }
            });
        }
    }

    function scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            console.log(`📍 Scrolle zu: ${sectionId}`);
        } else {
            console.warn(`⚠️ Sektion nicht gefunden: ${sectionId}`);
        }
    }

    // ===================================
    // 3. CHECKBOX STATUS SPEICHERN
    // ===================================
    function handleCheckboxChange(e) {
        const checkbox = e.target;
        const checkpointId = checkbox.dataset.checkpoint;

        saveProgress(checkpointId, checkbox.checked);
        
        // ✅ Globalen Fortschritt aktualisieren
        if (typeof updateGlobalProgress === 'function') {
            updateGlobalProgress();
        }

        console.log(`💾 ${checkpointId}: ${checkbox.checked ? '✅' : '❌'}`);
    }

    // ===================================
    // 4. LOCALSTORAGE VERWALTUNG
    // ===================================
    function loadProgress() {
        try {
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Fehler beim Laden:', error);
            return [];
        }
    }

    function saveProgress(checkpointId, isCompleted) {
        let data = loadProgress();

        const existingIndex = data.findIndex(item => item.id === checkpointId);

        if (existingIndex !== -1) {
            data[existingIndex].completed = isCompleted;
        } else {
            data.push({
                id: checkpointId,
                completed: isCompleted,
                timestamp: Date.now()
            });
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`💾 Gespeichert: ${storageKey}`);
        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
        }
    }

    // ===================================
    // 5. INITIALISIERUNG
    // ===================================
    document.addEventListener('DOMContentLoaded', initCheckboxes);

})();

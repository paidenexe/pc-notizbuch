// page-tracker.js
// Verwaltet Checkboxen auf einzelnen Seiten

class PageTracker {
  constructor(pageName) {
    this.pageName = pageName;
    this.data = this.loadData();
    this.initCheckboxes();
    this.initScrollLabels();
  }

  loadData() {
    return JSON.parse(localStorage.getItem(this.pageName) || '{}');
  }

  saveData() {
    localStorage.setItem(this.pageName, JSON.stringify(this.data));
    
    // Trigger globale Progress-Aktualisierung
    if (typeof updateGlobalProgress === 'function') {
      updateGlobalProgress();
    }
  }

  initCheckboxes() {
    document.querySelectorAll('.checkpoint-checkbox').forEach(checkbox => {
      const key = checkbox.dataset.checkpoint;
      
      // Lade gespeicherten Status
      if (this.data[key]) {
        checkbox.checked = true;
        checkbox.closest('.checkpoint-item')?.classList.add('completed');
      }

      // Event Listener
      checkbox.addEventListener('change', () => {
        this.data[key] = checkbox.checked;
        this.saveData();
        
        // Styling aktualisieren
        const item = checkbox.closest('.checkpoint-item');
        if (checkbox.checked) {
          item?.classList.add('completed');
        } else {
          item?.classList.remove('completed');
        }
      });
    });
  }

  initScrollLabels() {
    document.querySelectorAll('[data-scroll]').forEach(label => {
      label.style.cursor = 'pointer';
      label.addEventListener('click', () => {
        const targetId = label.dataset.scroll;
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Automatische Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  const pageName = document.body.dataset.page;
  if (pageName) {
    new PageTracker(pageName);
    console.log(`📄 PageTracker initialisiert für: ${pageName}`);
  }
});

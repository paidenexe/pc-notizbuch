// page-tracker.js
// Verwaltet Checkboxen auf einzelnen Seiten

class PageTracker {
  constructor(pageName) {
    this.pageName = pageName;
    this.data = this.loadData();
    this.initCheckboxes();
  }

  loadData() {
    return JSON.parse(localStorage.getItem(this.pageName) || '{}');
  }

  saveData() {
    localStorage.setItem(this.pageName, JSON.stringify(this.data));
    this.updateGlobalProgress();
  }

  initCheckboxes() {
    document.querySelectorAll('.checkpoint-box').forEach(checkbox => {
      const id = checkbox.dataset.checkpoint;
      
      // Lade gespeicherten Status
      checkbox.checked = this.data[id] || false;
      
      // Event Listener
      checkbox.addEventListener('change', () => {
        this.data[id] = checkbox.checked;
        this.saveData();
        console.log(`✅ ${this.pageName} - ${id}: ${checkbox.checked}`);
      });
    });
    
    console.log(`📄 ${this.pageName} geladen:`, this.data);
  }

  updateGlobalProgress() {
    // Ruft die Funktion aus global-progress.js auf
    if (typeof updateGlobalProgress === 'function') {
      updateGlobalProgress();
    }
  }
}

// Automatische Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  const pageName = document.body.dataset.page;
  if (pageName) {
    new PageTracker(pageName);
  }
});

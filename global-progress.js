// global-progress.js
// Berechnet den Gesamtfortschritt über alle Seiten

function updateGlobalProgress() {
  const pages = ['pctipps', 'rocketleague', 'steinlabor', 'minecraft', 'programmierlabor'];
  
  let totalCheckpoints = 0;
  let completedCheckpoints = 0;

  pages.forEach(page => {
    const pageData = JSON.parse(localStorage.getItem(page) || '{}');
    const checkpoints = Object.keys(pageData);
    
    totalCheckpoints += checkpoints.length;
    completedCheckpoints += checkpoints.filter(key => pageData[key]).length;
  });

  const percentage = totalCheckpoints > 0 
    ? Math.round((completedCheckpoints / totalCheckpoints) * 100) 
    : 0;

  localStorage.setItem('global-progress', percentage);
  console.log(`🔄 Global Progress aktualisiert: ${percentage}% (${completedCheckpoints}/${totalCheckpoints})`);
  
  return percentage;
}

// Wird von index.html beim Laden aufgerufen
function loadGlobalProgress() {
  const progress = localStorage.getItem('global-progress') || 0;
  
  const percentElement = document.getElementById('progress-percent');
  const fillElement = document.getElementById('progress-fill');
  
  if (percentElement && fillElement) {
    percentElement.textContent = `${progress}%`;
    fillElement.style.width = `${progress}%`;
    console.log(`📊 Hauptseite lädt: ${progress}%`);
  }
}

// Automatisch beim Laden ausführen
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGlobalProgress);
} else {
  loadGlobalProgress();
}

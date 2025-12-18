// celebration.js - Konfetti & Belohnung bei 100%

function checkForCompletion() {
  const progress = JSON.parse(localStorage.getItem('pageProgress') || '{}');
  
  // Berechne Gesamtfortschritt
  let totalTasks = 0;
  let completedTasks = 0;
  
  for (let page in progress) {
    totalTasks += progress[page].total;
    completedTasks += progress[page].completed;
  }
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Wenn 100% erreicht und noch nicht gefeiert
  if (percentage === 100 && !localStorage.getItem('celebration-shown')) {
    triggerCelebration();
    localStorage.setItem('celebration-shown', 'true');
  }
  
  // Reset wenn wieder unter 100%
  if (percentage < 100 && localStorage.getItem('celebration-shown')) {
    localStorage.removeItem('celebration-shown');
  }
}

function triggerCelebration() {
  // Konfetti-Animation
  createConfetti();
  
  // Belohnungs-Modal nach 1 Sekunde
  setTimeout(() => {
    showRewardModal();
  }, 1000);
}

function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
  const confettiCount = 150;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(confetti);
    
    // Entferne Konfetti nach Animation
    setTimeout(() => confetti.remove(), 5000);
  }
}

function showRewardModal() {
  const modal = document.createElement('div');
  modal.className = 'reward-modal';
  modal.innerHTML = `
    <div class="reward-content">
      <h2 class="reward-title">🏆 UNGLAUBLICH! 🏆</h2>
      <p class="reward-text">
        Du hast <strong>ALLE Aufgaben</strong> gemeistert!<br>
        Das ist eine <strong>brillante Leistung</strong>! 🌟
      </p>
      
      <div class="reward-box">
        <h3>🎁 Deine Belohnung:</h3>
        <p><strong>Ein legendärer Minecraft-Seed!</strong></p>
        <div class="seed-box">
          <code class="seed-code">-1232260339</code>
          <button class="copy-seed-btn" onclick="copySeed('-1232260339')">📋 Kopieren</button>
        </div>
        <p class="seed-description">
          🏔️ <strong>Spawn:</strong> Gigantisches Dorf mit Schmiede<br>
          💎 <strong>Diamanten</strong> direkt unter dem Spawn (Y: -54)<br>
          🏰 <strong>Tempel</strong> & <strong>Festung</strong> in der Nähe<br>
          🌊 <strong>Korallen-Riff</strong> + <strong>Schiffswrack</strong> mit Schatz
        </p>
      </div>
      
      <button class="reward-close-btn" onclick="closeRewardModal()">
        ✨ Danke! Ich probiere es aus! ✨
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Animation starten
  setTimeout(() => modal.classList.add('show'), 10);
}

function copySeed(seed) {
  navigator.clipboard.writeText(seed).then(() => {
    const btn = document.querySelector('.copy-seed-btn');
    btn.textContent = '✅ Kopiert!';
    btn.style.background = '#4caf50';
    setTimeout(() => {
      btn.textContent = '📋 Kopieren';
      btn.style.background = '';
    }, 2000);
  });
}

function closeRewardModal() {
  const modal = document.querySelector('.reward-modal');
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 300);
}

// Prüfe bei jedem Laden der Seite
document.addEventListener('DOMContentLoaded', checkForCompletion);

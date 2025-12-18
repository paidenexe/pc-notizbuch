// celebration.js - Konfetti OHNE Library
function checkForCompletion() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html' && currentPage !== '') return;
    
    const stats = JSON.parse(localStorage.getItem('completion-stats') || '{}');
    const allCompleted = Object.values(stats).every(val => val === 100);
    
    if (allCompleted && !localStorage.getItem('celebration-shown')) {
        localStorage.setItem('celebration-shown', 'true');
        startCelebration();
    }
}

function startCelebration() {
    console.log('🎉 Celebration started!');
    createConfetti();
    setTimeout(() => showRewardModal(), 2000);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
            animation-delay: ${Math.random() * 2}s;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function showRewardModal() {
    const modal = document.createElement('div');
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
}

// Auto-Check beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForCompletion);
} else {
    checkForCompletion();
}

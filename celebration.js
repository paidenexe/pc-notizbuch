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
    modal.id = 'reward-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="reward-content" style="background:#1a1a2e;padding:40px;border-radius:15px;max-width:600px;box-shadow:0 0 50px rgba(0,255,255,0.3);text-align:center;">
            <h2 class="reward-title" style="color:#0ff;font-size:42px;margin:0 0 20px 0;">🏆 UNGLAUBLICH! 🏆</h2>
            <p class="reward-text" style="color:#fff;font-size:18px;line-height:1.6;">
                Du hast <strong>ALLE Aufgaben</strong> gemeistert!<br>
                Das ist eine <strong>brillante Leistung</strong>! 🌟
            </p>
            
            <div class="reward-box" style="background:#0a0a15;padding:25px;border-radius:10px;margin:25px 0;">
                <h3 style="color:#0ff;margin:0 0 15px 0;">🎁 Deine Belohnung:</h3>
                <p style="color:#fff;margin:10px 0;"><strong>Ein legendärer Minecraft-Seed!</strong></p>
                <div class="seed-box" style="background:#000;padding:15px;border-radius:8px;margin:15px 0;">
                    <code class="seed-code" style="color:#0ff;font-size:24px;font-weight:bold;">-1232260339</code>
                    <button class="copy-seed-btn" onclick="copySeed('-1232260339')" style="display:block;margin:10px auto 0;padding:10px 20px;background:#0ff;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">📋 Kopieren</button>
                </div>
                <p class="seed-description" style="color:#aaa;font-size:14px;line-height:1.8;text-align:left;margin-top:15px;">
                    🏔️ <strong>Spawn:</strong> Gigantisches Dorf mit Schmiede<br>
                    💎 <strong>Diamanten</strong> direkt unter dem Spawn (Y: -54)<br>
                    🏰 <strong>Tempel</strong> & <strong>Festung</strong> in der Nähe<br>
                    🌊 <strong>Korallen-Riff</strong> + <strong>Schiffswrack</strong> mit Schatz
                </p>
            </div>
            
            <button class="reward-close-btn" onclick="closeRewardModal()" style="padding:15px 40px;background:#ff0080;border:none;border-radius:8px;color:#fff;font-size:16px;cursor:pointer;font-weight:bold;">
                ✨ Danke! Ich probiere es aus! ✨
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copySeed(seed) {
    navigator.clipboard.writeText(seed).then(() => {
        const btn = event.target;
        btn.textContent = '✓ Kopiert!';
        btn.style.background = '#00ff00';
        setTimeout(() => {
            btn.textContent = '📋 Kopieren';
            btn.style.background = '#0ff';
        }, 2000);
    });
}

function closeRewardModal() {
    const modal = document.getElementById('reward-modal');
    if (modal) modal.remove();
}

// Auto-Check beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForCompletion);
} else {
    checkForCompletion();
}

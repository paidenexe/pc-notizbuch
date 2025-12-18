let celebrationShown = localStorage.getItem('celebration-shown') === 'true';

// ⭐ NEU: Lausche auf localStorage-Änderungen
window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('checkpoints_')) {
        console.log('🔔 Checkpoint geändert, prüfe Completion...');
        checkForCompletion();
    }
});

// ⭐ NEU: Lausche auf Checkbox-Klicks (falls auf derselben Seite)
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('.checkpoint-item')) {
        console.log('✅ Checkbox geklickt, prüfe Completion...');
        setTimeout(() => checkForCompletion(), 100); // Kurze Verzögerung
    }
});


// celebration.js - Konfetti OHNE Library
function checkForCompletion() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html' && currentPage !== '') return;
    
    const stats = JSON.parse(localStorage.getItem('completion-stats') || '{}');
    const allCompleted = Object.values(stats).every(val => val === 100);
    
    console.log('🔍 Check:', { allCompleted, stats }); // Debug
    
    if (allCompleted && !localStorage.getItem('celebration-shown')) {
        localStorage.setItem('celebration-shown', 'true');
        startCelebration();
    }
    
    // Reset wenn wieder unter 100%
    if (!allCompleted && localStorage.getItem('celebration-shown')) {
        localStorage.removeItem('celebration-shown');
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
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    modal.innerHTML = `
        <div class="reward-content" style="background:#1a1a2e;padding:40px;border-radius:20px;max-width:600px;text-align:center;box-shadow:0 0 50px rgba(255,0,128,0.5);animation:slideIn 0.5s;">
            <h2 style="color:#ff0080;font-size:48px;margin:0 0 20px 0;text-shadow:0 0 20px #ff0080;">🏆 UNGLAUBLICH! 🏆</h2>
            <p style="color:#fff;font-size:20px;line-height:1.6;margin-bottom:30px;">
                Du hast <strong style="color:#0ff;">ALLE Aufgaben</strong> gemeistert!<br>
                Das ist eine <strong style="color:#0ff;">brillante Leistung</strong>! 🌟
            </p>
            
            <div style="background:#0f0f1e;padding:30px;border-radius:15px;border:2px solid #ff0080;">
                <h3 style="color:#0ff;margin:0 0 15px 0;">🎁 Deine Belohnung:</h3>
                <p style="color:#fff;font-size:18px;margin-bottom:15px;"><strong>Ein legendärer Minecraft-Seed!</strong></p>
                <div style="background:#1a1a2e;padding:20px;border-radius:10px;margin:20px 0;">
                    <code style="color:#0ff;font-size:32px;font-weight:bold;letter-spacing:2px;">-1232260339</code>
                    <button onclick="copySeed('-1232260339')" style="display:block;margin:15px auto 0;padding:12px 30px;background:#0ff;border:none;border-radius:8px;color:#000;font-size:16px;cursor:pointer;font-weight:bold;">
                        📋 Kopieren
                    </button>
                </div>
                <p style="color:#aaa;font-size:14px;line-height:1.8;text-align:left;margin-top:15px;">
                    🏔️ <strong>Spawn:</strong> Gigantisches Dorf mit Schmiede<br>
                    💎 <strong>Diamanten</strong> direkt unter dem Spawn (Y: -54)<br>
                    🏰 <strong>Tempel</strong> & <strong>Festung</strong> in der Nähe<br>
                    🌊 <strong>Korallen-Riff</strong> + <strong>Schiffswrack</strong> mit Schatz
                </p>
            </div>
            
            <button onclick="closeRewardModal()" style="margin-top:30px;padding:15px 40px;background:#ff0080;border:none;border-radius:8px;color:#fff;font-size:16px;cursor:pointer;font-weight:bold;">
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

// ⭐ NEU: Check auch wenn localStorage sich ändert!
window.addEventListener('storage', checkForCompletion);

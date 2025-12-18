// celebration.js - MIT UMFANGREICHEM DEBUG

console.log('🎬 celebration.js wird geladen...');

// Event Listeners
window.addEventListener('storage', function(e) {
    console.log('🔔 Storage-Event:', e.key);
    if (e.key && e.key.startsWith('checkpoints_')) {
        console.log('✅ Checkpoints geändert, prüfe Completion...');
        checkForCompletion();
    }
});

// ⭐ Warte 3 Sekunden bevor geprüft wird
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOMContentLoaded gefeuert');
    
    setTimeout(() => {
        console.log('⏰ 3 Sekunden vorbei - prüfe jetzt Completion');
        checkForCompletion();
    }, 3000);
});

// Storage-Event bleibt gleich
window.addEventListener('storage', function(e) {
    console.log('🔔 Storage-Event:', e.key);
    if (e.key && e.key.startsWith('checkpoints_')) {
        console.log('✅ Checkpoints geändert, prüfe Completion...');
        setTimeout(() => checkForCompletion(), 500);
    }
});

console.log('✅ celebration.js vollständig geladen');


// Fallback falls Event verpasst wurde
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('🔄 Load-Fallback nach 1s');
        checkForCompletion();
    }, 1000);
});

function checkForCompletion() {
    console.log('🔍 checkForCompletion() aufgerufen');
    
    const currentPage = window.location.pathname.split('/').pop();
    console.log('📄 Aktuelle Seite:', currentPage);
    
    if (currentPage !== 'index.html' && currentPage !== '') {
        console.log('❌ Nicht auf index.html - abgebrochen');
        return;
    }
    
    setTimeout(() => {
        const pages = ['minecraft', 'rocketleague', 'pctipps', 'programmierlabor', 'steinlabor'];
        const allCompleted = pages.every(page => {
            const data = JSON.parse(localStorage.getItem(`checkpoints_${page}`) || '[]');
            const total = data.length;
            const checked = data.filter(cp => cp.completed === true).length;
            
            console.log(`   ${page}: ${checked}/${total}`);
            return total > 0 && checked === total;
        });
        
        console.log('🎯 Alle completed?', allCompleted);
        
        if (allCompleted) {
            console.log('🚀 STARTE CELEBRATION!');
            startCelebration();
        }
    }, 200);
}





function startCelebration() {
    console.log('🎉 startCelebration() aufgerufen');
    createConfetti();
    setTimeout(() => showRewardModal(), 2000);
}

function createConfetti() {
    console.log('🎊 createConfetti() aufgerufen');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const confettiCount = 200;
    
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
            animation: confetti-fall ${4 + Math.random() * 4}s linear forwards;
            animation-delay: ${Math.random() * 3}s;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 10000); // 10s statt 5s
    }
}


function showRewardModal() {
    console.log('🏆 showRewardModal() aufgerufen');
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
console.log('🚀 Registriere DOMContentLoaded...');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOMContentLoaded gefeuert');
        checkForCompletion();
    });
} else {
    console.log('📄 DOM bereits geladen');
    checkForCompletion();
}

console.log('✅ celebration.js vollständig geladen');

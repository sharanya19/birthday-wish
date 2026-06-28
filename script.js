/* ==========================================
   CONFIG & INITIALIZATION
   ========================================== */
// You can set a custom MP3 URL here if you'd like to use a specific song!
// If empty, the website will use a beautiful built-in synthesizer.
const CUSTOM_MP3_URL = "";

// Global state variables
let currentScene = "scene-loading";
let audioContext = null;
let synthIntervalId = null;
let synthGainNode = null;
let currentVolume = 0.15; // Soft volume to start
let customAudio = null;

// Canvas setup
const canvas = document.getElementById("animation-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrameId = null;
let activeAnimationType = "none"; // 'none', 'confetti', 'fireworks', 'hearts', 'finale'

// Stars variables
let showStars = false;
let canvasStars = [];
let shootingStars = [];

function initCanvasStars() {
    canvasStars = [];
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        canvasStars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 2.2 + 0.6,
            twinkleSpeed: Math.random() * 0.02 + 0.008,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
}
initCanvasStars();

// Handle resize
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ==========================================
   SCENE ROUTING SYSTEM
   ========================================== */
function showScene(sceneId) {
    const activeScene = document.querySelector(".scene.active");
    if (activeScene) {
        activeScene.classList.remove("active");
    }

    const nextScene = document.getElementById(sceneId);
    if (nextScene) {
        // Simple delay to ensure smooth transition
        setTimeout(() => {
            nextScene.classList.add("active");
            currentScene = sceneId;
            onSceneActive(sceneId);
        }, 100);
    }
}

// Scene activation callbacks
function onSceneActive(sceneId) {
    switch (sceneId) {
        case "scene-loading":
            setAnimationType("none");
            break;
        case "scene-permission":
            setAnimationType("none");
            break;
        case "scene-lights":
            setAnimationType("none");
            break;
        case "scene-decorating":
            // Set light confetti drop
            setAnimationType("confetti", 20); // Gentle confetti drop
            runDecoratingSequence();
            break;
        case "scene-reveal":
            setAnimationType("fireworks");
            // Show music button once reveal happens
            document.getElementById("music-control").classList.remove("hidden");
            break;
        case "scene-timeline":
            setAnimationType("none");
            break;
        case "scene-cake":
            setAnimationType("none");
            break;
        case "scene-bouquet":
            setAnimationType("hearts");
            break;
        case "scene-bucket-list":
            setAnimationType("none");
            break;
        case "scene-envelope":
            setAnimationType("none");
            break;
        case "scene-gallery":
            setAnimationType("confetti", 15);
            break;
        case "scene-finale":
            setAnimationType("finale");
            break;
    }
}

/* ==========================================
   WEB AUDIO SYNTHESIZER (ROMANTIC ATMOSPHERE)
   ========================================== */
function initAudio() {
    if (audioContext) return;

    // Check if custom MP3 is configured
    if (CUSTOM_MP3_URL) {
        customAudio = new Audio(CUSTOM_MP3_URL);
        customAudio.loop = true;
        customAudio.volume = currentVolume;
        customAudio.play().catch(e => console.log("Audio play blocked by browser:", e));
        return;
    }

    // Initialize Web Audio API Synthesizer
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        synthGainNode = audioContext.createGain();
        synthGainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);

        // Simple Delay/Echo effect node for romantic atmosphere
        const delay = audioContext.createDelay();
        delay.delayTime.value = 0.5;
        
        const feedback = audioContext.createGain();
        feedback.gain.value = 0.3;

        // Connect Delay Loop
        delay.connect(feedback);
        feedback.connect(delay);

        // Connect everything to destination
        synthGainNode.connect(audioContext.destination);
        synthGainNode.connect(delay);
        delay.connect(audioContext.destination);

        startMelodyGenerator();
    } catch (e) {
        console.error("Web Audio API not supported", e);
    }
}

// Romantic chord progression (Fmaj9 -> Cmaj9 -> Am9 -> Gsus4)
const chords = [
    [57, 60, 64, 67, 72], // Fmaj9 notes (A4, C5, E5, G5, C6)
    [60, 64, 67, 71, 74], // Cmaj9 notes (C5, E5, G5, B5, D6)
    [57, 60, 64, 67, 71], // Am9 notes (A4, C5, E5, G5, B5)
    [55, 59, 62, 67, 74]  // G6 notes (G4, B4, D5, G5, D6)
];

let chordIndex = 0;
let noteStep = 0;

function playSynthNote(midiNumber, duration, waveType = "sine", gainVal = 0.25) {
    if (!audioContext || audioContext.state === 'suspended') return;

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = waveType;
    const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Smooth envelope attack and release
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainVal, audioContext.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(synthGainNode);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

function startMelodyGenerator() {
    if (synthIntervalId) clearInterval(synthIntervalId);

    // Play a gentle, arpeggiated romantic ambient tune with warm bass notes
    synthIntervalId = setInterval(() => {
        if (!audioContext || audioContext.state === 'suspended') return;

        const currentChord = chords[chordIndex];
        
        // Bass Note on the downbeat of chord changes
        if (noteStep % 6 === 0) {
            playSynthNote(currentChord[0] - 12, 3.0, "triangle", 0.15); // soft warm bass note
        }

        // Soft arpeggiation pattern
        const noteIndex = [0, 2, 4, 3, 1, 2][noteStep % 6];
        const note = currentChord[noteIndex];

        // Randomly play octave offset for sparkling texture
        const octaveOffset = Math.random() > 0.85 ? (Math.random() > 0.5 ? 12 : -12) : 0;
        
        playSynthNote(note + octaveOffset, 2.0, "sine", 0.2);

        noteStep++;
        if (noteStep % 12 === 0) {
            chordIndex = (chordIndex + 1) % chords.length;
        }
    }, 550); // Slightly slower timing for a dreamier pace
}

function toggleAudio(forceState = null) {
    if (customAudio) {
        if (forceState === false || !customAudio.paused) {
            customAudio.pause();
            document.querySelector(".music-icon").classList.remove("active-playing");
        } else {
            customAudio.play();
            document.querySelector(".music-icon").classList.add("active-playing");
        }
        return;
    }

    if (!audioContext) return;

    if (forceState === false || audioContext.state === 'running') {
        audioContext.suspend();
        document.querySelector(".music-icon").classList.remove("active-playing");
    } else {
        audioContext.resume();
        document.querySelector(".music-icon").classList.add("active-playing");
    }
}

function adjustVolume(vol) {
    currentVolume = vol;
    if (customAudio) {
        customAudio.volume = vol;
    } else if (synthGainNode) {
        synthGainNode.gain.setValueAtTime(vol, audioContext.currentTime);
    }
}

/* ==========================================
   CANVAS ANIMATION ENGINE
   ========================================== */
class Particle {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type; // 'confetti', 'firework', 'heart'
        
        // Random velocities depending on particle type
        if (type === 'confetti') {
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = Math.random() * 2 + 1.5; // Slower, gentler fall
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 6;
            this.width = Math.random() * 7 + 5;
            this.height = Math.random() * 10 + 8;
        } else if (type === 'firework') {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.08;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.size = Math.random() * 2.5 + 1.5;
        } else if (type === 'heart') {
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = -(Math.random() * 2 + 1.5);
            this.size = Math.random() * 15 + 10;
            this.alpha = 1;
            this.decay = Math.random() * 0.005 + 0.005;
            this.swaySpeed = Math.random() * 0.05 + 0.02;
            this.swayValue = Math.random() * Math.PI;
        }
    }

    update() {
        if (this.type === 'confetti') {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        } else if (this.type === 'firework') {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.alpha -= this.decay;
        } else if (this.type === 'heart') {
            this.x += this.vx + Math.sin(this.swayValue) * 0.5;
            this.y += this.vy;
            this.swayValue += this.swaySpeed;
            this.alpha -= this.decay;
        }
    }

    draw() {
        if (this.type === 'confetti') {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else if (this.type === 'firework') {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (this.type === 'heart') {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Draw custom heart shapes on canvas
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size/2, topY, this.x - this.size, this.y - this.size/4, this.x, this.y + this.size*0.75);
            ctx.bezierCurveTo(this.x + this.size, this.y - this.size/4, this.x + this.size/2, topY, this.x, this.y);
            ctx.fill();
            ctx.restore();
        }
    }
}

// Particle colors
const confettiColors = ["#ff4d6d", "#ff758f", "#ffccd5", "#ffb703", "#2ec4b6", "#4cd964", "#007aff"];
const fireworkColors = ["#ff3b30", "#ffcc00", "#4cd964", "#5ac8fa", "#007aff", "#5856d6", "#ff2d55", "#fff"];
const heartColors = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffccd5", "#ffb703"];

function setAnimationType(type, maxCount = 70) {
    activeAnimationType = type;
    particles = [];

    // Create initial batch of particles for loop-based animations
    if (type === 'confetti') {
        for (let i = 0; i < maxCount; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, confettiColors[Math.floor(Math.random() * confettiColors.length)], 'confetti'));
        }
    }
}

// Animation Loop
function updateAnimations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw twinkling stars if showStars is active
    if (showStars) {
        canvasStars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const alpha = 0.25 + (Math.sin(star.twinklePhase) + 1) * 0.35; // smooth twinkling
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Occasional Shooting Star
        if (Math.random() < 0.008) {
            shootingStars.push({
                x: Math.random() * canvas.width * 0.5,
                y: Math.random() * canvas.height * 0.4,
                vx: Math.random() * 7 + 5,
                vy: Math.random() * 4 + 2,
                alpha: 1,
                decay: Math.random() * 0.03 + 0.02
            });
        }

        shootingStars = shootingStars.filter(s => s.alpha > 0);
        shootingStars.forEach(s => {
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + s.vx * 3.5, s.y + s.vy * 3.5);
            ctx.stroke();
            ctx.restore();

            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= s.decay;
        });
    }

    if (activeAnimationType === 'confetti') {
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    } else if (activeAnimationType === 'fireworks') {
        // Randomly launch fireworks
        if (Math.random() < 0.05) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.2;
            const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle(startX, startY, color, 'firework'));
            }
        }

        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    } else if (activeAnimationType === 'hearts') {
        // Randomly spawn floating hearts from bottom
        if (Math.random() < 0.06) {
            particles.push(new Particle(Math.random() * canvas.width, canvas.height + 20, heartColors[Math.floor(Math.random() * heartColors.length)], 'heart'));
        }

        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    } else if (activeAnimationType === 'finale') {
        // Spawn both fireworks, hearts, and falling confetti!
        if (Math.random() < 0.04) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.2;
            const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(startX, startY, color, 'firework'));
            }
        }
        if (Math.random() < 0.04) {
            particles.push(new Particle(Math.random() * canvas.width, canvas.height + 20, heartColors[Math.floor(Math.random() * heartColors.length)], 'heart'));
        }
        if (particles.filter(p => p.type === 'confetti').length < 30) {
            particles.push(new Particle(Math.random() * canvas.width, -20, confettiColors[Math.floor(Math.random() * confettiColors.length)], 'confetti'));
        }

        particles = particles.filter(p => p.alpha > 0 || p.type === 'confetti');
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }

    animationFrameId = requestAnimationFrame(updateAnimations);
}
// Start loop
updateAnimations();

/* ==========================================
   SCENE ACTION HANDLERS
   ========================================== */

// --- 1. Loading Screen ---
document.getElementById("btn-start").addEventListener("click", () => {
    initAudio();
    showScene("scene-permission");
});

// --- 2. Permission Step ---
let wrongCount = 0;
const noButton = document.getElementById("btn-no");
const yesButton = document.getElementById("btn-yes");
const wrongMsg = document.getElementById("wrong-answer-msg");

noButton.addEventListener("click", () => {
    wrongCount++;
    wrongMsg.classList.remove("hidden");
    
    // Sarcastic / funny movement scaling
    if (wrongCount >= 3) {
        noButton.style.position = "absolute";
        noButton.style.left = Math.random() * 70 + 15 + "%";
        noButton.style.top = Math.random() * 70 + 15 + "%";
    }
    
    // Scale YES button to make it extremely easy to click
    yesButton.style.transform = `scale(${1 + wrongCount * 0.25})`;
});

yesButton.addEventListener("click", () => {
    showScene("scene-lights");
});

// --- 3. Lights Off Scene ---
const lightSwitch = document.getElementById("lights-switch");
const decorateBtn = document.getElementById("btn-go-decorate");

lightSwitch.addEventListener("change", (e) => {
    if (e.target.checked) {
        document.body.classList.remove("light-mode");
        showStars = true; // Turn on sparkling stars in canvas
        
        // Increase music volume slightly for atmosphere
        adjustVolume(0.35);

        // Transition with timer delay
        setTimeout(() => {
            decorateBtn.classList.remove("hidden");
            decorateBtn.classList.add("pulse-btn");
        }, 2200);
    } else {
        showStars = false;
        decorateBtn.classList.add("hidden");
        adjustVolume(0.15);
    }
});

decorateBtn.addEventListener("click", () => {
    showScene("scene-decorating");
});

// --- 4. Decorating the Room ---
function runDecoratingSequence() {
    const textEl = document.getElementById("decorating-text");
    const bgDecor = document.getElementById("room-decorations-bg");
    const bunting = document.getElementById("room-bunting");
    const balloonBunch = document.getElementById("balloon-bunch");

    // Start assembly sequence
    bgDecor.style.display = "block";

    // Step 1: Lights string (0s)
    textEl.textContent = "Hanging up fairy lights... ✨";

    // Step 2: Banner garland (1.5s)
    setTimeout(() => {
        textEl.textContent = "Hanging Happy Birthday banner... 🏷️";
        bunting.classList.add("appear");
    }, 1500);

    // Step 3: Balloons (3.0s)
    setTimeout(() => {
        textEl.textContent = "Blowing up balloons... 🎈";
        balloonBunch.classList.add("appear");
    }, 3000);

    // Step 4: Final checks (4.5s)
    setTimeout(() => {
        textEl.textContent = "Almost ready... 💖";
    }, 4500);

    // Step 5: Transition to Reveal (6.0s)
    setTimeout(() => {
        showScene("scene-reveal");
    }, 6000);
}

// --- 5. Birthday Reveal ---
document.getElementById("btn-reveal-next").addEventListener("click", () => {
    showScene("scene-timeline");
});

// --- 6. Memory Timeline ---
document.getElementById("btn-timeline-next").addEventListener("click", () => {
    showScene("scene-cake");
});

// --- 7. Virtual Cake Cutting ---
const cakeKnife = document.getElementById("cake-knife");
const sliceLeft = document.getElementById("slice-left");
const sliceRight = document.getElementById("slice-right");
const candleFlame = document.getElementById("candle-flame");
const wishContainer = document.getElementById("wish-container");
const cutContainer = document.getElementById("cut-container");
const btnMakeWish = document.getElementById("btn-make-wish");
const btnBlowCandle = document.getElementById("btn-blow-candle");
const btnCutCake = document.getElementById("btn-cut-cake");
const feedingAnim = document.getElementById("feeding-animation-container");

btnMakeWish.addEventListener("click", () => {
    // Hide wish instruction, show cut instruction
    wishContainer.classList.add("hidden");
    cutContainer.classList.remove("hidden");
});

btnBlowCandle.addEventListener("click", () => {
    // Blow out candle flame
    if (candleFlame) candleFlame.style.display = "none";
    
    // Play puff of smoke animation
    triggerBlowOutPuff();
    
    // Update instructions
    document.getElementById("cake-instruction").textContent = "Fabulous! Now, click below to cut the cake! 🎂";
    
    // Toggle buttons
    btnBlowCandle.classList.add("hidden");
    btnCutCake.classList.remove("hidden");
});

btnCutCake.addEventListener("click", () => {
    // Cut animation
    cakeKnife.classList.add("cutting");
    btnCutCake.disabled = true;
    
    setTimeout(() => {
        sliceLeft.classList.add("sliced");
        sliceRight.classList.add("sliced");
        
        // Pop confetti burst
        triggerBurstConfetti();
        
        // Stagger to feeding & hugging cartoon video
        setTimeout(() => {
            document.querySelector(".cake-area").classList.add("hidden");
            btnCutCake.classList.add("hidden");
            
            // Hide banner and room decorations while video is playing
            document.getElementById("room-bunting").classList.remove("appear");
            document.getElementById("room-decorations-bg").style.display = "none";
            
            feedingAnim.classList.remove("hidden");
            
            // Start video playback
            const videoEl = document.getElementById("feeding-video");
            if (videoEl) {
                videoEl.load();
                videoEl.currentTime = 0;
                videoEl.play().catch(e => console.log("Video autoplay blocked:", e));
            }
        }, 1000);
    }, 1200);
});

// Manual progression from video to flower bouquet
document.getElementById("btn-feeding-next").addEventListener("click", () => {
    // Keep banner hidden, but bring back other decorations (fairy lights, balloons) for the rest of the surprise
    document.getElementById("room-decorations-bg").style.display = "block";
    showScene("scene-bouquet");
});

function triggerBlowOutPuff() {
    setAnimationType("confetti");
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.45;
    for (let i = 0; i < 35; i++) {
        const color = i % 2 === 0 ? "#ffffff" : "#e5e5e5";
        const p = new Particle(startX, startY, color, "confetti");
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = -Math.random() * 4 - 1.5; // Rise up
        p.width = Math.random() * 6 + 4;
        p.height = p.width;
        particles.push(p);
    }
}

function triggerBurstConfetti() {
    setAnimationType("confetti");
    // Trigger extra explosion particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height * 0.65, confettiColors[Math.floor(Math.random() * confettiColors.length)], 'confetti'));
    }
}

// --- 8. Flower Bouquet ---
document.getElementById("btn-bouquet-next").addEventListener("click", () => {
    showScene("scene-bucket-list");
});

// --- 9. Future Bucket List (Stacked Flashcard Deck) ---
const cards = document.querySelectorAll(".bucket-card");
const nextCardBtn = document.getElementById("btn-next-card");
const progressText = document.getElementById("deck-progress");
let activeCardIndex = 0;

function updateDeckVisuals() {
    cards.forEach((card, index) => {
        card.classList.remove("active-card", "card-behind-1", "card-behind-2", "slide-exit");
        
        if (index === activeCardIndex) {
            card.classList.add("active-card");
        } else if (index === activeCardIndex + 1) {
            card.classList.add("card-behind-1");
        } else if (index === activeCardIndex + 2) {
            card.classList.add("card-behind-2");
        } else if (index < activeCardIndex) {
            card.classList.add("slide-exit");
        }
    });

    progressText.textContent = `Card ${activeCardIndex + 1} of ${cards.length}`;
    
    if (activeCardIndex === cards.length - 1) {
        nextCardBtn.textContent = "Open Letter 💌";
    } else {
        nextCardBtn.textContent = "Next Card →";
    }
}

nextCardBtn.addEventListener("click", () => {
    if (activeCardIndex < cards.length - 1) {
        activeCardIndex++;
        updateDeckVisuals();
    } else {
        // Final card clicked -> Go to envelope scene
        showScene("scene-envelope");
    }
});

// Initialize deck visuals
updateDeckVisuals();

// --- 10. Envelope Step ---
const envelopeWrapper = document.getElementById("envelope-wrapper");
const letterContent = document.getElementById("letter-content");
const btnEnvelopeNext = document.getElementById("btn-envelope-next");

envelopeWrapper.addEventListener("click", () => {
    envelopeWrapper.classList.add("open");
    
    // Slow down music for emotional letter
    adjustVolume(0.12);
    
    // Transition after flap flips open and letter raises
    setTimeout(() => {
        envelopeWrapper.classList.add("hidden");
        letterContent.classList.remove("hidden");
        revealLetterLines();
    }, 1500);
});

function revealLetterLines() {
    const lines = document.querySelectorAll(".letter-line");
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add("show");
            if (index === lines.length - 1) {
                // Show final reveal button once letter finishes writing
                setTimeout(() => {
                    btnEnvelopeNext.classList.remove("hidden");
                }, 1000);
            }
        }, index * 2000); // 2 second delay per line
    });
}

btnEnvelopeNext.addEventListener("click", () => {
    showScene("scene-gallery");
});

// --- 11. Cute Memories Gallery ---
const galleryPhotos = [
    { src: "images/3 (1).jpg", caption: "Your silly smile that melts my heart... MD ❤️" },
    { src: "images/3 (2).jpg", caption: "Every moment with you is a treasure... 💖" },
    { src: "images/3 (3).jpg", caption: "The way you look at me... pure magic ✨" },
    { src: "images/3 (4).jpg", caption: "My favorite view in the whole world 🌍" },
    { src: "images/3 (5).jpg", caption: "Partners in fun, laughter, and everything 💑" },
    { src: "images/3 (6).jpg", caption: "So incredibly lucky to call you mine 🥰" },
    { src: "images/3 (7).jpg", caption: "Here's to making infinite more memories! 🥂" }
];
let currentGalleryIndex = 0;

const galleryPhotoEl = document.getElementById("gallery-photo");
const galleryCaptionEl = document.getElementById("gallery-caption");
const galleryProgressEl = document.getElementById("gallery-progress");
const btnGalleryPrev = document.getElementById("btn-gallery-prev");
const btnGalleryNext = document.getElementById("btn-gallery-next");

function updateGallery() {
    if (!galleryPhotoEl || !galleryCaptionEl || !galleryProgressEl) return;
    
    // Add brief fade-out before changing src for smooth transition
    galleryPhotoEl.style.opacity = 0;
    
    setTimeout(() => {
        galleryPhotoEl.src = galleryPhotos[currentGalleryIndex].src;
        galleryCaptionEl.textContent = galleryPhotos[currentGalleryIndex].caption;
        galleryProgressEl.textContent = `Photo ${currentGalleryIndex + 1} of ${galleryPhotos.length}`;
        galleryPhotoEl.style.opacity = 1;
        
        // Disable/enable back button
        if (currentGalleryIndex === 0) {
            btnGalleryPrev.disabled = true;
            btnGalleryPrev.style.opacity = 0.5;
        } else {
            btnGalleryPrev.disabled = false;
            btnGalleryPrev.style.opacity = 1;
        }
        
        // Update next button text on the last card
        if (currentGalleryIndex === galleryPhotos.length - 1) {
            btnGalleryNext.textContent = "Replay Surprise 🔄";
        } else {
            btnGalleryNext.textContent = "Next →";
        }
    }, 200);
}

// Initialize gallery state
updateGallery();

btnGalleryPrev.addEventListener("click", () => {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGallery();
    }
});

btnGalleryNext.addEventListener("click", () => {
    if (currentGalleryIndex < galleryPhotos.length - 1) {
        currentGalleryIndex++;
        updateGallery();
    } else {
        resetSurprise();
    }
});

// --- 12. Reset Surprise Function ---
function resetSurprise() {
    // Reset state
    wrongCount = 0;
    activeCardIndex = 0;
    showStars = false;
    currentGalleryIndex = 0;
    updateGallery();
    
    if (yesButton) yesButton.style.transform = "scale(1)";
    if (wrongMsg) wrongMsg.classList.add("hidden");
    if (lightSwitch) lightSwitch.checked = false;
    if (decorateBtn) decorateBtn.classList.add("hidden");
    
    // Reset Room Decor
    document.getElementById("room-decorations-bg").style.display = "none";
    document.getElementById("room-bunting").classList.remove("appear");
    document.getElementById("balloon-bunch").classList.remove("appear");

    // Reset Cake
    if (candleFlame) candleFlame.style.display = "block";
    cakeKnife.classList.remove("cutting");
    sliceLeft.classList.remove("sliced");
    sliceRight.classList.remove("sliced");
    wishContainer.classList.remove("hidden");
    cutContainer.classList.add("hidden");
    document.querySelector(".cake-area").classList.remove("hidden");
    if (btnBlowCandle) btnBlowCandle.classList.remove("hidden");
    if (btnCutCake) {
        btnCutCake.classList.add("hidden");
        btnCutCake.disabled = false;
    }
    document.getElementById("cake-instruction").textContent = "Now, blow out the candle first! 🌬️";
    feedingAnim.classList.add("hidden");
    const videoEl = document.getElementById("feeding-video");
    if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
    }
    
    // Reset Deck
    updateDeckVisuals();

    // Reset Envelope
    if (envelopeWrapper) {
        envelopeWrapper.classList.remove("open", "hidden");
    }
    if (letterContent) letterContent.classList.add("hidden");
    document.querySelectorAll(".letter-line").forEach(line => {
        line.classList.remove("show");
    });
    if (btnEnvelopeNext) btnEnvelopeNext.classList.add("hidden");
    
    showScene("scene-loading");
}

// Replay button listener (fallback null-guard)
const replayBtn = document.getElementById("btn-replay");
if (replayBtn) {
    replayBtn.addEventListener("click", resetSurprise);
}

// Music toggle controller
document.getElementById("music-toggle").addEventListener("click", () => {
    toggleAudio();
});


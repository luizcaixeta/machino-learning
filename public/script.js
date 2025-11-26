document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    let isLight = false;

    function applyTheme(light) {
        isLight = light;
        if (light) {
            body.classList.add('light-mode');
            if (themeBtn) themeBtn.textContent = "[ SWITCH: DARK ]";
        } else {
            body.classList.remove('light-mode');
            if (themeBtn) themeBtn.textContent = "[ SWITCH: LIGHT ]";
        }
        try {
            localStorage.setItem('theme', light ? 'light' : 'dark');
        } catch (_) {
            // ignore storage errors
        }
    }

    // Estado inicial: tenta recuperar do localStorage
    try {
        const stored = localStorage.getItem('theme');
        if (stored === 'light') {
            applyTheme(true);
        } else {
            applyTheme(false);
        }
    } catch (_) {
        applyTheme(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            applyTheme(!isLight);
        });
    }

    const textToType = "MACHINE_LEARNING_LOGS";
    const typeWriterElement = document.getElementById('typewriter');
    let charIndex = 0;

    function type() {
        if (!typeWriterElement) return;
        if (charIndex < textToType.length) {
            typeWriterElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100 + (Math.random() * 50 - 25));
        }
    }
    setTimeout(type, 500);

    const canvas = document.getElementById('neural-net-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        const scale = window.devicePixelRatio || 1;
        const containerSize = 160; 
        canvas.width = containerSize * scale;
        canvas.height = containerSize * scale;
        ctx.scale(scale, scale);
        
        const layers = [3, 4, 4, 2]; 
        const neurons = [];
        const layerGap = containerSize / (layers.length + 1);
        
        layers.forEach((count, layerIndex) => {
            const layerNeurons = [];
            const verticalGap = containerSize / (count + 1);
            for (let i = 0; i < count; i++) {
                layerNeurons.push({
                    x: layerGap * (layerIndex + 1),
                    y: verticalGap * (i + 1),
                    active: Math.random() > 0.5, 
                    timer: Math.random() * 100 
                });
            }
            neurons.push(layerNeurons);
        });

        function drawNetwork() {

            const style = getComputedStyle(document.body);
            const colorInactive = style.getPropertyValue('--color-dim').trim() || "#333";
            const colorActive = style.getPropertyValue('--color-accent').trim() || "#fff";
            const colorLine = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

            ctx.clearRect(0, 0, containerSize, containerSize);

            for (let l = 0; l < neurons.length - 1; l++) {
                neurons[l].forEach(n1 => {
                    neurons[l+1].forEach(n2 => {
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.strokeStyle = (n1.active && n2.active) ? (isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)") : colorLine;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    });
                });
            }

            neurons.forEach(layer => {
                layer.forEach(neuron => {
                    neuron.timer--;
                    if (neuron.timer <= 0) {
                        neuron.active = !neuron.active;
                        neuron.timer = 20 + Math.random() * 100;
                    }

                    ctx.beginPath();
                    ctx.arc(neuron.x, neuron.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = neuron.active ? colorActive : colorInactive;
                    ctx.fill();
                });
            });

            requestAnimationFrame(drawNetwork);
        }

        drawNetwork();
    }
});

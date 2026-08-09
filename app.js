let audioCtx;
let mediaStream;
let gainNode;
let isRunning = false;

const btnStart = document.getElementById('btnStart');
const controls = document.getElementById('controls');
const gainSlider = document.getElementById('gainSlider');
const gainVal = document.getElementById('gainVal');

btnStart.addEventListener('click', async () => {
    if (!isRunning) {
        try {
            // 1. Pedir permiso de micrófono al navegador
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // 2. Crear contexto de audio del navegador
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(mediaStream);
            
            // 3. Crear nodo de ganancia (amplificador)
            gainNode = audioCtx.createGain();
            gainNode.gain.value = gainSlider.value; // Nivel actual del slider

            // 4. Conectar: Micrófono -> Ganancia -> Altavoces/Auriculares
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            isRunning = true;
            btnStart.innerText = "APAGAR";
            btnStart.classList.add('active');
            controls.style.display = "block";

        } catch (err) {
            alert("Error al acceder al micrófono: " + err.message);
        }
    } else {
        // Apagar el procesador de audio
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        if (audioCtx) {
            audioCtx.close();
        }
        isRunning = false;
        btnStart.innerText = "ENCENDER";
        btnStart.classList.remove('active');
        controls.style.display = "none";
    }
});

// Cambiar la potencia en vivo cuando mueves el slider
gainSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    gainVal.innerText = val + 'x';
    if (gainNode) {
        gainNode.gain.value = val;
    }
});

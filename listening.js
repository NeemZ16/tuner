function genNotes() {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    let dict = {};
    
    for (let i = 0; i < 88; i++) {
        let noteIndex = i % 12;
        let octave = Math.floor((i + 9) / 12);
        let note = notes[noteIndex] + octave;
        let frequency = 440 * Math.pow(2, (i - 48) / 12);
        
        dict[note] = frequency.toFixed(2);
    }
    
    return dict;
}

let audioStream; // reference to audio stream
let listening = false;
const notesDict = genNotes();

const target = document.querySelector("#target-note");

function startTuner() {
    // start getting audio
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((stream) => {
                // mic allowed
                startBtn.classList.add("hidden");
                stopBtn.classList.remove("hidden");
                str6.classList.add("active");
                target.innerHTML = str6.innerHTML;
                audioStream = stream;
                listening = true;
                handleAudioStream(audioStream);
            })
            .catch((err) => {
                console.error(`you got an error: ${err}`);
            });
    } else {
        console.log("api not available");
    }
}

function stopTuner() {
    // stop audio stream
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
        listening = false;
    }

    // show start button
    target.innerHTML = "";
    startBtn.classList.remove("hidden");
    stopBtn.classList.add("hidden");

    // remove active str button class
    const activeBtn = document.querySelector(".str-btns .active");
    activeBtn.classList.remove("active");

    // reset canvas
    resetCanvas();
}

function handleAudioStream(stream) {
    const audioCtx = new AudioContext();
    const audioInput = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    const fftSize = 2 ** 13; // 16384
    audioCtx.sampleRate = 48000;

    // Connect the audio input stream to the analyser
    audioInput.connect(analyser);

    // Set up the analyser
    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // get frequency of audio in real time
    const sRate = audioCtx.sampleRate;
    function updateFrequencyData() {
        analyser.getByteFrequencyData(dataArray);

        // convert freq data to hz
        const idx = dataArray.indexOf(Math.max(...dataArray));
        const freq_hz = (idx * sRate) / fftSize;

        if (listening) {
            const target_freq = notesDict[target.innerHTML];
            canvasDrawFreq(freq_hz, target_freq);
            
            requestAnimationFrame(updateFrequencyData);
        }
    }

    // start processing real-time frequency data
    updateFrequencyData();
}
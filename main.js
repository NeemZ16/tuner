function onLoad() {
    resizeCanvas();
    generateCustomTable();
    loadTunings();
}

window.addEventListener('load', onLoad);
window.addEventListener('resize', resizeCanvas);

function generateCustomTable() {
    const defaultTuning = tunings["Standard"];

    // table column values by string
    const col6 = ["G#2", "G2", "F#2", "F2", "E2", "D#2", "D2", "C#2", "C2"];
    const col5 = ["C#3", "C3", "B2", "A#2", "A2", "G#2", "G2", "F#2", "F2"];
    const col4 = ["F#3", "F3", "E3", "D#3", "D3", "C#3", "C3", "B2", "A#2"];
    const col3 = ["B3", "A#3", "A3", "G#3", "G3", "F#3", "F3", "E3", "D#3"];
    const col2 = ["D#4", "D4", "C#4", "C4", "B3", "A#3", "A3", "G#3", "G3"];
    const col1 = ["G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"];

    let tbody_inner = "";

    for (let i = 0; i < col1.length; i++) {
        let s6 = `<td><button class='s6' row=${i}>${col6[i]}</button></td>\n`;
        let s5 = `<td><button class='s5' row=${i}>${col5[i]}</button></td>\n`;
        let s4 = `<td><button class='s4' row=${i}>${col4[i]}</button></td>\n`;
        let s3 = `<td><button class='s3' row=${i}>${col3[i]}</button></td>\n`;
        let s2 = `<td><button class='s2' row=${i}>${col2[i]}</button></td>\n`;
        let s1 = `<td><button class='s1' row=${i}>${col1[i]}</button></td>\n`;

        // set default tuning
        if (col6[i] == defaultTuning[6]) {s6 = `<td><button class='s6 active' row=${i}>${col6[i]}</button></td>\n`;}
        if (col5[i] == defaultTuning[5]) {s5 = `<td><button class='s5 active' row=${i}>${col5[i]}</button></td>\n`;}
        if (col4[i] == defaultTuning[4]) {s4 = `<td><button class='s4 active' row=${i}>${col4[i]}</button></td>\n`;}
        if (col3[i] == defaultTuning[3]) {s3 = `<td><button class='s3 active' row=${i}>${col3[i]}</button></td>\n`;}
        if (col2[i] == defaultTuning[2]) {s2 = `<td><button class='s2 active' row=${i}>${col2[i]}</button></td>\n`;}
        if (col1[i] == defaultTuning[1]) {s1 = `<td><button class='s1 active' row=${i}>${col1[i]}</button></td>\n`;}

        const tr = "<tr>\n" + s6 + s5 + s4 + s3 + s2 + s1 + "</tr>\n";
        tbody_inner += tr;
    }

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = tbody_inner;
    
    const tdBtn = document.querySelectorAll("td button");
    tdBtn.forEach(btn => btn.addEventListener('click', handleSelectCustom));
}

const startBtn = document.querySelector("#start-btn");
const stopBtn = document.querySelector("#stop-btn");
startBtn.addEventListener('click', startTuner);
stopBtn.addEventListener('click', stopTuner);

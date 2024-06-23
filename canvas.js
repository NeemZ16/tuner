const canvas = document.querySelector("#indicator");
const ctx = canvas.getContext("2d");

function canvasDrawMiddle() {
    // draw vertical line in middle of canvas
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 10);
    ctx.lineTo(canvas.width / 2, canvas.height - 10);
    ctx.stroke();
}

function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    canvasDrawMiddle();
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasDrawMiddle();
}

function canvasDrawFreq(freq, target) {
    resetCanvas();
    const diff = target - freq;
    const y = canvas.height / 2;
    let x = canvas.width / 2 - (diff);
    if (Math.abs(diff) > canvas.width / 2) {
        x = 0;
    }
    let r = 20;

    ctx.fillStyle = "#FFF";
    if (Math.abs(diff) < 40) {
        ctx.fillStyle = "#008800";
        r = 30;
    } else if (Math.abs(diff) < 100) {
        ctx.fillStyle = "#F4C41A";
        r = 25;
    }

    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}
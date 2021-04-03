let bubble = new Image();
bubble.src = "bubble.png";
let bubblee = new Image();
bubblee.src = "bubblee.png";

//Customizations
const textContent = "Sougata";
let effectSize = innerWidth / 140;
let textColor = "random"; //random or color code like #f0f
const fontStyle = "sans-serif"; // Font must be installed in your pc
const fontSize = 30;
const dotConnect = false;
const particleSize = 2;

// For making dynamic
const text = document.createElement("span");
text.classList.add("text");
document.body.appendChild(text);
const txt = document.querySelector(".text");
txt.innerText = textContent;
txt.style.position = "absolute";
txt.style.fontFamily = fontStyle;
txt.style.fontSize = `${fontSize}px`;
let height = txt.clientHeight;
let width = txt.clientWidth;
const spanText = document.querySelector(".text");
spanText.remove();
// end

const canvas = document.querySelector("#canvas2");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let bubblesArr = [];

let adjustX = (canvas.width - width * effectSize) / 2;
let adjustY = -20 + (canvas.height - height * effectSize) / 2;

let mouse = {
    x: undefined,
    y: undefined,
    radious: 100,
};
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener("touchmove", (e) => {
    mouse.x = e.changedTouches[0].clientX;
    mouse.y = e.changedTouches[0].clientY;
});
canvas.addEventListener("mouseleave", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    adjustX = (canvas.width - width * effectSize) / 2;
    adjustY = -20 + (canvas.height - height * effectSize) / 2;
    effectSize = innerWidth / 140;
    init();
});
ctx.fillStyle = "white";
ctx.font = `${fontSize}px ${fontStyle}`;
ctx.fillText(textContent, 0, 30);
const textCoordinates = ctx.getImageData(0, 0, width + 5, height + 5);

class Bubble {
    constructor() {
        this.radious = random(7, 12);
        this.x = random(canvas.width);
        this.y = random(innerHeight);
        this.speedX = random(-1, 1);
        this.speedY = random(-1.5, -0.5);
        this.type = random(0, 1) < 0.5 ? 1 : 2;
    }
    draw() {
        if (this.type == 1) {
            ctx.drawImage(
                bubble,
                0,
                0,
                256,
                251,
                this.x,
                this.y,
                this.radious,
                this.radious
            );
        } else if(this.type==2){
            ctx.drawImage(
                bubblee,
                0,
                0,
                250,
                250,
                this.x,
                this.y,
                this.radious,
                this.radious
            );
        }
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.x > canvas.width) this.x = -this.radious;
        if (this.x < -this.radious) this.x = canvas.width;
        // if (this.y > canvas.height) this.y = 0;
        if (this.y < -this.radious) this.y = canvas.height;
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = particleSize;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = random(10, 20);
        this.radious = 7;
        this.type = random(0, 1) < 0.5 ? 1 : 2;
    }
    draw() {
        ctx.beginPath();
        ctx.drawImage(
            bubblee,
            0,
            0,
            250,
            250,
            this.x,
            this.y,
            this.radious,
            this.radious
        );
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectioX = dx / distance;
        let forceDirectioY = dy / distance;
        let maxDistance = mouse.radious;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectioX * force * this.density;
        let directionY = forceDirectioY * force * this.density;
        if (distance < mouse.radious) {
            this.x -= directionX;
            this.y -= directionY;
            if (this.radious < 15) this.radious += 0.2;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
            if (this.radious > 7) this.radious -= 0.2;
        }
    }
}

function init() {
    bubblesArr = [];
    particleArray = [];
    for (let i = 0; i < 200; i++) {
        let bubbles = new Bubble();
        bubblesArr.push(bubbles);
    }
    for (let y = 0; y < textCoordinates.height; y++) {
        for (let x = 0; x < textCoordinates.width; x++) {
            if (
                textCoordinates.data[
                    y * 4 * textCoordinates.width + x * 4 + 3
                ] > 128
            ) {
                let positionX = x * effectSize + adjustX;
                let positionY = y * effectSize + adjustY;
                particleArray.push(new Particle(positionX, positionY));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    for (let i = 0; i < bubblesArr.length; i++) {
        connect();
        bubblesArr[i].draw();
        bubblesArr[i].update();
    }
    requestAnimationFrame(animate);
}
init();
animate();

function random(min, max) {
    if (max == undefined) {
        max = min;
        min = 0;
    }
    let a = Math.random() * (max - min) + min;
    return a;
}

function connect() {
    for (let i = 0; i < bubblesArr.length; i++) {
        let dx = bubblesArr[i].x - mouse.x;
        let dy = bubblesArr[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            ctx.strokeStyle = `rgba(0, 150, 200, 0.04)`;
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(
                bubblesArr[i].x + bubblesArr[i].radious / 2,
                bubblesArr[i].y + bubblesArr[i].radious / 2
            );
            ctx.stroke();
        }
    }
}

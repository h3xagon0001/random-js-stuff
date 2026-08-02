class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Particle {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

const canvasWidth = 800
const canvasHeight = 500
const canvasElement = document.getElementById("canvasElement");
const canvasContext = canvasElement.getContext("2d", { alpha: false })
const offscreenCanvas = new OffscreenCanvas(canvasWidth, canvasHeight)
const offscreenCanvasContext = offscreenCanvas.getContext("2d", { alpha: false })
const framerate = 60
const particleSize = 2
const dragCoeff = 0.05 // higher number mean more drag
const effectRadius = 50
const borderThickness = 50
const borderStrength = 10

canvasElement.width = canvasWidth
canvasElement.height = canvasHeight
offscreenCanvasContext.fillStyle = "white"
canvasElement.addEventListener("mousemove", getMousePos)
canvasElement.addEventListener("mouseleave", resetMousePos)
canvasElement.addEventListener("touchmove", getMousePos)

let particles = [];
let mousePos = new Vector2(-1, -1);
let prevMousePos = new Vector2(-1, -1);


function getMousePos(event) {
    if (event.type == "touchmove") {
        if (prevMousePos == new Vector2(-1, -1)) {
        prevMousePos.x = event.touches[0].pageX - canvasElement.offsetLeft
        prevMousePos.y = event.touches[0].pageY - canvasElement.offsetTop
        }
        else {
            prevMousePos.x = mousePos.x
            prevMousePos.y = mousePos.y
        }

        mousePos.x = event.touches[0].pageX - canvasElement.offsetLeft
        mousePos.y = event.touches[0].pageY - canvasElement.offsetTop
    }
    else {
        if (prevMousePos == new Vector2(-1, -1)) {
            prevMousePos.x = event.offsetX
            prevMousePos.y = event.offsetY
        }
        else {
            prevMousePos.x = mousePos.x
            prevMousePos.y = mousePos.y
        }

        mousePos.x = event.offsetX
        mousePos.y = event.offsetY
    }
}

function resetMousePos() {
    mousePos.x = -1
    mousePos.y = -1
}

function randInt(min, max) {
    return Math.round((max - min) * Math.random() + min)
}

function vectorFromTo(from, to) {
    return new Vector2(
        to.x - from.x,
        to.y - from.y
    )
}

function getDistanceFromTo(from, to) {
    return Math.sqrt(
        (from.x - to.x)**2 +
        (from.y - to.y)**2
    )
}

function getUnitVector(vector) {
    return new Vector2(
        vector.x / (getDistanceFromTo(new Vector2(0, 0), vector) + 1),
        vector.y / (getDistanceFromTo(new Vector2(0, 0), vector) + 1)
    )
}

function addParticle(x, y) {
    particles.push(new Particle(
        new Vector2(x, y),
        new Vector2(0, 0)
    ))
}

function updateCanvas() {
  setTimeout(() => {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    offscreenCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    updateParticles();
    drawParticles();

    canvasContext.drawImage(offscreenCanvas, 0, 0)
    updateCanvas();
  }, Math.round(1000 / framerate));
};


function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        if (mousePos.x != -1 && mousePos.y != -1) {
            if (getDistanceFromTo(particles[i].position, mousePos) <= effectRadius) {
                let unitVector = getUnitVector(vectorFromTo(prevMousePos, mousePos))
                let mouseMoveDistance = getDistanceFromTo(prevMousePos, mousePos)
                let distanceToMouse = getDistanceFromTo(particles[i].position, mousePos)

                if (mouseMoveDistance > 10) { mouseMoveDistance = 0 }

                particles[i].velocity.x += unitVector.x * mouseMoveDistance / (distanceToMouse + 20) * 5
                particles[i].velocity.y += unitVector.y * mouseMoveDistance / (distanceToMouse + 20) * 5
            }
        }

        particles[i].position.x += particles[i].velocity.x
        particles[i].position.y += particles[i].velocity.y

        if (particles[i].position.x < 0 + borderThickness) {
            particles[i].velocity.x += borderStrength / (particles[i].position.x)
        }
        else if (particles[i].position.x > canvasWidth - borderThickness) {
            particles[i].velocity.x -= borderStrength / (canvasWidth - particles[i].position.x)
        }

        if (particles[i].position.y < 0 + borderThickness) {
            particles[i].velocity.y += borderStrength / (particles[i].position.y)
        }
        else if (particles[i].position.y > canvasHeight - borderThickness) {
            particles[i].velocity.y -= borderStrength / (canvasHeight - particles[i].position.y)
        }

        particles[i].velocity.x -= particles[i].velocity.x * dragCoeff
        particles[i].velocity.y -= particles[i].velocity.y * dragCoeff

        if (particles[i].position.x < 0 ) {
            particles[i].position.x = 0
            particles[i].velocity.x = particles[i].velocity.x * -1
        }
        else if (particles[i].position.x > canvasWidth) {
            particles[i].position.x = canvasWidth
            particles[i].velocity.x = particles[i].velocity.x * -1
        }

        if (particles[i].position.y < 0) {
            particles[i].position.y = 0
            particles[i].velocity.y = particles[i].velocity.y * -1
        }
        else if (particles[i].position.y > canvasHeight) {
            particles[i].position.y = canvasHeight
            particles[i].velocity.y = particles[i].velocity.y * -1
        }
    }
}


function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
        offscreenCanvasContext.fillRect(
            particles[i].position.x - particleSize / 2,
            particles[i].position.y - particleSize / 2,
            particleSize, particleSize
        )
    }
}

for (let n = 0; n < 5000; n++) {
    addParticle(
        Math.round(randInt(borderThickness, canvasWidth - borderThickness)),
        Math.round(randInt(borderThickness, canvasHeight - borderThickness))
    )
}

updateCanvas()
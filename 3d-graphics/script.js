const charScreenElement = document.getElementById("charScreenElement");
const screenWidth = 4;
const screenHeight = 4;
const focalLength = 2;
const charScreenWidth = screenWidth * 20;
const charScreenHeight = screenHeight * 10;

let charScreen = [];
let solid = [];
let vertices = [];
let projectedVertices = [];


class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
};

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
};


function mapScreenToCharScreen(pos) {
    return new Vector2(
        Math.round(pos.x / screenWidth * charScreenWidth + (charScreenWidth / 2)),
        Math.round(pos.y / screenHeight * charScreenHeight + (charScreenHeight / 2))
    );
}

function projectVertice(pos) {
    let scalingFactor = focalLength / pos.z;
    return new Vector2(
        pos.x * scalingFactor,
        pos.y * scalingFactor
    );
};

function drawCube(size, pos) {
    let halfSize = size / 2;
    solid.push(new Vector3(pos.x - halfSize, pos.y - halfSize, pos.z - halfSize));
    solid.push(new Vector3(pos.x - halfSize, pos.y + halfSize, pos.z - halfSize));
    solid.push(new Vector3(pos.x + halfSize, pos.y + halfSize, pos.z - halfSize));
    solid.push(new Vector3(pos.x + halfSize, pos.y - halfSize, pos.z - halfSize));

    solid.push(new Vector3(pos.x - halfSize, pos.y - halfSize, pos.z + halfSize));
    solid.push(new Vector3(pos.x - halfSize, pos.y + halfSize, pos.z + halfSize));
    solid.push(new Vector3(pos.x + halfSize, pos.y + halfSize, pos.z + halfSize));
    solid.push(new Vector3(pos.x + halfSize, pos.y - halfSize, pos.z + halfSize));
};

function rotateVertice(pos, angle, axis, center) {
    let distance;
    let theta;
    let oldX = pos.x - center.x;
    let oldY = pos.y - center.y;
    let oldZ = pos.z - center.z;
    let x = oldX;
    let y = oldY;
    let z = oldZ;

    if (axis === "x") {
        x = oldX * Math.cos(angle) - oldZ * Math.sin(angle);
        z = oldZ * Math.cos(angle) + oldX * Math.sin(angle);
    }
    else if (axis === "y") {
        y = oldY * Math.cos(angle) - oldZ * Math.sin(angle);
        z = oldZ * Math.cos(angle) + oldY * Math.sin(angle);
    }
    else if (axis === "z") {
        y = oldY * Math.cos(angle) - oldX * Math.sin(angle);
        x = oldX * Math.cos(angle) + oldY * Math.sin(angle);
    }

            



    return new Vector3(x + center.x, y + center.y, z + center.z);
};

function initCharScreen() {
    for (let x = 0; x < charScreenWidth; x++) {
        let charCol = [];
        for (let y = 0; y < charScreenHeight; y++) {
            charCol.push(".");
        };
        charScreen.push(charCol);
    };
};

function clearCharScreen() {
    for (let x = 0; x < charScreenWidth; x++) {
        for (let y = 0; y < charScreenHeight; y++) {
            charScreen[x][y] = ".";
        };
    };
};


function renderCharScreen() {
    charScreenElement.innerHTML = "";
    projectedVertices = [];

    for (let i = 0; i < vertices.length; i++) {
        projectedVertices.push(projectVertice(vertices[i]));

        let pos = mapScreenToCharScreen(projectedVertices[i]);
        if (
            (pos.x > 0) &&
            (pos.x < charScreenWidth - 1) &&
            (pos.y > 0) &&
            (pos.y < charScreenHeight - 1)
        ) {
            charScreen[pos.x][pos.y] = i.toString();
        };
    };

    for (let y = 0; y < charScreenHeight; y++) {
        let rowElement = document.createElement("div");
        for (let x = 0; x < charScreenWidth; x++) {
            rowElement.textContent += charScreen[x][y];
        };
        charScreenElement.appendChild(rowElement);
    };
};

initCharScreen();

drawCube(2, new Vector3(0, 0, 3));

let rotation = 0;

(function loop() {
    setTimeout(() => {
        clearCharScreen();
        vertices = [];

        for (let i = 0; i < solid.length; i++) {
            let rotatedVertice = rotateVertice(solid[i], rotation, "x", new Vector3(0, 0, 3));
            rotatedVertice = rotateVertice(rotatedVertice, rotation, "y", new Vector3(0, 0, 3));
            rotatedVertice = rotateVertice(rotatedVertice, rotation, "z", new Vector3(0, 0, 3));
            
            if (rotatedVertice.z > 0) { vertices.push(rotatedVertice); }
        };

        renderCharScreen();

        rotation += Math.PI / 32;

        loop();
    }, 1000/24);
})();
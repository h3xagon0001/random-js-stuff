const charScreenElement = document.getElementById("charScreenElement");
const screenWidth = 3;
const screenHeight = 3;
const focalLength = 1;
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

function rotateVertice(pos, angle, center) {
    let distance;
    let theta;
    let x = pos.x - center.x;
    let y = pos.y - center.y;
    let z = pos.z - center.z;

    distance = Math.sqrt(x ** 2 + z ** 2);
    theta = Math.acos(x / distance) + angle.x;

    x = distance * Math.cos(theta) + center.x;
    if (z > 0) {
        z = distance * Math.sin(theta) + center.z;
    }
    else {
        z = center.z - distance * Math.sin(theta);
    }


    console.log(x, y, z)


    return new Vector3(x, y, z);
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
            charScreen[pos.x][pos.y] = "@";
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
            let rotatedVertice = rotateVertice(solid[i], new Vector3(rotation, 0, 0), new Vector3(0, 0, 3));
            if (rotatedVertice.z > 0) { vertices.push(rotatedVertice); }
        };

        renderCharScreen();

        rotation += Math.PI / 4;


        loop();
    }, 3000);
})();
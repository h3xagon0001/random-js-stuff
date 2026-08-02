const charScreenElement = document.getElementById("charScreenElement");
const charScreenWidth = 90;
const charScreenHeight = 30;
const screenWidth = 3;
const screenHeight = 1;


let charScreen = [];
let projectedVertices = [];

function mapScreenToCharScreen(pos) {
    return [
        Math.round(pos[0] / screenWidth * charScreenWidth + (charScreenWidth / 2)),
        Math.round(pos[1] / screenHeight * charScreenHeight + (charScreenHeight / 2))
    ]
}

function initCharScreen() {
    for (let x = 0; x < charScreenWidth; x++) {
        let charCol = [];
        for (let y = 0; y < charScreenHeight; y++) {
            charCol.push(".");
        };
        charScreen.push(charCol);
    };
};

function renderCharScreen() {
    charScreenElement.innerHTML = "";

    for (let i = 0; i < projectedVertices.length; i++) {
        let pos = mapScreenToCharScreen(projectedVertices[i]);
        charScreen[pos[0]][pos[1]] = "@"
    }

    for (let y = charScreenHeight - 1; y > 0 ; y--) {
        let rowElement = document.createElement("div");
        for (let x = 0; x < charScreenWidth; x++) {
            rowElement.textContent += charScreen[x][y];
        };
        charScreenElement.appendChild(rowElement);
    };
}

initCharScreen();

projectedVertices.push([0, 0])


renderCharScreen();



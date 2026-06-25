import R from "./ramda.js";
import GooseLudo from "./GooseLudo.js";


const game_board = document.getElementById("game_board");
let boardSVG = null;
let boardReady = false;

const boardCoords = {
    homePositions: {
        red: [
            { x: 125, y: 125 },
            { x: 225, y: 125 },
            { x: 125, y: 225 },
            { x: 225, y: 225 }
        ],
        yellow: [
            { x: 905, y: 905 },
            { x: 1005, y: 905 },
            { x: 905, y: 1005 },
            { x: 1005, y: 1005 }
        ],
        green: [
            { x: 125, y: 905 },
            { x: 225, y: 905 },
            { x: 125, y: 1005 },
            { x: 225, y: 1005 }
        ],
        blue: [
            { x: 905, y: 125 },
            { x: 1005, y: 125 },
            { x: 905, y: 225 },
            { x: 1005, y: 225 }
        ]
    },

    mainPath: [
        { x: 720, y: 1160 },
        { x: 720, y: 1100 },
        { x: 720, y: 1040 },
        { x: 720, y: 980 },
        { x: 720, y: 920 },
        { x: 720, y: 860 },
        { x: 720, y: 800 },
        { x: 720, y: 740 },

        { x: 740, y: 720 },
        { x: 800, y: 720 },
        { x: 860, y: 720 },
        { x: 920, y: 720 },
        { x: 980, y: 720 },
        { x: 1040, y: 720 },
        { x: 1100, y: 720 },

        { x: 1160, y: 720 },
        { x: 1160, y: 580 },

        { x: 1160, y: 460 },
        { x: 1100, y: 460 },
        { x: 1040, y: 460 },
        { x: 980, y: 460 },
        { x: 920, y: 460 },
        { x: 860, y: 460 },
        { x: 800, y: 460 },

        { x: 750, y: 460 },
        { x: 720, y: 440 },
        { x: 720, y: 380 },
        { x: 720, y: 320 },
        { x: 720, y: 260 },
        { x: 720, y: 200 },
        { x: 720, y: 140 },
        { x: 720, y: 80 },

        { x: 720, y: 20 },
        { x: 590, y: 20 },

        { x: 460, y: 20 },
        { x: 460, y: 80 },
        { x: 460, y: 140 },
        { x: 460, y: 200 },
        { x: 460, y: 260 },
        { x: 460, y: 320 },
        { x: 460, y: 380 },
        { x: 460, y: 440 },

        { x: 430, y: 460 },
        { x: 370, y: 460 },
        { x: 310, y: 460 },
        { x: 250, y: 460 },
        { x: 190, y: 460 },
        { x: 130, y: 460 },
        { x: 70, y: 460 },

        { x: 10, y: 460 },
        { x: 10, y: 590 },

        { x: 10, y: 720 },
        { x: 70, y: 720 },
        { x: 130, y: 720 },
        { x: 190, y: 720 },
        { x: 250, y: 720 },
        { x: 310, y: 720 },
        { x: 370, y: 720 },
        { x: 430, y: 720 },

        { x: 460, y: 740 },
        { x: 460, y: 800 },
        { x: 460, y: 860 },
        { x: 460, y: 920 },
        { x: 460, y: 980 },
        { x: 460, y: 1040 },
        { x: 460, y: 1100 },
        { x: 460, y: 1160 },
        { x: 580, y: 1160 }

    ],

    finalPath: {
        red: [
            { x: 590, y: 70 },
            { x: 590, y: 130 },
            { x: 590, y: 190 },
            { x: 590, y: 250 },
            { x: 590, y: 310 },
            { x: 590, y: 370 },
            { x: 590, y: 430 }
        ],
        yellow: [
            { x: 590, y: 1100 },
            { x: 590, y: 1040 },
            { x: 590, y: 980 },
            { x: 590, y: 920 },
            { x: 590, y: 860 },
            { x: 590, y: 800 },
            { x: 590, y: 740 }
        ],
        green: [
            { x: 70, y: 590 },
            { x: 130, y: 590 },
            { x: 190, y: 590 },
            { x: 250, y: 590 },
            { x: 310, y: 590 },
            { x: 370, y: 590 },
            { x: 430, y: 590 }

        ],
        blue: [
            { x: 740, y: 590 },
            { x: 800, y: 590 },
            { x: 860, y: 590 },
            { x: 920, y: 590 },
            { x: 980, y: 590 },
            { x: 1040, y: 590 },
            { x: 1100, y: 590 },
        ]
    },

    safeSquares: GooseLudo.safeSquares
};

const tokenFiles = {
    red: "redToken.svg",
    yellow: "yellowToken.svg",
    green: "greenToken.svg",
    blue: "blueToken.svg"
};

const tokenSize = 41;

const addHomeTokens = function () {
    if (!boardSVG) return;

    let tokenLayer = boardSVG.querySelector("#tokenLayer");
    if (!tokenLayer) {
        tokenLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        tokenLayer.setAttribute("id", "tokenLayer");
        boardSVG.appendChild(tokenLayer);
    }

    Object.entries(boardCoords.homePositions).forEach(([colour, positions]) => {
        positions.forEach((position, index) => {
            const tokenImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
            tokenImage.setAttribute("href", tokenFiles[colour]);
            tokenImage.setAttribute("width", tokenSize);
            tokenImage.setAttribute("height", tokenSize);
            tokenImage.setAttribute("x", position.x);
            tokenImage.setAttribute("y", position.y);
            tokenImage.setAttribute("class", `token ${colour}`);
            tokenImage.setAttribute("id", `token-${colour}-${index}`);
            tokenLayer.appendChild(tokenImage);
        });
    });
};


function loadBoardSVG() {
    return new Promise((resolve, reject) => {
        fetch("board.svg")
            .then(response => response.text())
            .then(svgContent => {
                document.getElementById("game_board").innerHTML = svgContent;
                boardSVG = document.getElementById("game_board").querySelector("svg");

                if (!boardSVG.getAttribute("viewBox")) {
                    boardSVG.setAttribute("viewBox", "0 0 1172 1172");
                }

                addHomeTokens();
                boardReady = true;
                resolve();
            })
            .catch(error => {
                console.error("Error loading SVG:", error);
                document.getElementById("game_board").innerHTML =
                    "<p style='color: red; '>Error loading board.svg</p>";
                reject(error);
            });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadBoardSVG();
    /* initializeUI();
    renderPieces();
    updateUI(); */
});

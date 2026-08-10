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
    }, // hundred by a hundred px

    mainPath: [ // +fifty seven horizontal -? high
        { x: 695, y: 1123 }, // one
        { x: 695, y: 1066 },
        { x: 695, y: 1009 },
        { x: 695, y: 948 },
        { x: 695, y: 895 },
        { x: 695, y: 838 },
        { x: 695, y: 780 },
        { x: 685, y: 723 },

        { x: 723, y: 685 },
        { x: 780, y: 695 },
        { x: 838, y: 695 },
        { x: 895, y: 695 },
        { x: 948, y: 695 },
        { x: 1009, y: 695 },
        { x: 1066, y: 695 },
        { x: 1123, y: 695 },

        { x: 1123, y: 565 },

        { x: 1123, y: 435 },
        { x: 1066, y: 435 },
        { x: 1009, y: 435 },
        { x: 948, y: 435 },
        { x: 895, y: 435 },
        { x: 838, y: 435 },
        { x: 780, y: 435 },

        { x: 723, y: 445 },
        { x: 685, y: 406 },
        { x: 695, y: 349 },
        { x: 695, y: 292 },
        { x: 695, y: 235 },
        { x: 695, y: 178 },
        { x: 695, y: 121 },
        { x: 695, y: 64 },

        { x: 695, y: 7 },
        { x: 565, y: 7 },

        { x: 435, y: 7 },

        { x: 435, y: 64 },
        { x: 435, y: 121 },
        { x: 435, y: 178 },
        { x: 435, y: 235 },
        { x: 435, y: 292 },
        { x: 435, y: 349 },
        { x: 445, y: 406 },

        { x: 406, y: 445 },
        { x: 349, y: 435 },
        { x: 292, y: 435 },
        { x: 235, y: 435 },
        { x: 172, y: 435 },
        { x: 121, y: 435 },
        { x: 64, y: 435 },

        { x: 7, y: 435 },
        { x: 7, y: 565 },

        { x: 7, y: 695 },
        { x: 64, y: 695 },
        { x: 121, y: 695 },
        { x: 172, y: 695 },
        { x: 235, y: 695 },
        { x: 292, y: 695 },
        { x: 349, y: 695 },
        { x: 406, y: 685 },

        { x: 445, y: 723 },
        { x: 435, y: 780 },
        { x: 435, y: 838 },
        { x: 435, y: 895 },
        { x: 435, y: 948 },
        { x: 435, y: 1009 },
        { x: 435, y: 1066 },
        { x: 435, y: 1123 },
        { x: 565, y: 1123 }

    ],

    finalPath: {
        red: [
            { x: 565, y: 64 },
            { x: 565, y: 121 },
            { x: 565, y: 178 },
            { x: 565, y: 235 },
            { x: 565, y: 292 },
            { x: 565, y: 349 },
            { x: 565, y: 406 }
        ],
        yellow: [
            { x: 565, y: 1066 },
            { x: 565, y: 1009 },
            { x: 565, y: 948 },
            { x: 565, y: 895 },
            { x: 565, y: 838 },
            { x: 565, y: 780 },
            { x: 565, y: 723 }
        ],
        green: [
            { x: 64, y: 565 },
            { x: 121, y: 565 },
            { x: 172, y: 565 },
            { x: 235, y: 565 },
            { x: 292, y: 565 },
            { x: 349, y: 565 },
            { x: 406, y: 565 }

        ],
        blue: [
            { x: 723, y: 565 },
            { x: 780, y: 565 },
            { x: 838, y: 565 },
            { x: 895, y: 565 },
            { x: 948, y: 565 },
            { x: 1009, y: 565 },
            { x: 1066, y: 565 }
        ]
    },

    endZones: {
        red: [
            { x: 565, y: 460 },
            { x: 510, y: 460 },
            { x: 620, y: 460 },
            { x: 565, y: 525 }
        ],
        yellow: [
            { x: 565, y: 665 },
            { x: 510, y: 665 },
            { x: 620, y: 665 },
            { x: 565, y: 615 }
        ],
        green: [
            { x: 460, y: 565 },
            { x: 460, y: 510 },
            { x: 460, y: 620 },
            { x: 525, y: 565 }
        ],
        blue: [
            { x: 665, y: 565 },
            { x: 665, y: 510 },
            { x: 665, y: 620 },
            { x: 615, y: 565 }
        ]
    },

    safeSquares: GooseLudo.safeSquares
};

const horizontalSquares = [1, 2, 3, 4, 5, 6, 7, 8,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
    60, 61, 62, 63, 64, 65, 66, 67, 68
];

const tokenFiles = {
    red: "assets/redToken.svg",
    yellow: "assets/yellowToken.svg",
    green: "assets/greenToken.svg",
    blue: "assets/blueToken.svg"
};

const tokenSize = 41;

const boardDotRadius = 6;

const createBoardDotElements = function () {
    if (!boardSVG) { return; }

    let dotLayer = boardSVG.querySelector("#dotLayer");
    if (!dotLayer) {
        dotLayer = document.createElementNS(
            "http://www.w3.org/2000/svg", "g");
        dotLayer.setAttribute("id", "dotLayer");
        boardSVG.appendChild(dotLayer);
    }

    const allBoardCoords = [];
    Object.values(boardCoords.homePositions).forEach((positions) => {
        allBoardCoords.push(...positions);
    });
    allBoardCoords.push(...boardCoords.mainPath);
    Object.values(boardCoords.finalPath).forEach((positions) => {
        allBoardCoords.push(...positions);
    });
    Object.values(boardCoords.endZones).forEach((positions) => {
        allBoardCoords.push(...positions);
    });

    allBoardCoords.forEach((coords, index) => {
        const dotId = `board-dot-${index}`;
        let dot = dotLayer.querySelector(`#${dotId}`);
        if (!dot) {
            dot = document.createElementNS(
                "http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("id", dotId);
            dot.setAttribute("class", "board-dot");
            dot.setAttribute("r", boardDotRadius);
            dot.setAttribute("fill", "#ffffff");
            dot.setAttribute("stroke", "#2f2f2f");
            dot.setAttribute("stroke-width", "2");
            dotLayer.appendChild(dot);
        }
        dot.setAttribute("cx", coords.x);
        dot.setAttribute("cy", coords.y);
    });
};

const createTokenElements = function () {
    if (!boardSVG) { return; }

    let tokenLayer = boardSVG.querySelector("#tokenLayer");
    if (!tokenLayer) {
        tokenLayer = document.createElementNS(
            "http://www.w3.org/2000/svg", "g");
        tokenLayer.setAttribute("id", "tokenLayer");
        boardSVG.appendChild(tokenLayer);
    }

    GooseLudo.state.tokens.forEach((token) => {
        const tokenId = `token-${token.player}-${token.id}`;
        let tokenImage = boardSVG.querySelector(`#${tokenId}`);
        if (!tokenImage) {
            tokenImage = document.createElementNS(
                "http://www.w3.org/2000/svg", "image");
            tokenImage.setAttribute("href", tokenFiles[token.player]);
            tokenImage.setAttribute("width", tokenSize);
            tokenImage.setAttribute("height", tokenSize);
            tokenImage.setAttribute("class", `token ${token.player}`);
            tokenImage.setAttribute("id", tokenId);
            tokenImage.dataset.player = token.player;
            tokenImage.dataset.tokenId = token.id;
            tokenImage.addEventListener("click", tokenClicked);
            tokenLayer.appendChild(tokenImage);
        }
    });
};

const getTokenCoords = function (token) {
    if (token.position === "home") {
        return boardCoords.homePositions[token.player][token.id];
    }
    if (token.position === token.player + "8") {
        return boardCoords.endZones[token.player][token.id]; // edit
    }
    if (typeof token.position === "number"
        && token.position >= 1
        && token.position <= boardCoords.mainPath.length) {
        return boardCoords.mainPath[token.position - 1];
    }
    console.log(token.position.includes(token.player));

    if (token.position.includes(token.player)) {
        return boardCoords.finalPath[token.player][Number(token.position.slice(-1)) - 1];
    }
    return { x: 0, y: 0 };
};

const renderPieces = function () {
    if (!boardSVG) { return; }

    GooseLudo.state.tokens.forEach((token) => {
        const tokenImage = boardSVG.querySelector(
            `#token-${token.player}-${token.id}`
        );
        if (!tokenImage) { return; }

        const coords = getTokenCoords(token);

        // Update the position of the token based on its current state
        // barrier code here - edit - give id then shift outside the foreach
        const positionPieces = GooseLudo.anotherPieceAtPosition(token); // colour?
        if (positionPieces.length === 2 && token.position !== "home") {
            const index = token.id % 2;
            console.log(index, "token", token.id, "positionPieces", positionPieces);
            if (index === 0 && horizontalSquares.includes(token.position)) {
                tokenImage.setAttribute("x", coords.x - (tokenSize / 2));
            }
            else if (index === 0) {
                tokenImage.setAttribute("y", coords.y - (tokenSize / 2));
            }
            else {
                tokenImage.setAttribute("x", coords.x);
                tokenImage.setAttribute("y", coords.y);
            }
        }
        else {
            tokenImage.setAttribute("x", coords.x);
            tokenImage.setAttribute("y", coords.y);
        }
        tokenImage.style.display = "block";
    });

};

function loadBoardSVG() {
    return new Promise((resolve, reject) => {
        fetch("assets/board.svg")
            .then((response) => response.text())
            .then((svgContent) => {
                document.getElementById("game_board").innerHTML = svgContent;
                boardSVG = document.getElementById("game_board").querySelector(
                    "svg");

                if (!boardSVG.getAttribute("viewBox")) {
                    boardSVG.setAttribute("viewBox", "0 0 1172 1172");
                }

                //createBoardDotElements(); // show coordinates 
                createTokenElements();
                boardReady = true;
                renderPieces();
                resolve();
            })
            .catch((error) => {
                console.error("Error loading SVG:", error);
                document.getElementById("game_board").innerHTML =
                    "<p style='color: red; '>Error loading board.svg</p>";
                reject(error);
            });
    });
}

const rollButton = document.getElementById("roll-button");
const endTurnButton = document.getElementById("end-turn-button");
const currentPlayerLabel = document.getElementById("current-player");
const diceResultLabel = document.getElementById("dice-result");
const statusMessage = document.getElementById("status-message");
const availableMovesList = document.getElementById("available-moves");

//const loadGameState = () => {

const gameState = {
    rolls: 0,
    reroll: true,
    diceResults: null,
    // only init on
    currentPlayer: GooseLudo.playerList[GooseLudo.state.currentPlayer],
    selectedPiece: null,
    availableMoves: []
};

// Web text updates

const updateCurrentPlayer = () => {
    currentPlayerLabel.textContent = GooseLudo.playerList[
        GooseLudo.state.currentPlayer
    ];
};

const setStatus = (text) => {
    statusMessage.textContent = text;
};

const setDiceResult = (diceResults) => {
    if (!diceResults) {
        diceResultLabel.textContent = "-";
        return;
    }
    diceResultLabel.textContent = diceResults.join(" + ");
};

// Variable updates

const clearSelection = () => {
    gameState.selectedPiece = null;
    boardSVG.querySelectorAll(".token.selected").forEach((node) => {
        node.classList.remove("selected");
    });
};

const clearSelectable = () => {
    boardSVG.querySelectorAll(".token.selectable").forEach((node) => {
        node.classList.remove("selectable");
    });
};

const updateAvailableMoves = () => {
    availableMovesList.innerHTML = "";
    gameState.availableMoves.forEach((piece) => {
        const item = document.createElement("li");
        item.textContent = `Piece ${piece.id} at ${piece.position}`;
        availableMovesList.appendChild(item);
    });
};

// Web visuals updates

const highlightSelectableTokens = () => {
    clearSelectable();
    gameState.availableMoves.forEach((piece) => {
        const tokenImage = boardSVG.querySelector(
            `#token-${piece.player}-${piece.id}`
        );
        if (tokenImage) {
            tokenImage.classList.add("selectable");
        }
    });
};

const moveSelectedPiece = (piece) => {
    if (!gameState.diceResults) {
        return;
    }

    const [newPos, updatedDiceResults] = GooseLudo.move(
        GooseLudo.playerList[GooseLudo.state.currentPlayer],
        piece,
        [...gameState.diceResults]
    );

    GooseLudo.squareEffects(GooseLudo.playerList[
        GooseLudo.state.currentPlayer
    ], piece, newPos);
    gameState.diceResults = updatedDiceResults;
    clearSelection();
    clearSelectable();
    renderPieces();

    if (GooseLudo.isVictory()) {
        setStatus(`${GooseLudo.playerList[
            GooseLudo.state.currentPlayer
        ]} wins!`);
        rollButton.disabled = true;
        endTurnButton.disabled = true;
        return;
    }

    /*     if (gameState.diceResults !== [0, 0]) {
            setStatus("A piece can still be moved");
            setDiceResult(gameState.diceResults);
            // mini function?
            const movable = GooseLudo.getMovablePieces(
                gameState.currentPlayer, gameState.diceResults
            );
            gameState.availableMoves = movable;
            updateAvailableMoves();
            rollButton.disabled = true;
            endTurnButton.disabled = true;
            return;
        } */

    if (gameState.reroll && gameState.rolls < 3) {
        setStatus(
            "Move completed. Press Roll again for extra turn."
        );
        rollButton.disabled = false;
        endTurnButton.disabled = true;
    } else {
        setStatus("Move completed. Turn ends.");
        endTurnButton.disabled = false;
    }
};

function tokenClicked(event) {
    const tokenImage = event.currentTarget;
    const player = tokenImage.dataset.player;
    const tokenId = Number(tokenImage.dataset.tokenId);
    const currentPlayer = GooseLudo.playerList[GooseLudo.state.currentPlayer];

    if (player !== currentPlayer) {
        setStatus("Choose a piece for the current player.");
        return;
    }

    const piece = GooseLudo.state.tokens.find(
        (token) => token.player === player && token.id === tokenId
    );
    if (!piece) return;

    const available = gameState.availableMoves.find(
        (token) => token.player === piece.player && token.id === piece.id
    );
    if (!available) {
        setStatus("That piece cannot move with the current dice.");
        return;
    }

    if (gameState.diceResults === [0, 0]) {
        setStatus("Out of moves");
        setDiceResult(gameState.diceResults);
        endTurnButton.disabled = false;
        return;
    }

    clearSelection();
    tokenImage.classList.add("selected");
    gameState.selectedPiece = piece;
    setStatus(`Selected piece ${piece.id
        }. Press End Turn or Roll again after move.`);
    moveSelectedPiece(piece);
}

const handleRoll = () => {
    const currentPlayer = GooseLudo.playerList[GooseLudo.state.currentPlayer];
    const [diceResults, rolls, reroll, reason] = GooseLudo.roll(
        currentPlayer, gameState.rolls, gameState.reroll
    );

    gameState.currentPlayer = currentPlayer;
    gameState.diceResults = diceResults;
    gameState.rolls = rolls;
    gameState.reroll = reroll;
    setDiceResult(diceResults);

    // make into mini function??
    const movable = GooseLudo.getMovablePieces(currentPlayer, diceResults);
    gameState.availableMoves = movable;
    updateAvailableMoves();

    if (diceResults === [0, 0]) {
        setStatus(`Rolled a ${reason} three times, last moved piece returns home`);
    }

    if (movable.length === 0) {
        setStatus("No legal moves available. Turn ends.");
        rollButton.disabled = true;
        endTurnButton.disabled = false;
        return;
    }

    setStatus("Select one of the highlighted pieces to move.");
    highlightSelectableTokens();
    rollButton.disabled = true;
    endTurnButton.disabled = false;
};

const endTurn = () => {
    GooseLudo.playerNext(GooseLudo.state.currentPlayer);
    gameState.rolls = 0;
    gameState.reroll = true;
    gameState.diceResults = null;
    gameState.availableMoves = [];
    gameState.selectedPiece = null;
    updateCurrentPlayer();
    setDiceResult(null);
    updateAvailableMoves();
    clearSelectable();
    setStatus("New turn. Press Roll to begin.");

    console.log(GooseLudo.state.tokens);

    rollButton.disabled = false;
    endTurnButton.disabled = true;
    renderPieces();
};

const initialiseUI = () => {
    updateCurrentPlayer();
    setStatus("Press Roll to begin.");
    setDiceResult(null);
    rollButton.addEventListener("click", handleRoll);
    endTurnButton.addEventListener("click", endTurn);
};



document.addEventListener("DOMContentLoaded", () => {
    loadBoardSVG().then(() => {
        initialiseUI();
    });
});

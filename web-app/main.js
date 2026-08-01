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

    mainPath: [ // -thirty wide -twenty high
        { x: 690, y: 1140 }, // one
        { x: 690, y: 1080 },
        { x: 690, y: 1020 },
        { x: 690, y: 960 },
        { x: 690, y: 900 },
        { x: 690, y: 840 },
        { x: 690, y: 780 },
        { x: 690, y: 720 },

        { x: 720, y: 690 },
        { x: 780, y: 690 },
        { x: 840, y: 690 },
        { x: 900, y: 690 },
        { x: 960, y: 690 },
        { x: 1020, y: 690 },
        { x: 1080, y: 690 },
        { x: 1140, y: 690 },

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
            { x: 1100, y: 590 }
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



const getTokenCoords = function (token) {
    if (token.position === "home") {
        return boardCoords.homePositions[token.player][token.id];
    }
    if (token.position === "end") {
        return boardCoords.finalPath[token.player][token.id];
    }
    if (typeof token.position === "number" && token.position >= 1 &&
        token.position <= boardCoords.mainPath.length) {
        return boardCoords.mainPath[token.position - 1];
    }
    return { x: 0, y: 0 };
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

const renderPieces = function () {
    if (!boardSVG) { return; }

    GooseLudo.state.tokens.forEach((token) => {
        const tokenImage = boardSVG.querySelector(
            `#token-${token.player}-${token.id}`
        );
        if (!tokenImage) return;

        const coords = getTokenCoords(token);
        tokenImage.setAttribute("x", coords.x);
        tokenImage.setAttribute("y", coords.y);
        tokenImage.style.display = "block";
    });
};

const rollButton = document.getElementById("roll-button");
const endTurnButton = document.getElementById("end-turn-button");
const currentPlayerLabel = document.getElementById("current-player");
const diceResultLabel = document.getElementById("dice-result");
const statusMessage = document.getElementById("status-message");
const availableMovesList = document.getElementById("available-moves");

const gameState = {
    rolls: 0,
    reroll: true,
    diceResults: null,
    currentPlayer: GooseLudo.playerList[GooseLudo.state.currentPlayer],
    selectedPiece: null,
    availableMoves: []
};

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

    clearSelection();
    tokenImage.classList.add("selected");
    gameState.selectedPiece = piece;
    setStatus(`Selected piece ${piece.id
        }. Press End Turn or Roll again after move.`);
    moveSelectedPiece(piece);
}

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
    rollButton.disabled = false;
    endTurnButton.disabled = true;
    renderPieces();
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

const handleRoll = () => {
    const currentPlayer = GooseLudo.playerList[GooseLudo.state.currentPlayer];
    const [diceResults, rolls, reroll] = GooseLudo.roll(
        currentPlayer, gameState.rolls, gameState.reroll
    );

    gameState.currentPlayer = currentPlayer;
    gameState.diceResults = diceResults;
    gameState.rolls = rolls;
    gameState.reroll = reroll;
    setDiceResult(diceResults);

    const movable = GooseLudo.getMovablePieces(currentPlayer, diceResults);
    gameState.availableMoves = movable;
    updateAvailableMoves();

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

const initializeUI = () => {
    updateCurrentPlayer();
    setStatus("Press Roll to begin.");
    setDiceResult(null);
    rollButton.addEventListener("click", handleRoll);
    endTurnButton.addEventListener("click", endTurn);
};

function loadBoardSVG() {
    return new Promise((resolve, reject) => {
        fetch("board.svg")
            .then((response) => response.text())
            .then((svgContent) => {
                document.getElementById("game_board").innerHTML = svgContent;
                boardSVG = document.getElementById("game_board").querySelector(
                    "svg");

                if (!boardSVG.getAttribute("viewBox")) {
                    boardSVG.setAttribute("viewBox", "0 0 1172 1172");
                }

                createBoardDotElements();
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

document.addEventListener("DOMContentLoaded", () => {
    loadBoardSVG().then(() => {
        initializeUI();
    });
});

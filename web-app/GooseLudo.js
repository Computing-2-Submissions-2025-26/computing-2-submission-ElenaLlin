import R from "./ramda.js";

/**
 * @namespace GooseLudo
 * @author Elena Llinares
 */
const GooseLudo = {};

const mainPathLength = 68;
const safeSquares = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67];
const homePositions = [4, 21, 38, 55];
const endZonePathLength = 7;
const colours = ["y", "b", "r", "g"];
GooseLudo.playerList = ["yellow", "blue", "red", "green"];
GooseLudo.tokens = [];

// board squares ids are on coordinates in the board
const board = [
    [0, 0, 0, 0, 0, 0, 0, 35, 35, 34, 34, 33, 33, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 36, 36, "r0", "r0", 32, 32, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 37, 37, "r1", "r1", 31, 31, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 38, 38, "r2", "r2", 30, 30, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 39, 39, "r3", "r3", 29, 29, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 40, 40, "r4", "r4", 28, 28, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 41, 41, "r5", "r5", 27, 27, 0, 0, 0, 0, 0, 0, 0],
    [50, 49, 48, 47, 46, 45, 44, 4342, 42, "r6", "r6", 26, 2625, 24, 23, 22, 21, 20, 19, 18],
    [50, 49, 48, 47, 46, 45, 44, 43, "gr", "r", "r", "rb", 25, 24, 23, 22, 21, 20, 19, 18],
    [51, "g0", "g1", "g2", "g3", "g4", "g5", "g6", "g", "gr", "rb", "b", "b6", "b5", "b4", "b3", "b2", "b1", "b0", 17],
    [51, "g0", "g1", "g2", "g3", "g4", "g5", "g6", "g", "gy", "yb", "b", "b6", "b5", "b4", "b3", "b2", "b1", "b0", 17],
    [52, 53, 54, 55, 56, 57, 58, 59, "gy", "y", "y", "yb", 9, 10, 11, 12, 13, 14, 15, 16],
    [52, 53, 54, 55, 56, 57, 58, 5960, 60, "y6", "y6", 8, 89, 10, 11, 12, 13, 14, 15, 16],
    [0, 0, 0, 0, 0, 0, 0, 61, 61, "y5", "y5", 7, 7, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 62, 62, "y4", "y4", 6, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 63, 63, "y3", "y3", 5, 5, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 64, 64, "y2", "y2", 4, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 65, 65, "y1", "y1", 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 66, 66, "y0", "y0", 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 67, 67, 68, 68, 1, 1, 0, 0, 0, 0, 0, 0, 0]
];

const setSquareTypes = function (sq, i) {
    sq.id = i + 1; // 1-based indexing for squares
    sq.x = 0;
    sq.y = 0;
    if (safeSquares.includes(i)) {
        sq.type = "safe";
    }
    if (homePositions.includes(i)) {
        // map the home square to a player index based on order in homePositions
        sq.colour = colours[homePositions.indexOf(i)];
        sq.type = "home";
    }
};

const endZoneSquares = function (player, i) {
    const endSq = {};

    endSq.x = 0;
    endSq.y = 0;
    endSq.type = "endZone";

    // map the home square to a player index based on order in homePositions
    endSq.colour = colours[player];
    endSq.id = endSq.colour + String(i);

    GooseLudo.boardSquares.push(endSq);

};

const createTokens = function (players) {
    R.forEach(function (player) {
        // create four distinct token objects for this player
        const newTokens = Array.from({ length: 4 }, () => ({
            player: player,
            position: "home"
        }));

        // append to existing tokens
        GooseLudo.tokens = R.concat(GooseLudo.tokens || [], newTokens);
    }, players);
};

GooseLudo.startingBoard = function (players) {

    GooseLudo.boardSquares = Array.from({ length: mainPathLength }, () => ({
        id: 0,
        type: "track",
        colour: "white",
        x: 0,
        y: 0
    }));

    GooseLudo.boardSquares.forEach((sq, i) => setSquareTypes(sq, i));

    createTokens(GooseLudo.playerList);

    GooseLudo.playersList.forEach((player, id) => endZoneSquares(player, id));

};
GooseLudo.startingBoard(GooseLudo.playerList); // edited in main.js onclick

// whos turn
// - on first turn everyone rolls to figure this out

const determineFirstPlayer = function () {
};

GooseLudo.playerNext = function (lastPlayer) {
    const currentPlayer = GooseLudo.playerList[
        (lastPlayer + 1) % GooseLudo.playerList.length
    ];
    return currentPlayer;
};


// roll - always two dice
// - if 5 and pieces in home then release piece
// - if all pieces are out of house then 6 = seven
// - if you roll a 6 and have a barrier, you break the barrier
// - if both die have same number then roll again hasta tres vezes
// - if you roll a six roll again up to three times

GooseLudo.roll = function (playerTurn, rolls, reroll) {
    const diceResults = [];

    if (reroll && rolls < 3) {
        rolls += 1;
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        diceResults.push(d1, d2);

        // extra roll if any die is 6 or both dice are equal (double)
        reroll = (d1 === d2) || d1 === 6 || d2 === 6;
        // if we've reached 3 rolls stop regardless
    }

    if (rolls === 3) {
        // if we rolled 3 times last piece moved dies
        // need to store last piece moved by player
    }

    // If player had all their pieces out of home, treat 6 as 7
    if (playerTurn) {
        const playerTokens = GooseLudo.tokens.filter(
            (token) => token.player === playerTurn
        );
        const anyAtHome = playerTokens.some((token) => token.position === "home");
        if (!anyAtHome) {
            R.forEach(function (die, i) {
                if (die === 6) { diceResults[i] = 7; }
            }, diceResults);
        }
    }

    return [diceResults, rolls, reroll];
};

// move
// - pick piece and move
// - if land on different players piece then send that piece back to home
// - if land on different players piece and its safety then no eating
// - if land on safe that piece cant be eaten
//      else can be eaten
// - if land on square with own piece create barrera
// - if will land on piece with any two pieces then cant move there
const leaveHome = function (playerTurn, piece, diceResults) {
    piece.position = homePositions.indexOf(playerTurn); // playerTurn = int
    diceResults.splice(diceResults.indexOf(5), 1); // removes first 5
};

const canMoveTo = function (playerTurn, piece, newPos) {
    // barrier in inbetween squares


    return true;
};

const movablePieces = function (playerTurn, diceResults) {
};

const checkCapture = function (playerTurn, piece, newPos) {
};

GooseLudo.move = function (playerTurn, piece, diceResults) {
    if (piece.position === "home" && diceResults.includes(5)) {
        const fives = diceResults.filter((die) => die === 5);
        fives.forEach((five) => leaveHome(playerTurn, piece, diceResults));
        return;
    }

    const moveDistance = diceResults.reduce(
        (dieOne, dieTwo) => dieOne + dieTwo,
        0
    );

    const newPos = piece.position + moveDistance;
    const movePossible = canMoveTo(playerTurn, piece, newPos);
    if (!movePossible) {
        return piece.position; // no move
    }

    checkCapture(playerTurn, piece, newPos);

    piece.position = newPos;
    diceResults = []; // all dice used up
    return [newPos, diceResults];
};

GooseLudo.squareEffects = function (playerTurn, piece, newPos) {
    // oca squares
    // eating
    // barriers

    // update piece properties based on square effects
};



GooseLudo.playersTurn = function () {
    const currentPlayer = GooseLudo.playerNext(lastPlayer);

    let rolls = 0;
    let reroll = true;
    while (reroll && rolls < 3) {
        const [diceResults, updatedRolls, updatedReroll] = GooseLudo.roll(
            currentPlayer, rolls, reroll
        );
        rolls = updatedRolls;
        reroll = updatedReroll;

        // choose piece to move - define piece
        const pieceToMove = null; // TODO: implement piece selection logic
        const [newPos, updatedDiceResults] = GooseLudo.move(currentPlayer, pieceToMove, diceResults);

        GooseLudo.squareEffects(currentPlayer, pieceToMove, newPos);
    }

    const lastPlayer = currentPlayer;

};



GooseLudo.isVictory = function () {
    // is there any player who has all their tokens in the end zone?
    return GooseLudo.playerList.some(function (p) {
        const playerTokens = GooseLudo.tokens.filter(
            (token) => token.player === p
        );
        return playerTokens.length > 0 && playerTokens.every(
            (token) => token.position === "end"
        );
    });
};


export default Object.freeze(GooseLudo);
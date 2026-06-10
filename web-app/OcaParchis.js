import R from "./ramda.js";

/**
 * @namespace OcaParchis
 */
const OcaParchis = {};

const numeroCasillas = 68;
const casillasSeguras = [5, 12, 17, 22, 29, 34, 39, 46, 51, 56, 63, 68];
const casillasCasa = [5, 22, 39, 56];
const casillasMetaLlegada = 7;
const players = colours.indexedBy(R.identity);
const colours = ["yellow", "blue", "red", "green"];
OcaParchis.tokens = [];

const setSquareTypes = function (square, i) {
    square.id = i;
    square.x = 0;
    square.y = 0;
    if (casillasSeguras.includes(i)) {
        square.type = "safe";
    }
    if (casillasCasa.includes(i)) {
        // map the home square to a player index based on order in casillasCasa
        square.colour = Object.keys(players)[casillasCasa.indexOf(i)];
        square.type = "home";
    }
};

const createTokens = function (players) {
    R.forEach(players, function (player) {
        R.concat(
            R.repeat({
                player: players[player],
                position: "home"
            }, 4),
            tokens
        );
    });
};

OcaParchis.startingBoard = function () {
    OcaParchis.boardSquares = R.repeat({
        id: null,
        type: "track",
        colour: "white",
        x: 0,
        y: 0
    }, numeroCasillas);

    // Note: squares are 1-based in casillas arrays, keep id consistent
    OcaParchis.boardSquares.forEach((sq, i) => setSquareTypes(sq, i));

    createTokens(players);
};


// FUNCTIONS

// whos turn
// - on first turn everyone rolls to figure this out
OcaParchis.playerNext = function () {

};





// roll - always two dice
// - if 5 and pieces in home then release piece
// - if all pieces are out of house then 6 = seven
// - si tiras un 6 y tienes barrera, rompes barrera
// - if both die have same number then roll again hasta tres vezes
// - si tiras un seis tira otra vez hasta tres vezes

OcaParchis.roll = function (player = undefined) {
    // player: optional colour string (e.g., 'yellow') or numeric id
    const diceResults = [];
    let rolls = 0;
    let reroll = true;

    while (reroll && rolls < 3) {
        rolls += 1;
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        diceResults.push(d1, d2);

        // extra roll if any die is 6 or both dice are equal (double)
        reroll = (d1 === d2) || d1 === 6 || d2 === 6;
        // if we've reached 3 rolls stop regardless
    }

    // If player provided and all their pieces are out of home, treat 6 as 7
    if (player !== undefined) {
        const playerID = typeof player === "string" ? players[player] : player;
        const playerTokens = OcaParchis.tokens.filter(
            (t) => t.player === playerID
        );
        const anyAtHome = playerTokens.some((t) => t.position === "home");
        if (!anyAtHome) {
            R.forEach(function (die, i) {
                if (die === 6) { diceResults[i] = 7; }
            }, diceResults);
        }
    }

    return diceResults;
};

// move
// - pick piece and move
// - if land on different players piece then send that piece back to home
// - if land on different players piece and its safety then no eating
// - if land on seguro that piece cant be eaten
//      else can be eaten
// - if land on square with own piece create barrera
// - if will land on piece with any two pieces then cant move there

OcaParchis.move = function (playerTurn, piece, diceResults) {
    if (piece.position === "home" && diceResults.includes(5)) {
        piece.position = casillasCasa.indexOf(playerTurn); // playerTurn = int
        diceResults.splice(diceResults.indexOf(5), 1); // removes first 5
        return;
    }

    const moveDistance = diceResults.reduce(
        (dieOne, dieTwo) => dieOne + dieTwo,
        0
    );

    piece.position += moveDistance;
    return;
};


OcaParchis.isVictory = function () {
    // hay algun jugador queue tenga todas las fichas en la meta?
};

export default Object.freeze(OcaParchis);